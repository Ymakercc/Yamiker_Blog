---
title: "Writing a One-Click Script for Someone Who Can't Debug It"
date: "2026-08-25"
excerpt: "My sister started university with a new laptop and no idea how to partition it or install anything. The hard part of a double-click-and-done script was never the features — it's that it must not frighten anyone when it fails."
tags: ["Windows", "PowerShell", "Tools"]
---

My sister started university this year with a new laptop, and got stuck right after activation: no idea how to partition the disk, no idea what to install, no vocabulary to describe what was wrong.

The request sounds trivial — carve out a D drive, make a few folders, install the usual chat and office apps. As a double-click script, the features take about half an hour. What actually took the time was a different constraint: **the person running this script cannot handle it failing.**

Once that's true, a lot of normally-optional design becomes mandatory.

## Rule one: when unsure, don't touch it

Partitioning is irreversible. And "a brand new laptop" is a far less reliable premise than it sounds.

My first version just read the size of C, did some arithmetic, and called `Resize-Partition`. Then I started counting the mines on that path:

- **The machine may already have a D drive.** Plenty of OEM builds ship with two partitions; cutting another one is pure noise.
- **It may have two physical disks.** On an SSD + HDD machine the right move is to make the second disk into D, not to shrink the system disk.
- **The letter D may be taken** by an optical drive or a USB stick, in which case creating the partition just fails.
- **C may already be encrypted.** That one's the big one — more below.

So step one in the final version isn't partitioning, it's a health check. If any of those four conditions hits, the script **skips partitioning, prints why, and carries on with everything else** — rather than dying on the spot.

> For a user who can't troubleshoot, doing one thing less always beats doing one thing wrong.

The partition size isn't hardcoded either; it's tiered by disk capacity. A 512 GB machine keeps 200 GB on C, a 1 TB machine keeps 280 GB, and D gets the rest. Then it prints the plan and waits for an explicit Y.

## Rule two: Home edition doesn't have the commands you assume

BitLocker was the deepest hole here.

Consumer laptops now ship with Windows 11 Home, and signing into a Microsoft account during activation **silently enables device encryption**. The user notices nothing — but resizing an encrypted volume fails.

My original detection looked like this:

```powershell
(Get-BitLockerVolume -MountPoint 'C:').ProtectionStatus -eq 'On'
```

Looks fine. It's wrong: **`Get-BitLockerVolume` lives in the BitLocker module, which Home edition does not ship.**

So on the target machine that line doesn't report "encrypted" — it reports "command not found." And since I'd wrapped it in `-ErrorAction SilentlyContinue`, it **failed silently**: the script concluded the disk was unencrypted, cheerfully went off to resize it, and would have failed somewhere deeper and uglier.

Querying WMI works instead, because that class does exist on Home:

```powershell
Get-CimInstance -Namespace 'root\CIMV2\Security\MicrosoftVolumeEncryption' `
                -ClassName Win32_EncryptableVolume -Filter "DriveLetter='C:'"
```

The lesson isn't "read the docs." It's that **when you're writing for a runtime you don't have, every "surely this exists" needs to be treated as "this doesn't."**

## Rule three: move the files first, then edit the registry

Partitioning only solves half the problem. What actually fills up C is that Documents, Downloads and Pictures all still live there — she'd keep saving to C, and those three folders on D would stay empty forever.

So the script also redirects those shell folders to `D:\个人文件\`. The ordering matters:

1. Read the current real path
2. Decide whether it's safe to touch
3. `robocopy /MOVE` the existing files across
4. **Only after that succeeds, edit the registry**

Do it the other way around — registry first, then files — and any mid-way failure leaves you split: the registry points at D, the files are still on C. Windows creates an empty folder on D, the old files vanish from Explorer, and the disk usage doesn't drop by a byte. That is precisely the kind of breakage an ordinary user can neither diagnose nor repair.

In the current order, the worst case is that nothing changed.

There's a fifth mine here: **OneDrive**. When you sign into Windows 11 with a Microsoft account, the setup flow offers "folder backup," and plenty of people just accept. After that, Documents actually lives at `C:\Users\xxx\OneDrive\Documents`, and redirecting it to D fights the sync engine. So before touching each folder, check whether its path contains `OneDrive` — and if it does, skip it and say so.

## Rule four: give it a look-but-don't-touch mode

All three rules above were reasoned out **without a Windows machine**. I wrote this on a Linux VPS, where not one of those storage cmdlets will execute.

Handing that to someone else would be irresponsible, so the first thing I added when turning it into a real tool was a check-only mode:

```
1  Run it     partition, folders, default locations, apps
2  Check only print what it would do, change nothing
3  Quit
```

Pick 2 and the script runs the entire detection path, prints every pending change as a `[check] would: ...` line, and does nothing.

To prove that mode is genuinely inert, I built a harness: replace `Resize-Partition`, `New-Partition`, `robocopy`, `winget` and friends with tripwire functions — **called means logged** — then run the whole script on Linux against fake disk data.

```
[check] would: shrink C to 280.0 GB and create D from the remaining 720.0 GB
[check] would: create folder D:\娱乐
[check] would: move Documents from C:\Users\mei\Documents to D:\个人文件\文档
Pictures: currently owned by OneDrive, skipping.
[check] would: install WeChat via winget (package Tencent.WeChat)
...
PASS: check mode triggered no system-modifying calls
```

The first run reported PASS — and it was a lie. My regex for stubbing out the admin check hadn't matched, so the script exited at line 72 and never reached any of it. **A test that never runs is always green**, which was probably the most valuable second of the whole exercise.

After fixing it I added a second scenario: D already exists, and Pictures is owned by OneDrive. Only both scenarios together cover all five steps.

## The last mile: SmartScreen

Script done, zipped, uploaded, link sent. She clicked it — and got stuck on a blue dialog.

**"Windows protected your PC."** Anything downloaded carries the mark of the web, so double-clicking the `.bat` trips SmartScreen every time. That dialog has exactly one button; "More info → Run anyway" hides in small text in the bottom-left corner. If you've never seen it, you conclude the file is broken.

Related: never serve a bare `.bat` or `.ps1` for download. Edge and Chrome block bare `.bat` outright, often without even offering "keep." Ship a zip.

So step zero of the instructions isn't "unzip." It's "Windows will stop you, that's normal, click here to continue."

That's not a technical problem, but it matters exactly as much as everything above it: **if the user can't reach your code, correct code is worth nothing.**

## Take it

The tool is called firstboot:

- [Download firstboot v1.0.0](/downloads/firstboot-1.0.0.zip) (zip, ~10 KB)
- Checksum: [firstboot-1.0.0.zip.sha256](/downloads/firstboot-1.0.0.zip.sha256)

The app list and folder names sit in a config block at the top of `setup.ps1` — swap them for whatever you need. The defaults are WeChat, QQ, Tencent Meeting, Tencent Video and WPS: the greatest common divisor of a Chinese student's laptop.

It has now been run on a real, brand-new ASUS Vivobook 16. But your machine isn't that machine, so **pick 2 the first time.**
