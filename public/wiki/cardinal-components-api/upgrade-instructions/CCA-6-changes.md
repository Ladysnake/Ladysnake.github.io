---
title: Upgrading from CCA 5.x to 6.0
breadcrumb: 6.x upgrade
layout: cca_wiki
---

Minecraft 1.20.5 brought some rather large changes impacting Cardinal Components API, prompting a few breaking changes.

## Package migration

The root package has changed from `dev.onyxstudios` to `org.ladysnake`.
You can migrate quickly by using your IDE's global search feature - here are the instructions for Intellij Idea:

1. press <kbd><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd></kbd> (or <kbd><kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd></kbd> on MacOS) to open the global replace window
2. type `import dev.onyxstudios.cca` in the first line ("Search")
3. type `import org.ladysnake.cca` in the second line ("Replace")
4. Click on <samp>Replace All</samp> to perform the replacement
5. You're done!

## Changes to the Base module

- AutoSyncedComponent

## Changes to the Entity module

- Removal of `PlayerCopyCallback`

## Removal of the Item module

