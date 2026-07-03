---
kind: blog
title: "Notes: The Duct Tape Era"
---

# Notes: The Duct Tape Era

Working file. Not a post. Dumping everything we discussed so the actual draft has source material to pull from.

## The thesis (the user's framing, in his words)

> Linux is just about patching the holes like that meme, basically every week something breaks and you are forced to patch things.

> The most amazing thing about Linux is also the reason people fear it the most: you don't know what you're dealing with most of the time, and you're just running random commands and installing software. But that's how everything got built. Services came from people facing difficulties and trying to provide support for complex things.

> Scripts solving personal problems. Linux is me patching the duct tape. The era of self-built software is coming. Anybody can patch the duct tape if they have a problem and Claude can solve it. The common ground.

The thesis is general, not personal. The series is not "look at my journey." It is "this capability has been democratized; here are worked examples."

## Voice

- First person, but the "I" is incidental. The reader's problem will look different. The point is the shape of solving it.
- No false humility, no heroic framing. Honest about not reading every line of generated code. Trust gradients are how engineers actually work.
- No em dashes, no en dashes. Plain hyphens or split sentences.

## What changed

Old loop:
1. Hit a problem
2. Post on a forum
3. Wait 3 days for a guess
4. Try it
5. Post again

New loop:
1. Hit a problem
2. Describe it to Claude
3. Get a tailored script in minutes
4. Often runs first try, sometimes needs one round of debugging

The skill is not eliminated. The pain that *built* the skill is what got compressed. Whether that is a net gain depends on what you do with the time saved.

## The platform argument (the load-bearing claim)

Linux is the only mainstream platform where end-user patching is actually possible. On closed systems, when something breaks:
- macOS: "feature working as intended", wait for the next OS update
- Windows: registry hacks if you're lucky, otherwise the same wait
- iOS/Android (stock): no chance

On Linux:
- The config file is a text file you can `cat`
- The service is a unit file you can override
- The daemon's source is on your disk somewhere if you really want
- The community has probably already patched the exact thing you're hitting

That is the duct tape canvas. AI is the new flex tape that any non-expert can wield.

## Evidence (the artifacts)

All of these live on the user's machine. Each is a worked example of personal problem -> bash script -> permanent fix.

### 1. `rekey` (~/.local/bin/rekey)

Re-pairs the MX Keys Mini keyboard via bluetoothctl when its bond breaks.

**Four-layer descent (manifesto-friendly version of the story):**

1. **Pop!_OS Bluetooth panel.** Three buttons: connect, disconnect, forget. No re-pair flow, no PIN dialog. Supplied tool not built for the case where pairing itself is broken.
2. **`blueman`.** Separate GUI Bluetooth manager. More options than the Pop!_OS panel. Same broken contract with the notification daemon: PIN never surfaces as a system notification. Keyboard sits in connected-but-not-paired purgatory. The GUIs both abstract away the primitive (PIN visibility) that the bug requires you to see.
3. **`bluetoothctl`.** This is the layer that ACTUALLY SOLVED IT. `bluetoothctl` does not route the PIN through the notification daemon. When the BLE agent displays a passkey, it prints `[agent] Passkey: 123456` directly into the terminal. The PIN was always there; the two GUIs above just hid it.
4. **`rekey`.** AUTOMATION of the bluetoothctl flow, not a new solution. The flow is ~8 steps (remove stale entry, set agent, scan, pair, watch PIN, trust, connect) and has to happen inside the keyboard's short pairing-mode window. The script handles the steps and re-prints the PIN in a banner that cannot be missed even when scrolled away.

**The load-bearing manifesto insight:** lower layers on Linux do not obscure primitives that higher layers hide. The GUIs hid the PIN. The CLI exposed it. AI helps you find that lower layer without the years of pain that would otherwise be required to know where to look.

The technical detail below (auth=3 vs auth=2, CSR dongle borderline-compliance) belongs in the dedicated post 1, not the manifesto.

**Technical detail (for post 1):**

- Symptom: keyboard stops typing every few days, mouse never breaks
- Wrong theory: dual-boot Windows registry key conflict (Google AI suggested copying LinkKey from Windows registry)
- Real cause: keyboard pairs with `Authenticated=3` (LE Secure Connections with MITM passkey entry, mandatory per BT spec for HID input devices). Mouse pairs with `Authenticated=2` (Just Works). The strict 4-way handshake of MITM exposes every CSR-dongle firmware glitch; Just Works papers over them. Multi-channel Logitech keyboards use a separate BLE address per channel, so dual-boot is irrelevant (different pairing slots).
- Hardware verdict: the CSR USB Bluetooth dongle (`lsusb` ID `0a12:0001`) is a counterfeit clone with weak BLE. Permanent fix is a Logi Bolt receiver. Software fix is the `rekey` script.
- Script does: removes stale entry, sets agent to KeyboardDisplay, scans, pairs, detects PIN in real time and prints in big yellow banner, trusts + connects.

**Hardware addendum (worth mentioning):** Logi Bolt receiver pairs well with a KVM. KVM switches the USB port between machines, the receiver lives on the USB side, so flipping the KVM auto-routes the keyboard and mouse to whichever machine is currently selected. No channel buttons to press, no pairing churn between hosts. This is the actual permanent fix.

### 2. `fix-display.sh` + `~/.config/autostart/fix-display.desktop`

Four lines. 168 bytes. Fixes a login-time race condition where Pop!_OS COSMIC desktop does not restore the right HDMI audio profile or the ultrawide monitor mode (2560x1080 @ 60Hz).

```bash
#!/bin/bash
sleep 15
pactl set-card-profile alsa_card.pci-0000_00_1f.3 output:hdmi-stereo+input:analog-stereo
sleep 2
cosmic-randr mode HDMI-A-1 2560 1080 --refresh 60
```

`sleep 15` is the honest admission: there is no clean way to ask "is the desktop ready?" so you guess. The autostart `.desktop` file wires it into login.

Post hook: sometimes the patch IS four lines. The skill is figuring out which four.

### 3. The Realme home-server chain

Phone is a Realme GT Master with a dead screen. Path: backup -> wipe -> Termux + sshd + proot Ubuntu -> permanent home server.

- `connect-phone.sh`: wireless ADB connect (try two IPs, scoped to `eno1` interface)
- `debloat.sh`: ~70 ADB uninstalls of OEM bloatware (Amazon, Facebook, Heytap, ColorOS, Realme apps, Google bloat)
- `pull-appdata.sh` (12 apps) -> `pull-appdata2.sh` (30 apps). Evolution visible in the version bump.
- `copy-to-sd.sh`: rsync the entire phone backup to an SD card with sane folder names (DCIM, WhatsApp media and docs, Documents, Telegram, Spotify, voice recordings)

Post hook: your old phone is not e-waste. It is a Linux box you already own. Here is the actual work involved.

### 4. `battery-logger.sh`

92 lines. The most sophisticated of the lot. Polls `adb shell dumpsys battery` over wireless ADB every 60 seconds, parses both standard Android fields AND Realme/OPLUS vendor-specific extras (Charger voltage, Battery current, ChargeFastCharger, PhoneTemp). Writes a CSV log and an aligned human-readable stdout.

Smoking-gun metric (comment in the script): average mA derived from charge counter delta over elapsed window. "If BMS isn't actually pulling charge, this stays at 0 even when level/voltage/charger_mv all look healthy."

Translation: the phone's battery dashboard can lie. The charger says "charging", the voltage looks fine, but the actual coulomb count is not moving. That happens. Stock dashboards do not surface this. Bash + ADB does.

Post hook: when the stock dashboard lies, write your own. You do not need vendor permission to instrument your own hardware.

### 5. `phonectl` (`/home/manu/Personal/Code/Depth Projects/phonectl/`)

A real CLI tool. Bash CLI to manage the phone-server via adb + ssh + scrcpy. v0.1 has 9 working verbs, 22 planned for v1.0, 86 bats tests, npm name reserved, GitHub at `manucompiles/phonectl`. Distributed eventually via npm.

```
phonectl ssh            Drop into Termux shell
phonectl connect        Wireless ADB connect
phonectl status         Model, battery, storage, IP, SSH reachability
phonectl pull / push    File transfer
phonectl init           First-run wizard
phonectl config         Set values
```

Post hook: the script-pile naturally evolved into a real CLI. The path from "five bash scripts" to "an npm package with tests" is now hours, not weekends. Phonectl is the destination of the migration story but is itself the proof that script-piles ARE the larval form of real tools, and AI compresses the metamorphosis.

## Post mapping

| # | Title (provisional) | Artifact(s) | Reader takeaway |
|---|---|---|---|
| 0 | The Duct Tape Era | n/a | The thesis. Linux is the only mainstream platform where you can patch your own tape. AI has lowered the bar. Anyone with a problem can do this now. |
| 1 | The Keyboard, the Dongle, and the Link Key | `rekey` | Worked example. Real symptom, wrong theory, real cause buried in one config field, script that handles it forever. |
| 2 | Four Lines That Fix Every Login | `fix-display.sh` | The patch is sometimes tiny. The skill is finding which lines. |
| 3 | Your Old Phone Is Not E-Waste | phone backup chain | You already own a Linux box. The barrier to using it as one has collapsed. |
| 4 | When the Stock Dashboard Lies, Write Your Own | `battery-logger.sh` | You do not need vendor permission to instrument your own hardware. |
| 5 | From Five Bash Scripts to an npm CLI | `phonectl` | The path from script-pile to shipping tool is now hours, not weekends. Not magic. Compression of the inner loop. |

Open question: post 0 first (thesis-first manifesto framing), or as a closing piece (payoff after the examples). User has not decided.

## Memorable phrases to maybe use

- "Linux runs on duct tape and good intentions"
- "The flex tape is now AI"
- "Closed systems give you a leaky tank and a customer service phone number. Linux gives you the tank and a roll of tape."
- "Trust gradients are part of how engineers actually work"
- "The pain that built the skill is what got compressed, not the skill itself"
- "Your weird thing is now fixable"

## Things the draft should NOT do

- No "Linux is hard but rewarding!" opening. Bored to death.
- No "AI will replace developers" framing. Wrong angle entirely.
- No bullet-list of "5 reasons Linux is great". Listicle bait, not honest.
- No selling AI tools. The point is the user-as-handyman, not AI-as-product.
- No false humility about the scripts. They are real artifacts that solve real problems. Treat them that way.

## Things the draft SHOULD do

- Open with a concrete moment. A symptom, not a thesis.
- Make the load-bearing claim explicit somewhere: this is only possible on open platforms.
- Show, don't claim. The keyboard story or the four-line login fix are both good as opening examples.
- Be honest about the AI involvement. Not "look how clever I am" and not "look how clever AI is." Look how clever the combination is for the kind of problem an individual hits at 11pm on a Sunday.
- Close with an invitation, not a victory lap.
