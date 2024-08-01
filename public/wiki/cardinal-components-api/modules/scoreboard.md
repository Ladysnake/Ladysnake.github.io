---
title: Cardinal Components Scoreboard
layout: cca_wiki
breadcrumb: Scoreboards and Teams
---

This module allows mods to attach components to `Scoreboard` and `Team` objects.
The former can be used for storing global data, while the latter can be especially useful for implementing multiplayer systems like minigames and factions.

By default, the scoreboard itself is not affected in any way by the data that is attached to it through Cardinal Components API.
It is only used as a convenient provider that can easily be accessed by mods.
{:.admonition.admonition-important}

## Usage
### Registration

Scoreboard components are registered by a [`ScoreboardComponentInitializer`](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-scoreboard/src/main/java/org/ladysnake/cca/api/v3/scoreboard/ScoreboardComponentInitializer.java), exposed as either `cardinal-components-scoreboard`
or simply `cardinal-components` in the mod json (more information on the [component registration page](../registration#2-attaching-your-component)).
Once a component factory is registered for either scoreboards or teams, its associated component will be available on every relevant instance, on both clients and servers.

Scoreboard and team component factories are passed a `MinecraftServer` instance, which allows for advanced behaviour during *e.g.* component ticking.
This server instance will be `null` on the logical client.
{:.admonition.admonition-note.admonition-icon}

#### Example

```java
public final class MyComponents implements ScoreboardComponentInitializer {
    @Override
    public void registerScoreboardComponentFactories(ScoreboardComponentFactoryRegistry registry) {
        // Global data component
        registry.registerScoreboardComponent(TrophyComponent.KEY, TrophyComponent::new);
        // Team-specific component, useful for minigames
        registry.registerTeamComponent(TrophyComponent.KEY, (scoreboard, team, server) -> new TeamTrophyComponent(team));
    }
}
```

### Synchronization

Both Scoreboard and Team components can be automatically synchronized from the server to the client by implementing
[`AutoSyncedComponent`](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-base/src/main/java/org/ladysnake/cca/api/v3/component/sync/AutoSyncedComponent.java) - more information is available on [the component synchronization page](../synchronization.md).
A scoreboard component should call `KEY.sync(scoreboard)` to trigger server-to-client synchronization, while a team
component should call `KEY.sync(team)`.

### Ticking

Scoreboard components support both [server](https://github.com/Ladysnake/Cardinal-Components-API/blob/main/cardinal-components-base/src/main/java/org/ladysnake/cca/api/v3/component/tick/ServerTickingComponent.java) and [client](https://github.com/Ladysnake/Cardinal-Components-API/blob/main/cardinal-components-base/src/main/java/org/ladysnake/cca/api/v3/component/tick/ClientTickingComponent.java) ticking.
They get ticked at the end of the server/client tick.

## Global Component Example

Here is an example of a global component that can be used to track modded player data even when the players are offline:

```java
public class TrophyComponent implements AutoSyncedComponent {
    private final Map<UUID, TrophyCollection> data = new HashMap<>();
    private final Scoreboard provider;

    public TrophyComponent(Scoreboard provider, @Nullable MinecraftServer server) {
        this.provider = provider;
    }

    public void addTrophy(PlayerEntity player, Trophy trophy) {
        this.data.computeIfAbsent(playerId, i -> new TrophyCollection()).grant(trophy);
        KEY.sync(this.provider);
    }

    public List<Trophy> listTrophies(PlayerEntity player) {
        return this.listTrophies(player.getUuid());
    }

    public List<Trophy> listTrophies(UUID playerId) {
        TrophyCollection trophies = this.data.get(playerId);
        return trophies == null ? List.of() : trophies.toList();
    }
    
    // Sync implementation: only sync the players' own data
    // (in most cases that's what you want, but you could also sync the entirety of the map)
    
    @Override
    public boolean shouldSyncWith(ServerPlayerEntity player) {
        return data.containsKey(player.getUuid());
    }
    
    @Override
    public void writeSyncPacket(RegistryByteBuf buf, ServerPlayerEntity recipient) {
        buf.writeMap(
                Map.of(recipient.getUuid(), data.get(recipient.getUuid())),
                PacketByteBuf::writeUuid,
                TrophyCollection::writeToPacket
        );
    }
    
    @Override public void applySyncPacket(RegistryByteBuf buf) { /* ... */ }
}
```

In a similar way, you could use a `Map<RegistryKey<World>, Data>` to store globally available data about dimensions.

## Vanilla Alternatives
Here are some alternatives to store global data if you don't feel like adding a dependency to your project.
_Opinion:_ the only one we would recommend, if there is no need for synchronization, is the Overworld `PersistentState`.

### Overworld `PersistentState`
Instead of components attached to `Scoreboard`, one can use a `PersistentState` specifically attached to the Overworld.

```diff
+ No dependency required
= Comparable amount of setup
- Requires access to a MinecraftServer instance - cannot be synchronized, requires casting to use
- Depends on the assumption that the Overworld is always accessible and never reset
```

### Actual scoreboard storage
Instead of storing global data in components attached to the scoreboard, one could directly store said data in the scoreboard itself.

```diff
+ No dependency required
= Is automatically synchronized
- Requires more setup
- Only stores numbers
- Can interfere with commands
```

### Entirely custom file
It is possible for a mod to manage a dedicated file storing the global data in a world's save directory.

```diff
+ No dependency required
+ Can also be saved clientside for offline access
- requires custom implementation for saving, syncing, ticking, etc.
- is susceptible to file corruption and other things that Minecraft deals with
```
