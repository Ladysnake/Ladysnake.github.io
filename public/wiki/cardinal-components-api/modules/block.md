---
title: Cardinal Components Block
layout: cca_wiki
breadcrumb: Blocks
---

This module has two purposes, allowing mods to attach components to `BlockEntity` objects. It was also previously used to expose components as API on any block, but this functionality has been superseded by Fabric API's [API Lookup API](https://github.com/FabricMC/fabric/tree/1.16/fabric-api-lookup-api-v1).

## Usage
**Warning: BlockEntity components currently require their holder to call both `super.readNbt(nbt)` and `super.writeNbt(nbt)`.** (Modded) block entities that do not fulfill this criteria will not get their components properly saved.

### Registration
Entity components are registered by a [`BlockComponentInitializer`](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-block/src/main/java/org/ladysnake/cca/api/v3/block/BlockComponentInitializer.java), exposed as `cardinal-components-block` in the mod json (more information on the [component registration page](../registration#2-attaching-your-component)).

Component factories are registered per block entity class, thereby attaching components to all instances of that class and of its subclasses.
Registering a factory to both a class and its subclass will cause the latter factory to override the former, letting you eg. use a different implementation for trapped chests than for generic containers.

Instead of a specific class, you can also register a component factory with a `Predicate<Class<? extends BlockEntity>>`. This lets you use your own criteria like "implements a specific interface".

### Synchronization
BlockEntity components can be automatically synchronized by implementing [`AutoSyncedComponent`](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-base/src/main/java/org/ladysnake/cca/api/v3/component/sync/AutoSyncedComponent.java) - more information is available on [the component synchronization page](../synchronization).

### Ticking
BlockEntity components also support both [server](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-base/src/main/java/org/ladysnake/cca/api/v3/component/tick/ServerTickingComponent.java) and [client](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-base/src/main/java/org/ladysnake/cca/api/v3/component/tick/ClientTickingComponent.java) ticking. Components get ticked right after the block entity they are attached to, provided the latter gets ticked through `World#tickBlockEntities`. **This means that only block entities that implement `Tickable` are currently supported.**

### API Lookup integration

Several helper methods exist in `BlockComponents` to help interact with Fabric API's API Lookup API.

Let us pretend we have the `FLUID_CONTAINER` API, as defined in [`BlockApiLookup`](https://github.com/FabricMC/fabric/blob/1.16/fabric-api-lookup-api-v1/src/main/java/net/fabricmc/fabric/api/lookup/v1/block/BlockApiLookup.java)'s usage example.
One could write a compound component that can be attached to any `BlockEntity` and give access to a different tank for each face of the block:
 
```java
 public interface FluidContainerCompound extends Component {
      ComponentKey<FluidContainerCompound> KEY = ComponentRegistry.register(Identifier.of("mymod:fluid_container_compound"), FluidContainerCompound.class);

      FluidContainer get(Direction side);
 }
```

This component could be then used to expose the `FLUID_CONTAINER` API on any block, with a single call to `BlockComponents#exposeApi`:

```java 
 @Override
 public void onInitialize() {
     BlockComponents.exposeApi(
         FluidContainerCompound.KEY,
         MyApi.FLUID_CONTAINER,
         FluidContainerCompound::get
     );
 }
```

## V1/V2 API (legacy)
Blocks implement the `BlockComponentProvider` interface instead of the regular `ComponentProvider`. Custom blocks may re-implement that interface themselves to provide components independently of the presence of a BlockEntity. Usually the block simply proxies its Block Entity, however the Block Entity does not need to implement `BlockComponentProvider` if the block already has a custom implementation. The module also includes [several utility classes](https://github.com/Ladysnake/Cardinal-Components-API/tree/master/cardinal-components-block/src/main/java/nerdhub/cardinal/components/api/util/sided) to help with providing block components.

Components are entirely compatible with [LibBlockAttributes](https://github.com/AlexIIL/LibBlockAttributes)' attributes.
Since `Component` is an interface, any attribute instance can easily implement it. Conversely, making an `Attribute`
for an existing `Component` should be as simple as calling `Attributes.create(MyComponent.class)`.

*This version of the API does not allow attaching components to existing (eg. vanilla) blocks.*
