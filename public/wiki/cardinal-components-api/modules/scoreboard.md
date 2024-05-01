---
title: Cardinal Components Scoreboard
layout: cca_wiki
breadcrumb: Scoreboards and Teams
---

This module allows mods to attach components to `Scoreboard` and `Team` objects. The former can be used for storing global data, while the latter can be especially useful for implementing multiplayer systems like minigames and factions.

## Usage
### Registration

Scoreboard components are registered by a [`ScoreboardComponentInitializer`](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-scoreboard/src/main/java/org/ladysnake/cca/api/v3/scoreboard/ScoreboardComponentInitializer.java), exposed as `cardinal-components-scoreboard` in the mod json (more information on the [component registration page](../registration#2-attaching-your-component)).
Once a component factory is registered for either scoreboards or teams, its associated component will be available on every relevant instance, on both clients and servers.

### Synchronization

Scoreboard components can be automatically synchronized from the server to the client by implementing [`AutoSyncedComponent`](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-base/src/main/java/org/ladysnake/cca/api/v3/component/sync/AutoSyncedComponent.java) - more information is available on [the component synchronization page](../synchronization.md).

### Ticking

Scoreboard components support both [server](https://github.com/Ladysnake/Cardinal-Components-API/blob/main/cardinal-components-base/src/main/java/org/ladysnake/cca/api/v3/component/tick/ServerTickingComponent.java) and [client](https://github.com/Ladysnake/Cardinal-Components-API/blob/main/cardinal-components-base/src/main/java/org/ladysnake/cca/api/v3/component/tick/ClientTickingComponent.java) ticking.
They get ticked at the end of the server/client tick.
