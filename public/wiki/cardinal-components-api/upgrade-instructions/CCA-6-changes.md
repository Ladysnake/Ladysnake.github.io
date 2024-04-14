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
   - make sure the "Regex" option (the `.*` button to the right of the search field) is *disabled*
2. type `import dev.onyxstudios.cca` in the first line ("Search")
3. type `import org.ladysnake.cca` in the second line ("Replace")
4. Click on <samp>Replace All</samp> to perform the replacement
5. You're done!

## Changes to the Base module

`AutoSyncedComponent` now reads from and writes to a `RegistryByteBuf` instead of a `PacketByteBuf`.
This new type can be used in exactly the same way, while also allowing to use more vanilla serialization methods.
You can use the same Search/Replace procedure as above to handle this migration, first replacing `public void writeSyncPacket(PacketByteBuf` with `public void writeSyncPacket(RegistryByteBuf`,
then replacing `public void applySyncPacket(PacketByteBuf` with `public void applySyncPacket(RegistryByteBuf`.

## Changes to the Item module

With Minecraft 1.20.5 adding data components for item stacks,
all the functionality of the `cardinal-components-item` module has been superseded by vanilla components and Fabric API's [API Lookup API](https://github.com/FabricMC/fabric/blob/1.20.5/fabric-api-lookup-api-v1/README.md).
As such, **item components have been entirely removed from Cardinal Components API.**

You can find an example of a component interface reimplemented with the new APIs in [CCA's test mod](https://github.com/Ladysnake/Cardinal-Components-API/blob/1.20.5/src/testmod/java/org/ladysnake/componenttest/content/vita/ItemVita.java).
The basic idea is:
1. move all your component's fields to an immutable record
2. create a `Codec`, a `PacketCodec` and a `DataComponentType` for that record
3. register the `DataComponentType` to `Registries.DATA_COMPONENT_TYPE`
4. reimplement your component interface by delegating reads and writes to the new data component, using `ItemStack#get`, `ItemStack#set`, and `ItemStack#apply` as required
5. register an `ItemApiLookup<T, Void>` for your component interface
6. replace uses of `COMPONENT_KEY.get(stack)` with `API_LOOKUP.get(stack, null)`

## Changes to the Entity module

The `PlayerCopyCallback` has been removed. If you were using it, you can switch to `ServerPlayerEvents.COPY_FROM` from Fabric API.
