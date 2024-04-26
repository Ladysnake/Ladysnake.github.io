---
title: Upgrading from CCA 5.x to 6.0
breadcrumb: 6.x upgrade
layout: cca_wiki
---

Minecraft 1.20.5 has been quite the deal in terms of technical changes.
With networking and item NBT being completely redone, Cardinal Components API had to adapt - prompting several breaking changes.

This page details the main changes in the 6.0.0 update, and how to deal with them.

Note that the 6.0.0 update is not completely done yet, and therefore this page may be amended before the full release.
{:.admonition.admonition-warning.admonition-icon.large-icon}

## Package migration

This new major version has brought the opportunity to update the library's maven group and package, from `dev.onyxstudios` to `org.ladysnake`.
You can migrate imports quickly by using your IDE's global search feature - here are the instructions for Intellij Idea:

1. press <kbd><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd></kbd> (or <kbd><kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd></kbd> on MacOS) to open the global replace window
   - make sure the "Regex" option (the `.*` button to the right of the search field) is *disabled*
2. type `import dev.onyxstudios.cca` in the first line ("Search")
3. type `import org.ladysnake.cca` in the second line ("Replace")
4. Click on <samp>Replace All</samp> to perform the replacement
5. You're done!

On the maven side of things, the old maven group is aliased to the new one, so your builds should keep working.
However, to avoid future issues, you should still update the dependency information in your Gradle buildscript, substituting `dev.onyxstudios.cardinal-components-api` with `org.ladysnake.cardinal-components-api`.

## Changes to the Base module

### Serialization

All the NBT serialization methods in Cardinal Components API now take an additional `RegistryWrapper.WrapperLookup` parameter.
This lookup object is required when serializing various vanilla objects, like `ItemStack`s and `Text`s.

You can again use *Search/Replace* to handle this migration - here the Intellij Idea instructions, *with regex* this time:

1. open the global replace window
2. ***enable*** the "Regex" option (the `.*` button to the right of the search field)
3. type `public void readFromNbt\(NbtCompound (.*)\)` in the search field
4. type `public void readFromNbt(NbtCompound $1, RegistryWrapper.WrapperLookup registryLookup)` in the replace field
5. Review each replacement, ensure you are only doing it in `Component` implementations
6. Add missing imports
7. Repeat steps 3 to 5 with `public void writeToNbt\(NbtCompound (.*)\)` -> `public void writeToNbt(NbtCompound $1, RegistryWrapper.WrapperLookup registryLookup)`
8. You're done!

### Synchronization

`AutoSyncedComponent` now reads from and writes to a `RegistryByteBuf` instead of a `PacketByteBuf`.
This new type can be used in exactly the same way, while also allowing the use of more vanilla serialization methods (notably the new `PacketCodec`s).

You can use the same *Search/Replace* procedure as the package migration (*without regex*),
first replacing `public void writeSyncPacket(PacketByteBuf` with `public void writeSyncPacket(RegistryByteBuf`,
then replacing `public void applySyncPacket(PacketByteBuf` with `public void applySyncPacket(RegistryByteBuf`.

#### Client-optional components

Cardinal Components API 6.0 has improved handling of unknown components during client-server sync.

Attempting to sync a component to a player who does not have your mod installed clientside will now result in a disconnection.
{:.admonition.admonition-important}

You can override the `isRequiredOnClient` method in your `PlayerSyncPredicate` (typically your `AutoSyncComponent` implementation)
to avoid updates disconnecting players who do not have your mod installed.

## Changes to the Item module

**Item components have been entirely removed from Cardinal Components API.**
{:.admonition.admonition-warning}

With Minecraft 1.20.5 adding data components for item stacks,
all the functionality of the `cardinal-components-item` module has been superseded by vanilla components and Fabric API's [API Lookup API](https://github.com/FabricMC/fabric/blob/1.20.5/fabric-api-lookup-api-v1/README.md).

You can find an example of a component interface reimplemented with the new APIs in [CCA's test mod](https://github.com/Ladysnake/Cardinal-Components-API/blob/1.20.5/src/testmod/java/org/ladysnake/componenttest/content/vita/ItemVita.java).
The basic idea is:
1. move all your component's fields to an immutable record
2. create a `Codec`, a `PacketCodec` and a `DataComponentType` for that record
3. register the `DataComponentType` to `Registries.DATA_COMPONENT_TYPE`
4. reimplement your component interface by delegating reads and writes to the new data component, using `ItemStack#get`, `ItemStack#set`, and `ItemStack#apply` as required
5. register an `ItemApiLookup<T, Void>` for your component interface
6. replace uses of `COMPONENT_KEY.get(stack)` with `API_LOOKUP.get(stack, null)`
7. in your CCA item entrypoint, implement the `registerItemComponentMigrations` method so that item data can be migrated when your players upgrade their world

## Changes to the Level module

Level components are now formally deprecated.
{:.admonition.admonition-warning}

Level components have been made redundant since the moment scoreboard components were introduced, but until now they still retained first-class support.
Starting from this release, **you are officially encouraged to migrate to [scoreboard components](../modules/scoreboard)**,
which serve the same purpose of global data storage and have an API more consistent with that of other modules (notably regarding sync).

Due to the [serialization changes](#serialization), level component deserialization now happens in `LevelStorage#parseSaveProperties`,
which should not change anything in a vanilla context, but means your components may not be correctly loaded if some mod calls `LevelProperties#readProperties` directly.

## Changes to the Entity module

- The `PlayerCopyCallback` has been removed. If you were using it, you can switch to `ServerPlayerEvents.COPY_FROM` from Fabric API.
- `RespawnCopyStrategy` is now called for mobs other than players when they get converted (think smitten pigs turning to piglins, or zombies drowning)

### Client-to-Server messages

Many mods making use of synced components also need to send back messages to the server to affect the state of said components - typically in reaction to a key press or to a GUI click.
These mods can now be simplified with the new `C2SSelfMessagingComponent` utility interface, removing the need to create and register a custom packet type.

As most use cases apply to a player component sending a message to itself, `C2SSelfMessagingComponent` is tailored for this scenario.
As such, this interface only works when implemented on a component that is attached to a player.
{:.admonition.admonition-note}

## Changes to the World module

- You can now restrict a component to specific dimensions, using the new `WorldComponentRegistry#registerFor` methods

## Changes to the Scoreboard module

- Scoreboard and team components now support [client ticking](../ticking)

