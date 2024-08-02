---
title: Cardinal Components World
layout: cca_wiki
breadcrumb: Worlds
---

This module allows mods to attach components to `World` objects. World components can be automatically synchronized by implementing `SyncedComponent`, most commonly through the `WorldSyncedComponent` helper interface.

### A note about access

World objects are among the easiest to access in your code (notably available on the client through `MinecraftClient#world` and on the server
through `MinecraftServer#getWorld`), with the caveat that a client cannot retrieve data for a `World` that they are not currently in.
If you need your clients to be aware of the custom data for another dimension (<i>e.g.</i> for fancy portal effects), you may be interested
in a global data store like [Cardinal Components Scoreboard](./scoreboard).

## Usage
### Registration
World components are registered by a [`WorldComponentInitializer`](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-world/src/main/java/org/ladysnake/cca/api/v3/world/WorldComponentInitializer.java), exposed as `cardinal-components-world` in the mod json (more information on the [component registration page](../registration#2-attaching-your-component)). Once a component factory is registered, its associated component will be available on every `World` instance, on both clients and servers.

### Synchronization
World components can be automatically synchronized from the server to the client by implementing [`AutoSyncedComponent`](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-base/src/main/java/org/ladysnake/cca/api/v3/component/sync/AutoSyncedComponent.java) - more information is available on [the component synchronization page](../synchronization).

### Ticking
World components support both [server](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-base/src/main/java/org/ladysnake/cca/api/v3/component/tick/ServerTickingComponent.java) and [client](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-base/src/main/java/org/ladysnake/cca/api/v3/component/tick/ClientTickingComponent.java) ticking. Components get ticked right after everything else in `World#tick`.

## Vanilla Alternative: `PersistentState`
```diff
+ No dependency required
+ Slightly easier to setup (no registration)
- Only exists on ServerWorld - cannot be synchronized, requires casting to use
- Must extend the PersistentState abstract class
```