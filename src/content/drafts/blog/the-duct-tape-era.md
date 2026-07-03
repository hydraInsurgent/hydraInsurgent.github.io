---
kind: blog
title: The Duct Tape Era
description: Linux has always been the platform where you can patch your own software. AI just handed everyone the roll of tape.
date: 2026-05-12
---

My Logitech MX Keys Mini stopped working again last week. It does this every few days. The mouse, an MX Anywhere 3S paired through the same cheap USB Bluetooth dongle to the same machine, never breaks. The keyboard breaks all the time.

I started where everyone starts. The Pop!_OS Bluetooth panel. Three buttons: connect, disconnect, forget. No re-pair flow, no PIN dialog, no log. The supplied tool was not built for the case where pairing was the thing that was broken.

I went one layer over. `blueman`, a more featureful Bluetooth manager that ships separately on most Linux desktops. More menus, more options, looked promising. It hit the same wall: when pairing started, the OS was supposed to pop up a system notification with "Type 123456 on the keyboard, then Enter." That notification never appeared. The notification daemon and the Bluetooth agent had broken contracts somewhere between them, and `blueman` had no way to expose the PIN itself. The keyboard sat in connected-but-not-paired purgatory. The most diagnostically dead BLE state.

That is the moment most people on closed systems learn to live with. The thing is broken in a way the OS does not surface and the vendor will not fix. You schedule it into your week.

I went one layer down instead. `bluetoothctl`, the command-line surface that BlueZ has shipped for years. This is the tool that actually solved it. `bluetoothctl` does not route the PIN through the notification daemon. When the BLE agent needs to display a passkey, it prints `[agent] Passkey: 123456` straight into its own terminal output. The PIN was there the whole time, just hidden behind two GUI abstractions that did not surface it. Once I knew the right flow inside `bluetoothctl`, pairing worked.

There was also a real reason it kept breaking in the first place. Buried in a single field of a single file in `/var/lib/bluetooth/`, my keyboard's bond record says `Authenticated=3`, the strictest Bluetooth security level, mandatory for any device that can type passwords. My cheap counterfeit USB dongle is borderline-compliant at that level. The mouse pairs at `Authenticated=2` and never trips the bug. That whole story has its own post coming.

The bluetoothctl flow is eight steps and has to happen fast, because the keyboard's pairing-mode window is short. Re-pairing every few days was still a chore. So I wrote `rekey`. It automates the bluetoothctl flow start to finish and adds one thing on top: it watches `bluetoothctl`'s output for the PIN line and re-prints it in a banner I cannot miss, even if I have scrolled away. Next time the keyboard breaks, I type one word.

That is the small version of a bigger story.

## Not every hole gets patched

There is a deeper bug under all this. The reason the PIN never appeared as a system notification is a problem somewhere in Pop!_OS's notification daemon, two layers below where I stopped digging. That is a real hole. It is still leaking. I did not patch it. The keyboard works now, the script routes around the broken layer, and fixing the notification daemon would take an entire afternoon of `journalctl` spelunking and probably a bug report against some package I have never opened.

There is also a paid fix I could buy. Logitech sells a Bolt receiver, around twenty dollars, that bypasses the BLE security dance my cheap dongle keeps stumbling on. The keyboard and mouse would talk to that instead, and this bug would never come back. I am cheap in a good way. The script is the cheaper permanent fix.

The duct-tape philosophy includes knowing which holes to patch and which to route around. That choice is the actual skill being asked of you. AI did not eliminate it. If anything, it made the skill more important, not less. The old gating question was "is this worth a Saturday?" The new gating question is "is this worth twenty minutes?" A lot more things clear that bar. The queue of things you could be doing grows. The discipline shifts from "can I do this" to "should I."

Not today, notification daemon. Not today, twenty dollars.

## What used to take a weekend

There has always been a small group of people who fix this kind of thing themselves. They read source code. They subscribe to mailing lists. They write `awk` scripts to parse `dumpsys` output. When the rest of us were waiting for vendor patches, they were patching.

The tools they used were never the bottleneck. The tools have been around for decades. `bluetoothctl` has shipped with BlueZ for years. `pactl` has been the audio control surface on Linux for almost as long. `adb` lets anyone with a USB cable inspect every running process on their Android phone.

The bottleneck was the time it took to learn what those tools could do, and the discipline to read enough source to make them do it. A Saturday at minimum. Often a long Saturday.

That bottleneck is gone. Not because the problems got simpler. Because the loop between encountering a problem and having a personalized tool that solves it collapsed from days into a chat.

## The thing the conversation never gets right

I see two framings for this shift floating around. Both are wrong.

The first says AI is replacing the people who used to fix these things. That is not what is happening. The people who used to fix these things are still here, still better at it, still building the actual infrastructure under the abstractions. What changed is the floor, not the ceiling.

The second says AI is just generating slop and the people using it do not understand what they are running. There is a thread of truth in that, and I will own my piece of it: I did not read every line of the `rekey` script before I trusted it. But that is also how everyone runs `apt install`. Trust gradients are part of how engineers actually work. The honest version of the story is that I trusted Claude, the script worked, I now have a thing in `~/.local/bin` that I roughly understand and can read at my leisure.

The accurate framing is more boring. The pain that used to *build* the skill got compressed. The skill itself is still required to make anything beyond toys. What you do with the time saved is the entire question.

## Why this only works on Linux

Here is the load-bearing claim. The duct-tape era only works on open systems.

On macOS, when something breaks the way my keyboard breaks, you wait for the next OS release. Maybe it is fixed. Maybe it is documented as intended. There is no `~/.local/bin/rekey` you can write.

On stock Android or iOS, you wait for the OEM. If you are using Realme like I was, that wait is forever.

On Windows, you have more room than the others. Registry hacks, PowerShell, occasionally a vendor SDK. But the surfaces you can patch are smaller, and the patches do not survive updates.

On Linux, the config file is a text file you can `cat`. The service is a unit file you can override with a one-line drop-in. The daemon's source is on your disk somewhere if you really need it. The community has almost certainly already hit the exact bug you are looking at and posted the workaround on a forum from 2017.

That is the canvas. AI is the flex tape that any non-expert can now wield against it.

## The series

I have a small pile of these scripts. A four-line fix that handles my ultrawide monitor and HDMI audio profile on every login. The `rekey` keyboard ritual. A telemetry tool I wrote to catch my phone's charger lying about how much current it was actually pushing. A whole chain of `adb` scripts I used to drain a dying Realme phone, factory-reset it, and turn it into a permanent home server running Termux and proot Ubuntu. And a CLI called `phonectl` that I am building on top of all of it.

The next few posts walk through each one. Not as a portfolio. As worked examples. Your problem will look different. The shape of solving it is the same.

## What to do with this

If you have ever lived with a small daily annoyance because the box said "working as intended", or because the forum thread was four years old, or because you assumed only kernel hackers got to fix things at this level: that assumption has expired.

The platform has been there for thirty years. The tape just got cheaper.

Patch your tank.
