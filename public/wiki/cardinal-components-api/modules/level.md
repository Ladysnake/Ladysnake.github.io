---
title: Cardinal Components Level
layout: cca_wiki
breadcrumb: Level Properties
---

This module allows mods to attach components to WorldProperties objects. Those properties are shared by every world and thus can be used as global data. Level components can be semi-automatically synchronized by implementing `AutoSyncedComponent`. **Note that you must call `LevelComponents#sync(MinecraftServer)` instead of `ComponentKey#sync()`**.

## Cardinal-Components Alternative: Scoreboard Components
Scoreboard components are available starting from version 2.5.0 of the API (MC 1.16.2) and offer the same functionality as level components while being easier to synchronize.

## Vanilla Alternative: Overworld `PersistentState`
Instead of components attached to `WorldProperties`, one can use a `PersistentState` specifically attached to the Overworld.

```diff
+ No dependency required
= Comparable amount of setup
- Requires access to a MinecraftServer instance - cannot be synchronized, requires casting to use
- Depends on the assumption that the Overworld is always accessible and never reset
```