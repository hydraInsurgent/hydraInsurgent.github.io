---
title: "Voice Alerts for Claude Code: Know When It's Waiting or Done"
status: published
date: 2026-03-31
description: "Hook scripts that tap into Claude Code's event system to announce when it needs your approval or finishes a task. Setups for Windows (PowerShell + System.Speech), Linux (Bash + piper), and macOS (Bash + say)."
---

If you use Claude Code CLI, you've probably run into this: Claude pauses for permission to run a command or read a file, and you have no idea because you're in another tab. You come back 10 minutes later to a frozen session. Or it finishes a task and you don't notice for a while.

The fix is a few small hook scripts that tap into Claude Code's event system, play a sound, and speak the project name. When Claude needs your approval, you'll hear:

> *"tasklog: Claude needs your permission to use Bash"*

And when it's done:

> *"Claude finished working on tasklog"*

I originally wrote this for Windows using PowerShell and built-in `System.Speech`. After moving to Pop!_OS, I rewrote the same flow in Bash using [piper](https://github.com/rhasspy/piper) for TTS. A macOS variant is included too — built on the same shape as the Linux scripts, swapping in macOS's built-in `say` and `afplay`. Pick whichever matches your machine.

> **Heads-up on the macOS section:** I don't have a Mac, so the macOS scripts below are an adaptation of the working Linux setup using macOS-native tools. The wiring is identical and the building blocks (`say`, `afplay`, `osascript`) are all stock macOS — but I haven't run them end-to-end. If you try it and find a rough edge, [open an issue](https://github.com/hydraInsurgent/hydraInsurgent.github.io/issues) and I'll fix it.

> **Note:** The `Notification` hook only fires in the terminal CLI — it does not fire in the VS Code or other IDE extensions. However, the `PermissionRequest` and `Stop` hooks work in both CLI and IDE. See the [IDE support](#ide-support) section below.

## Quick setup

Point Claude at this file and say: **"Set up the speak hooks from this file for my OS."** It will detect your platform, create the scripts, and wire up the settings for you.

## How it works

Claude Code has [hooks](https://docs.anthropic.com/en/docs/claude-code/hooks) — shell commands that fire on specific events. Three are relevant here:

- **`Notification`** — fires when Claude is waiting for input (e.g. permission prompts). *CLI only.*
- **`PermissionRequest`** — fires when Claude needs permission to use a tool. *Works in both CLI and IDE.*
- **`Stop`** — fires when Claude finishes a task. *Works in both CLI and IDE.*

All three receive a JSON payload via stdin. The scripts parse that payload, play a sound, and speak the project name.

---

## Windows setup

Windows has built-in TTS via `System.Speech`. For the desktop pop-up notification, we use the [BurntToast](https://github.com/Windos/BurntToast) PowerShell module, which wraps Windows' native toast API.

### Step 0 — Prerequisites

Install the `BurntToast` module once:

```powershell
Install-Module -Name BurntToast -Scope CurrentUser
```

> **Don't want the toast?** Skip this install and remove the `New-BurntToastNotification` lines from each script. TTS and the system sound will still work.

### Step 1 — Create the scripts

Place these three scripts in `~/.claude/`:

**`~/.claude/notify-speak.ps1`**

```powershell
# --- Config (defaults, override per-project via .claude/notify-config.json) ---
$volume     = 80  # TTS volume 0-100
$speakName  = 1   # 0 to play sound only, no speech
$playSound  = 1   # 0 to skip the alert sound
# ------------------------------------------------------------------------------

$input_data = $input | Out-String
$json = $input_data | ConvertFrom-Json -ErrorAction SilentlyContinue

# Only act on permission prompts — ignore idle nudges and other notification types
if ($json.notification_type -ne 'permission_prompt') { exit 0 }

# Load project-level overrides if a .claude/notify-config.json exists in the project
$configPath = Join-Path $json.cwd ".claude\notify-config.json"
if (Test-Path $configPath) {
    $config = (Get-Content $configPath | ConvertFrom-Json).notification
    if ($null -ne $config.volume)    { $volume    = $config.volume }
    if ($null -ne $config.speakName) { $speakName = $config.speakName }
    if ($null -ne $config.playSound) { $playSound = $config.playSound }
}

if ($playSound) {
    (New-Object Media.SoundPlayer 'C:\Windows\Media\Windows Critical Stop.wav').PlaySync()
}

$project = if ($json.cwd) { Split-Path $json.cwd -Leaf } else { "Claude Code" }
$message = if ($json.message) { $json.message } else { "needs your attention" }

if ($speakName) {
    Add-Type -AssemblyName System.Speech
    $tts = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $tts.Volume = $volume
    $tts.Speak("$project : $message")
}

# Desktop pop-up (requires BurntToast module)
if (Get-Module -ListAvailable -Name BurntToast) {
    New-BurntToastNotification -Text "Claude Code: $project", "$message"
}
```

**`~/.claude/notify-speak-permission.ps1`**

```powershell
# --- Config (defaults, override per-project via .claude/notify-config.json) ---
$volume     = 80  # TTS volume 0-100
$speakName  = 1   # 0 to play sound only, no speech
$playSound  = 1   # 0 to skip the alert sound
# ------------------------------------------------------------------------------

$input_data = $input | Out-String
$json = $input_data | ConvertFrom-Json -ErrorAction SilentlyContinue

# Load project-level overrides if a .claude/notify-config.json exists in the project
$configPath = Join-Path $json.cwd ".claude\notify-config.json"
if (Test-Path $configPath) {
    $config = (Get-Content $configPath | ConvertFrom-Json).permissionRequest
    if ($null -ne $config.volume)    { $volume    = $config.volume }
    if ($null -ne $config.speakName) { $speakName = $config.speakName }
    if ($null -ne $config.playSound) { $playSound = $config.playSound }
}

if ($playSound) {
    (New-Object Media.SoundPlayer 'C:\Windows\Media\Windows Critical Stop.wav').PlaySync()
}

$project  = if ($json.cwd) { Split-Path $json.cwd -Leaf } else { "Claude Code" }
$toolName = if ($json.tool_name) { $json.tool_name } else { "a tool" }

if ($speakName) {
    Add-Type -AssemblyName System.Speech
    $tts = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $tts.Volume = $volume
    $tts.Speak("$project : Claude needs your permission to use $toolName")
}

# Desktop pop-up (requires BurntToast module)
if (Get-Module -ListAvailable -Name BurntToast) {
    New-BurntToastNotification -Text "Claude Code: $project", "Permission requested for $toolName"
}
```

**`~/.claude/notify-speak-stop.ps1`**

```powershell
# --- Config (defaults, override per-project via .claude/notify-config.json) ---
$volume     = 80  # TTS volume 0-100
$speakName  = 1   # 0 to play sound only, no speech
$playSound  = 1   # 0 to skip the completion sound
# ------------------------------------------------------------------------------

$input_data = $input | Out-String
$json = $input_data | ConvertFrom-Json -ErrorAction SilentlyContinue

# Load project-level overrides if a .claude/notify-config.json exists in the project
$configPath = Join-Path $json.cwd ".claude\notify-config.json"
if (Test-Path $configPath) {
    $config = (Get-Content $configPath | ConvertFrom-Json).stop
    if ($null -ne $config.volume)    { $volume    = $config.volume }
    if ($null -ne $config.speakName) { $speakName = $config.speakName }
    if ($null -ne $config.playSound) { $playSound = $config.playSound }
}

if ($playSound) {
    (New-Object Media.SoundPlayer 'C:\Windows\Media\tada.wav').PlaySync()
}

$project = if ($json.cwd) { Split-Path $json.cwd -Leaf } else { "Claude Code" }

if ($speakName) {
    Add-Type -AssemblyName System.Speech
    $tts = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $tts.Volume = $volume
    $tts.Speak("Claude finished working on $project")
}

# Desktop pop-up (requires BurntToast module)
if (Get-Module -ListAvailable -Name BurntToast) {
    New-BurntToastNotification -Text "Claude Code: $project", "Finished"
}
```

### Step 2 — Wire up the hooks

Add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "powershell.exe -NonInteractive -File \"C:\\Users\\<you>\\.claude\\notify-speak.ps1\""
          }
        ]
      }
    ],
    "PermissionRequest": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "powershell.exe -NonInteractive -File \"C:\\Users\\<you>\\.claude\\notify-speak-permission.ps1\""
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "powershell.exe -NonInteractive -File \"C:\\Users\\<you>\\.claude\\notify-speak-stop.ps1\""
          }
        ]
      }
    ]
  }
}
```

> **Tip:** The toast guard (`Get-Module -ListAvailable -Name BurntToast`) means the script still works if BurntToast isn't installed — you just won't see the pop-up.

---

## Linux setup (Pop!_OS / Ubuntu / Debian / other)

Linux doesn't have a built-in TTS as nice as Windows', so the setup uses [piper](https://github.com/rhasspy/piper) — a fast, offline neural TTS engine — plus standard PulseAudio + libnotify utilities.

### Step 0 — Prerequisites

```bash
sudo apt install jq libnotify-bin pulseaudio-utils xdotool
```

Install piper and a voice model (one-time):

```bash
mkdir -p ~/.local/share/piper && cd ~/.local/share/piper
curl -L https://github.com/rhasspy/piper/releases/latest/download/piper_linux_x86_64.tar.gz | tar xz
curl -LO https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx
curl -LO https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json
mv en_US-lessac-medium.onnx* piper/
```

### Step 1 — Create the scripts

Place these five scripts in `~/.claude/` and make them executable (`chmod +x ~/.claude/*.sh`):

**`~/.claude/say.sh`** — TTS wrapper. Adjust the paths if you put piper elsewhere.

```bash
#!/usr/bin/env bash
PIPER="$HOME/.local/share/piper/piper/piper"
MODEL="$HOME/.local/share/piper/piper/en_US-lessac-medium.onnx"
echo "$1" | "$PIPER" --model "$MODEL" --output_raw 2>/dev/null \
    | paplay --raw --rate=22050 --channels=1 --format=s16le
```

**`~/.claude/notify-clickable.sh`** — Helper that shows a clickable notification. When clicked, it focuses the VS Code window for that project.

```bash
#!/usr/bin/env bash
# Usage: notify-clickable.sh <urgency> <title> <body> <cwd>
urgency=${1:-normal}
title=$2
body=$3
cwd=$4

(
    action=$(notify-send --app-name="Code" -u "$urgency" \
        --action=default=Open \
        --expire-time=30000 \
        "$title" "$body" 2>/dev/null)

    if [ -n "$action" ] && [ -n "$cwd" ]; then
        project=$(basename "$cwd")
        wid=$(xdotool search --name "Visual Studio Code" 2>/dev/null | while read w; do
            t=$(xdotool getwindowname "$w" 2>/dev/null)
            case "$t" in
                "$project - "*) echo "$w"; break ;;
            esac
        done | head -1)
        [ -n "$wid" ] && xdotool windowactivate --sync "$wid" >/dev/null 2>&1
    fi
) &
disown 2>/dev/null || true
```

**`~/.claude/notify-speak.sh`** — Notification hook. Filters to `permission_prompt` only.

```bash
#!/usr/bin/env bash
input_data=$(cat)
log_file="$HOME/.claude/hooks.log"
timestamp=$(date '+%Y-%m-%d %H:%M:%S')
printf '%s [Notification] %s\n\n' "$timestamp" "$input_data" >> "$log_file"

notification_type=$(printf '%s' "$input_data" | jq -r '.notification_type // empty' 2>/dev/null)
[ "$notification_type" != "permission_prompt" ] && exit 0

cwd=$(printf '%s' "$input_data" | jq -r '.cwd // empty' 2>/dev/null)
message=$(printf '%s' "$input_data" | jq -r '.message // "needs your attention"' 2>/dev/null)
project=$([ -n "$cwd" ] && basename "$cwd" || echo "Claude Code")

volume=80; speak_name=1; play_sound=1
config_file="$cwd/.claude/notify-config.json"
if [ -f "$config_file" ]; then
    v=$(jq -r '.notification.volume    // empty' "$config_file" 2>/dev/null); [ -n "$v" ] && volume=$v
    s=$(jq -r '.notification.speakName // empty' "$config_file" 2>/dev/null); [ -n "$s" ] && speak_name=$s
    p=$(jq -r '.notification.playSound // empty' "$config_file" 2>/dev/null); [ -n "$p" ] && play_sound=$p
fi

[ "$play_sound" = "1" ] && paplay /usr/share/sounds/freedesktop/stereo/dialog-warning.oga 2>/dev/null &
"$HOME/.claude/notify-clickable.sh" normal "Claude Code: $project" "$message" "$cwd"
[ "$speak_name" = "1" ] && ("$HOME/.claude/say.sh" "$project: $message" &)
```

**`~/.claude/notify-speak-permission.sh`** — PermissionRequest hook with a 30s cooldown so rapid-fire prompts don't spam you.

```bash
#!/usr/bin/env bash
input_data=$(cat)
log_file="$HOME/.claude/hooks.log"
timestamp=$(date '+%Y-%m-%d %H:%M:%S')
printf '%s [PermissionRequest] %s\n\n' "$timestamp" "$input_data" >> "$log_file"

cwd=$(printf '%s' "$input_data" | jq -r '.cwd // empty' 2>/dev/null)
tool_name=$(printf '%s' "$input_data" | jq -r '.tool_name // "a tool"' 2>/dev/null)
project=$([ -n "$cwd" ] && basename "$cwd" || echo "Claude Code")

volume=100; speak_name=1; play_sound=1; cooldown=30
config_file="$cwd/.claude/notify-config.json"
if [ -f "$config_file" ]; then
    v=$(jq -r '.permissionRequest.volume    // empty' "$config_file" 2>/dev/null); [ -n "$v" ] && volume=$v
    s=$(jq -r '.permissionRequest.speakName // empty' "$config_file" 2>/dev/null); [ -n "$s" ] && speak_name=$s
    p=$(jq -r '.permissionRequest.playSound // empty' "$config_file" 2>/dev/null); [ -n "$p" ] && play_sound=$p
    c=$(jq -r '.permissionRequest.cooldown  // empty' "$config_file" 2>/dev/null); [ -n "$c" ] && cooldown=$c
fi

cooldown_file="$HOME/.claude/hooks-permission-last-alert"
now_epoch=$(date +%s)
if [ -f "$cooldown_file" ]; then
    last_epoch=$(cat "$cooldown_file" 2>/dev/null)
    if [ -n "$last_epoch" ] && [ $((now_epoch - last_epoch)) -lt "$cooldown" ]; then
        exit 0
    fi
fi
echo "$now_epoch" > "$cooldown_file"

# Pop!_OS sound — swap for /usr/share/sounds/freedesktop/stereo/dialog-warning.oga on Ubuntu/Debian
[ "$play_sound" = "1" ] && paplay /usr/share/sounds/Pop/stereo/notification/theme-demo.oga 2>/dev/null &
"$HOME/.claude/notify-clickable.sh" critical "Claude Code: $project" "Permission requested for $tool_name" "$cwd"
[ "$speak_name" = "1" ] && ("$HOME/.claude/say.sh" "$project: Claude needs your permission to use $tool_name" &)
```

**`~/.claude/notify-speak-stop.sh`** — Stop hook.

```bash
#!/usr/bin/env bash
input_data=$(cat)
log_file="$HOME/.claude/hooks.log"
timestamp=$(date '+%Y-%m-%d %H:%M:%S')
printf '%s [Stop] %s\n\n' "$timestamp" "$input_data" >> "$log_file"

cwd=$(printf '%s' "$input_data" | jq -r '.cwd // empty' 2>/dev/null)
project=$([ -n "$cwd" ] && basename "$cwd" || echo "Claude Code")

volume=80; speak_name=1; play_sound=1
config_file="$cwd/.claude/notify-config.json"
if [ -f "$config_file" ]; then
    v=$(jq -r '.stop.volume    // empty' "$config_file" 2>/dev/null); [ -n "$v" ] && volume=$v
    s=$(jq -r '.stop.speakName // empty' "$config_file" 2>/dev/null); [ -n "$s" ] && speak_name=$s
    p=$(jq -r '.stop.playSound // empty' "$config_file" 2>/dev/null); [ -n "$p" ] && play_sound=$p
fi

[ "$play_sound" = "1" ] && paplay /usr/share/sounds/freedesktop/stereo/complete.oga 2>/dev/null &
"$HOME/.claude/notify-clickable.sh" low "Claude Code: $project" "Finished" "$cwd"
[ "$speak_name" = "1" ] && ("$HOME/.claude/say.sh" "Claude finished working on $project" &)
```

### Step 2 — Wire up the hooks

Add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "Notification": [
      { "matcher": "", "hooks": [{ "type": "command", "command": "/home/<you>/.claude/notify-speak.sh" }] }
    ],
    "PermissionRequest": [
      { "matcher": "", "hooks": [{ "type": "command", "command": "/home/<you>/.claude/notify-speak-permission.sh" }] }
    ],
    "Stop": [
      { "matcher": "", "hooks": [{ "type": "command", "command": "/home/<you>/.claude/notify-speak-stop.sh" }] }
    ]
  }
}
```

> **Tip:** If you only use the IDE extension, you can skip the `Notification` hook entirely — `PermissionRequest` covers permission prompts and works in both CLI and IDE.

---

## macOS setup

> **A note on this section:** I don't run macOS day-to-day, so I haven't tested these scripts end-to-end. They mirror the Linux setup one-for-one with macOS-native equivalents — `say` for TTS, `afplay` for sound effects, and `osascript` for desktop notifications — all of which ship with macOS. Treat this as a known-good starting point rather than a battle-tested recipe; if something needs tweaking, the structure should make it obvious where.

### Step 0 — Prerequisites

The only extra install is `jq` for JSON parsing:

```bash
brew install jq
```

`say` and `afplay` are built into macOS. Desktop toasts use `osascript`, which is also built in.

### Step 1 — Create the scripts

Place these three scripts in `~/.claude/` and make them executable (`chmod +x ~/.claude/*.sh`):

**`~/.claude/notify-speak.sh`** — Notification hook. Filters to `permission_prompt` only.

```bash
#!/usr/bin/env bash
input_data=$(cat)
log_file="$HOME/.claude/hooks.log"
printf '%s [Notification] %s\n\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$input_data" >> "$log_file"

notification_type=$(printf '%s' "$input_data" | jq -r '.notification_type // empty')
[ "$notification_type" != "permission_prompt" ] && exit 0

cwd=$(printf '%s' "$input_data" | jq -r '.cwd // empty')
message=$(printf '%s' "$input_data" | jq -r '.message // "needs your attention"')
project=$([ -n "$cwd" ] && basename "$cwd" || echo "Claude Code")

speak_name=1; play_sound=1
config_file="$cwd/.claude/notify-config.json"
if [ -f "$config_file" ]; then
    s=$(jq -r '.notification.speakName // empty' "$config_file"); [ -n "$s" ] && speak_name=$s
    p=$(jq -r '.notification.playSound // empty' "$config_file"); [ -n "$p" ] && play_sound=$p
fi

[ "$play_sound" = "1" ] && afplay /System/Library/Sounds/Funk.aiff 2>/dev/null &
[ "$speak_name" = "1" ] && (say "$project: $message" &)
osascript -e "display notification \"$message\" with title \"Claude Code: $project\""
```

**`~/.claude/notify-speak-permission.sh`** — PermissionRequest hook with a 30s cooldown.

```bash
#!/usr/bin/env bash
input_data=$(cat)
log_file="$HOME/.claude/hooks.log"
printf '%s [PermissionRequest] %s\n\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$input_data" >> "$log_file"

cwd=$(printf '%s' "$input_data" | jq -r '.cwd // empty')
tool_name=$(printf '%s' "$input_data" | jq -r '.tool_name // "a tool"')
project=$([ -n "$cwd" ] && basename "$cwd" || echo "Claude Code")

speak_name=1; play_sound=1; cooldown=30
config_file="$cwd/.claude/notify-config.json"
if [ -f "$config_file" ]; then
    s=$(jq -r '.permissionRequest.speakName // empty' "$config_file"); [ -n "$s" ] && speak_name=$s
    p=$(jq -r '.permissionRequest.playSound // empty' "$config_file"); [ -n "$p" ] && play_sound=$p
    c=$(jq -r '.permissionRequest.cooldown  // empty' "$config_file"); [ -n "$c" ] && cooldown=$c
fi

cooldown_file="$HOME/.claude/hooks-permission-last-alert"
now_epoch=$(date +%s)
if [ -f "$cooldown_file" ]; then
    last_epoch=$(cat "$cooldown_file")
    if [ -n "$last_epoch" ] && [ $((now_epoch - last_epoch)) -lt "$cooldown" ]; then
        exit 0
    fi
fi
echo "$now_epoch" > "$cooldown_file"

[ "$play_sound" = "1" ] && afplay /System/Library/Sounds/Sosumi.aiff 2>/dev/null &
[ "$speak_name" = "1" ] && (say "$project: Claude needs your permission to use $tool_name" &)
osascript -e "display notification \"Permission requested for $tool_name\" with title \"Claude Code: $project\""
```

**`~/.claude/notify-speak-stop.sh`** — Stop hook.

```bash
#!/usr/bin/env bash
input_data=$(cat)
log_file="$HOME/.claude/hooks.log"
printf '%s [Stop] %s\n\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$input_data" >> "$log_file"

cwd=$(printf '%s' "$input_data" | jq -r '.cwd // empty')
project=$([ -n "$cwd" ] && basename "$cwd" || echo "Claude Code")

speak_name=1; play_sound=1
config_file="$cwd/.claude/notify-config.json"
if [ -f "$config_file" ]; then
    s=$(jq -r '.stop.speakName // empty' "$config_file"); [ -n "$s" ] && speak_name=$s
    p=$(jq -r '.stop.playSound // empty' "$config_file"); [ -n "$p" ] && play_sound=$p
fi

[ "$play_sound" = "1" ] && afplay /System/Library/Sounds/Glass.aiff 2>/dev/null &
[ "$speak_name" = "1" ] && (say "Claude finished working on $project" &)
osascript -e "display notification \"Finished\" with title \"Claude Code: $project\""
```

### Step 2 — Wire up the hooks

Add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "Notification": [
      { "matcher": "", "hooks": [{ "type": "command", "command": "/Users/<you>/.claude/notify-speak.sh" }] }
    ],
    "PermissionRequest": [
      { "matcher": "", "hooks": [{ "type": "command", "command": "/Users/<you>/.claude/notify-speak-permission.sh" }] }
    ],
    "Stop": [
      { "matcher": "", "hooks": [{ "type": "command", "command": "/Users/<you>/.claude/notify-speak-stop.sh" }] }
    ]
  }
}
```

> **Voice and sound choices:** macOS lets you change the `say` voice via *System Settings → Accessibility → Spoken Content* (or `say -v "Samantha" "..."`). The `.aiff` files live in `/System/Library/Sounds/` — swap in whichever you prefer.

---

## IDE support

The `Notification` hook does not fire in VS Code or other IDE extensions — it's tied to the terminal UI. However, the `PermissionRequest` hook covers the main use case: alerting you when Claude needs permission to use a tool.

The `Stop` hook also works in the IDE, so between `PermissionRequest` and `Stop` you get full coverage:

| Hook | What it does | CLI | IDE |
|---|---|---|---|
| `Notification` | Permission prompts + idle alerts | Yes | No |
| `PermissionRequest` | Permission prompts only | Yes | Yes |
| `Stop` | Task completion | Yes | Yes |

If you use both CLI and IDE, keep all three hooks. The `Notification` script filters to `permission_prompt` only, so in CLI you'll hear both `Notification` and `PermissionRequest` fire on a permission prompt — if that's too noisy, you can disable the `Notification` hook and rely solely on `PermissionRequest`.

> **Note:** `PermissionRequest` only fires when Claude actually needs approval — tools in your allow list do not trigger it.

---

## Per-project overrides

All three setups check for a `.claude/notify-config.json` file in your project root. If found, those values override the defaults. You only need this file in projects where you want different behaviour.

```json
{
  "notification": {
    "volume": 80,
    "speakName": 1,
    "playSound": 1
  },
  "permissionRequest": {
    "volume": 80,
    "speakName": 1,
    "playSound": 1,
    "cooldown": 30
  },
  "stop": {
    "volume": 80,
    "speakName": 0,
    "playSound": 1
  }
}
```

You can omit any key you don't need to override. For example, to silence just the stop speech:

```json
{
  "stop": {
    "speakName": 0
  }
}
```

> **Why not use `settings.local.json` hooks for this?** Claude Code merges hooks from global and local settings — both run. There's no override, only addition. The config file approach avoids this by keeping a single hook command globally and letting the script handle per-project behaviour.

---

## Config options

| Setting | Default | Platforms | Description |
|---|---|---|---|
| `volume` | `80` | Windows only | TTS volume, 0–100 (Linux/macOS use system volume) |
| `speakName` | `1` | All | Set to `0` for sound only, no voice |
| `playSound` | `1` | All | Set to `0` to skip the alert sound entirely |
| `cooldown` | `30` | Linux/macOS (`permissionRequest`) | Seconds to suppress repeat alerts |

## Good to know

- **Windows** uses built-in `System.Speech` and system WAVs for TTS + sound, plus the [BurntToast](https://github.com/Windos/BurntToast) PowerShell module for desktop pop-ups. The toast call is guarded so the script still works if BurntToast isn't installed.
- **Linux** uses [piper](https://github.com/rhasspy/piper) for offline neural TTS, plus PulseAudio + libnotify for sound and desktop toasts. The notification toast is clickable — it focuses the VS Code window for that project via `xdotool`. The scripts also write a debug log to `~/.claude/hooks.log` and apply a cooldown on `PermissionRequest` so rapid-fire prompts don't spam you.
- **macOS** uses built-in `say`, `afplay`, and `osascript` — only `jq` needs installing. (Untested by me; see the note at the top of the macOS section.)
- **Filtered events** — the notification script only reacts to `permission_prompt`, so idle nudges won't interrupt you.
- **IDE support** — `PermissionRequest` and `Stop` hooks work in both CLI and IDE extensions; `Notification` is CLI only.
- **`Stop` vs `SubagentStop`** — `Stop` fires when Claude finishes a full task; add a `SubagentStop` hook the same way if you want alerts for subagent completions too.
