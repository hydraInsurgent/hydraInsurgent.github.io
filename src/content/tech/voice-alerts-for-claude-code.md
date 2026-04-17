---
title: "Voice Alerts for Claude Code: Know When It's Waiting or Done"
date: 2026-03-31
description: "Two PowerShell scripts that hook into Claude Code's event system and use Windows TTS to announce when it needs your approval or finishes a task."
---

If you use Claude Code CLI, you've probably run into this: Claude pauses for permission to run a command or read a file, and you have no idea because you're in another tab. You come back 10 minutes later to a frozen session. Or it finishes a task and you don't notice for a while.

The fix is simple — two PowerShell scripts that hook into Claude Code's event system and use Windows text-to-speech to announce what's happening. When Claude needs your approval, you'll hear:

> *"Testing: Claude needs your permission to run a command"*

And when it's done:

> *"Claude finished working on Testing"*

No extra installs needed — it uses built-in Windows TTS and sound effects.

> **Note:** The `Notification` hook only fires in the terminal CLI — it does not fire in the VS Code or other IDE extensions. However, the `PermissionRequest` and `Stop` hooks work in both CLI and IDE. See the [IDE support](#ide-support) section below for a solution that covers both.

## Quick setup

Point Claude at this file and say: **"Set up the speak hooks from this file."** It will create the scripts and wire up the settings for you.

## How it works

Claude Code has [hooks](https://docs.anthropic.com/en/docs/claude-code/hooks) — shell commands that fire on specific events. Three are relevant here:

- **`Notification`** — fires when Claude is waiting for input (e.g. permission prompts). *CLI only.*
- **`PermissionRequest`** — fires when Claude needs permission to use a tool. *Works in both CLI and IDE.*
- **`Stop`** — fires when Claude finishes a task. *Works in both CLI and IDE.*

All three receive a JSON payload via stdin. The scripts parse that payload, play a sound, and speak the project name.

---

## Manual setup

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

if ($speakName) {
    $project = if ($json.cwd) { Split-Path $json.cwd -Leaf } else { "Claude Code" }
    $message = if ($json.message) { $json.message } else { "needs your attention" }

    Add-Type -AssemblyName System.Speech
    $tts = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $tts.Volume = $volume
    $tts.Speak("$project : $message")
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

if ($speakName) {
    $project  = if ($json.cwd) { Split-Path $json.cwd -Leaf } else { "Claude Code" }
    $toolName = if ($json.tool_name) { $json.tool_name } else { "a tool" }

    Add-Type -AssemblyName System.Speech
    $tts = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $tts.Volume = $volume
    $tts.Speak("$project : Claude needs your permission to use $toolName")
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

if ($speakName) {
    $project = if ($json.cwd) { Split-Path $json.cwd -Leaf } else { "Claude Code" }

    Add-Type -AssemblyName System.Speech
    $tts = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $tts.Volume = $volume
    $tts.Speak("Claude finished working on $project")
}
```

### Step 2 — Wire up the hooks

Add to `~/.claude/settings.json` to enable globally across all projects:

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

> **Tip:** If you only use the IDE extension, you can skip the `Notification` hook entirely — `PermissionRequest` covers permission prompts and works in both CLI and IDE.

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

The scripts check for a `.claude/notify-config.json` file in your project root. If found, those values override the defaults. You only need this file in projects where you want different behaviour.

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
    "playSound": 1
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

| Setting | Default | Description |
|---|---|---|
| `volume` | `80` | TTS volume, 0–100 |
| `speakName` | `1` | Set to `0` for sound only, no voice |
| `playSound` | `1` | Set to `0` to skip the WAV sound entirely |

## Good to know

- **No installs needed** — uses built-in Windows TTS (`System.Speech`) and system sounds
- **Filtered events** — the notification script only reacts to `permission_prompt`, so idle nudges won't interrupt you
- **IDE support** — `PermissionRequest` and `Stop` hooks work in both CLI and IDE extensions; `Notification` is CLI only
- **`Stop` vs `SubagentStop`** — `Stop` fires when Claude finishes a full task; add a `SubagentStop` hook the same way if you want alerts for subagent completions too
