---
title: Cardinal Components Entity
layout: cca_wiki
breadcrumb: Entities
---

This module allows mods to attach components to `Entity` objects. Those components will be saved automatically with the entity.

## Usage
### Registration
Entity components are registered by an [`EntityComponentInitializer`](https://github.com/OnyxStudios/Cardinal-Components-API/blob/main/cardinal-components-entity/src/main/java/dev/onyxstudios/cca/api/v3/entity/EntityComponentInitializer.java), exposed as `cardinal-components-entity` in the mod json (more information on the [component registration page](../registration#2-attaching-your-component)).

Component factories are registered per entity class, thereby attaching components to all instances of that class and of its subclasses.
Registering a factory to both a class and its subclass will cause the latter factory to override the former, letting you eg. use a different implementation for players than for entities.

Instead of a specific class, you can also register a component factory with a `Predicate<Class<? extends Entity>>`. This lets you use your own criteria like "implements a specific interface".

### Synchronization
Entity components can be automatically synchronized from the server to the client by implementing [`AutoSyncedComponent`](https://github.com/OnyxStudios/Cardinal-Components-API/blob/main/cardinal-components-base/src/main/java/dev/onyxstudios/cca/api/v3/component/sync/AutoSyncedComponent.java) - more information is available on [the component synchronization page](../synchronization).

### Ticking
Entity components support both [server](https://github.com/OnyxStudios/Cardinal-Components-API/blob/main/cardinal-components-base/src/main/java/dev/onyxstudios/cca/api/v3/component/tick/ServerTickingComponent.java) and [client](https://github.com/OnyxStudios/Cardinal-Components-API/blob/main/cardinal-components-base/src/main/java/dev/onyxstudios/cca/api/v3/component/tick/ClientTickingComponent.java) ticking. Components get ticked right after the entity they are attached to, provided the latter gets ticked through `(Server/Client)World#tickEntity`.

### Loading and unloading
Entity components support loading and unloading events for both server and client.

### Player Respawn

Mods can choose when and how components are copied when the player respawns. The most straightforward way to do so is by selecting a pre-defined [`RespawnCopyStrategy`](https://github.com/OnyxStudios/Cardinal-Components-API/blob/main/cardinal-components-entity/src/main/java/nerdhub/cardinal/components/api/util/RespawnCopyStrategy.java) among the following:
- [`ALWAYS_COPY`](https://github.com/OnyxStudios/Cardinal-Components-API/blob/main/cardinal-components-entity/src/main/java/nerdhub/cardinal/components/api/util/RespawnCopyStrategy.java#L59): **always copy the component's data**, no matter the circumstances of respawn. This is generally helpful for components storing metadata like statistics, or some intrinsic traits.
- [`INVENTORY`](https://github.com/OnyxStudios/Cardinal-Components-API/blob/main/cardinal-components-entity/src/main/java/nerdhub/cardinal/components/api/util/RespawnCopyStrategy.java#L65): **copy the component's data only if the inventory would be preserved**. This is helpful for inventory extensions and experience-like resources. *You may still have to listen to the player's death yourself to drop the resources* (resources vanishing is not very fun, also do not forget to check `keepInventory` before dropping stuff).
- [`LOSSLESS_ONLY`](https://github.com/OnyxStudios/Cardinal-Components-API/blob/main/cardinal-components-entity/src/main/java/nerdhub/cardinal/components/api/util/RespawnCopyStrategy.java#L75): **copy the component's data only if the player is cloned losslessly** (eg. return from the End). This should be used for data that resets on death, like health or food.
- [`NEVER_COPY`](https://github.com/OnyxStudios/Cardinal-Components-API/blob/main/cardinal-components-entity/src/main/java/nerdhub/cardinal/components/api/util/RespawnCopyStrategy.java#L86): this strategy is **not** recommended by itself, as it leads to components losing their data for no apparent reason. It can however be used in conjunction with a [`PlayerCopyCallback`](https://github.com/OnyxStudios/Cardinal-Components-API/blob/main/cardinal-components-entity/src/main/java/nerdhub/cardinal/components/api/event/PlayerCopyCallback.java) if you have some highly custom logic.

If you want more control, you can pass your own `RespawnCopyStrategy`. This is useful if you want partial losses, like losing just a few levels on death. Alternatively, you can implement [`PlayerComponent`](https://github.com/OnyxStudios/Cardinal-Components-API/blob/main/cardinal-components-entity/src/main/java/dev/onyxstudios/cca/api/v3/entity/PlayerComponent.java) on your component and not set a respawn strategy (a set `RespawnCopyStrategy` will take precedence). Your component's `shouldCopyForRespawn` and `copyForRespawn` methods will then be called instead when performing the copy.

Setting a `RespawnCopyStrategy` is done during registration to an [`EntityComponentFactoryRegistry`](https://github.com/OnyxStudios/Cardinal-Components-API/blob/main/cardinal-components-entity/src/main/java/dev/onyxstudios/cca/api/v3/entity/EntityComponentFactoryRegistry.java#L77-L101).

## Vanilla Alternative: Mixins
Instead of components attached to entities, one can use Mixin to implement an interface on the desired entity class and inject into its serialization methods.

```diff
+ No dependency required
- More setup, less maintainable
- Needs more mixins to handle player respawns
- Needs more mixins to handle synchronization
```

## Examples
```java
public final class MyComponents implements EntityComponentInitializer {
    @Override
    public void registerEntityComponentFactories(EntityComponentFactoryRegistry registry) {
        // Scenario 1:
        // Add the component to every ZombieEntity instance, including husks and zombie villagers
        registry.registerFor(ZombieEntity.class, INFECTION, ZombieInfection::new);

        // Scenario 2:
        // Add the component to every instance of PlayerEntity, and ensure the component's data is always copied
        registry.registerForPlayers(MAGIK, player -> new RandomIntComponent(), RespawnCopyStrategy.ALWAYS_COPY);

        // Scenario 3:
        // Add the component to every living entity
        registry.registerFor(LivingEntity.class, BLUE, e -> new RandomIntComponent());
        // Ensure the component's data is copied when keepInventory is enabled (Optional)
        registry.setRespawnCopyStrategy(BLUE, RespawnCopyStrategy.INVENTORY);

        // Scenario 4:
        // Add the component to every entity with an inventory
        registry.registerFor(Inventory.class::isAssignableFrom, RED, e -> new RandomIntComponent());
        // Add a specialized component to every instance of PlayerEntity without specifying a strategy
        // The attached component can implement PlayerComponent to customize respawn copying
        registry.registerForPlayers(RED, PlayerIntComponent::new);
    }
}
```