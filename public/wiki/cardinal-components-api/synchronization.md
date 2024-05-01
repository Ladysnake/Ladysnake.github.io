---
title: Synchronizing components
layout: cca_wiki
tags: ['AutoSyncedComponent']
---

Storing data is all well and good, but sometimes you need clients to be aware of what you put there. Most often it will be for visual effects, although it can be required for various clientside behaviour like player movement. And while you can set up your own packets and callbacks to keep your players updated, Cardinal Components API offers you facilities to handle synchronization with little to no effort.

## Synchronizing a Component

The first step to have your component synchronized, is to implement the [`AutoSyncedComponent`](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-base/src/main/java/org/ladysnake/cca/api/v3/component/sync/AutoSyncedComponent.java) interface.

*Examples in this page use the `IntComponent` interface as defined in the [Implementing the Component interface](implementing-component) page.*

For example:
```java
// Here, IntComponent is a custom Component specialization
public class SyncedIntComponent implements IntComponent, AutoSyncedComponent {
    private int value;

    // getters, setters, and serialization methods omitted for brevity
}
```
With that, all the data that you save through your serialization methods gets automatically synchronized whenever a player starts tracking the provider to which your component is attached. If your component has its value set during initialization and never changes, this would *technically* be enough. However, most components store *dynamic* values, which means you need to notify players of your changes. For that, all you need to do is call [`ComponentKey#sync`](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-base/src/main/java/org/ladysnake/cca/api/v3/component/ComponentKey.java#L110) whenever you update your component.

*For information on how to obtain a `ComponentKey`, refer to the [Registering and using a component](registration) page.*

If your component is updated atomically, through a single method, you can add the call to `sync()` in that method (this is the most common strategy):
```java
    private final Object provider;

    public IntComponent(Object provider) {
        this.provider = provider;
    }

    public void setValue(int value) {
        this.value = value;
        MyComponents.MAGIK.sync(this.provider); // assuming MAGIK is the right key for this component
    }
```
However, if your component gets updated *several times per tick*, you should synchronize externally to avoid spamming packets:
```java
FluidComponent component = BikeshedComponents.FLUID.get(provider);
component.setPressure(5);
component.drain(dest, 2);
component.setPressure(0);
BikeshedComponents.FLUID.sync(provider);
```

### A note on registration

Your component will only get ticked if it is known at registration time that it implements `TickingComponent`. If you are only implementing this interface on a component subclass, you will have to use a dedicated registration method on the factory:
```java
factory.beginRegistration(TargetClass.class, MyNonTickingComponent.KEY).impl(MyTickingImpl.class).end(MyTickingImpl::new);
```
or
```java
factory.register(MyNonTickingComponent.KEY, MyTickingImpl.class, MyTickingImpl::new);
```
(depending on the provider)


## Optimizing network usage
Often, only a subset of the full data needs to be synchronized. To avoid unnecessarily bloated packets, you should override the `writeSyncPacket` and `applySyncPacket` methods:
```java
    @Override
    public void writeSyncPacket(PacketByteBuf buf, ServerPlayerEntity player) {
        buf.writeVarInt(this.value); // only synchronize the information you need!
    }

    @Override
    public void applySyncPacket(PacketByteBuf buf) {
        this.value = buf.readVarInt();
    }
```

Let's say your `IntComponent` stores how many spells a player can cast. If you broadcast that information to everyone on a PvP server (without an intended way of visualizing it), not only are you sending lots of unnecessary packets, but someone with a cheat mod could get an unfair advantage. This problem can be solved by overriding the `shouldSyncWith` method:
```java
    @Override
    public boolean shouldSyncWith(ServerPlayerEntity player) {
        return player == this.provider; // only sync with the provider itself
    }
```

**Remember: any unnecessary information is both a burden on the network, and an opportunity for players to cheat!**

## Customizing synchronized data

When you trigger component synchronization yourself, you may not always want the default full sync behaviour. For example, you may have a lot of data and want to sync only a subset of it, or you may want to play visual effects on the client when they receive the packet. The overloads of `ComponentKey#sync` give you this flexibility.

For example, if you want to play particle effects when a counter increases:
```java
public class SyncedIntComponent implements IntComponent, AutoSyncedComponent {
    public static final int INCREASE_VALUE = 1;
    private int value;

    @Override // overrides a hypothetical method in IntComponent
    public void increment() {
        this.value++;
        // Pass a custom packet writer to sync
        MyComponents.MAGIK.sync(this.provider, (buf, p) -> writeSyncPacket(buf, player, true));
    }

    @Override
    public void writeSyncPacket(PacketByteBuf buf, ServerPlayerEntity player) {
        this.writeSyncPacket(buf, player, false);
    }

    private void writeSyncPacket(PacketByteBuf buf, ServerPlayerEntity player, boolean increaseValue) {
        buf.writeVarInt(this.value);
        // Write different information to the packet based on the extra parameters
        buf.writeBoolean(increaseValue);
    }

    @Override
    public void applySyncPacket(PacketByteBuf buf) {
        this.value = buf.readVarInt();

        // Only play particle effects if the synchronization was triggered by increment()
        if (buf.readBoolean()) {
            MinecraftClient.getInstance().particleManager.addEmitter(entity, ParticleTypes.TOTEM_OF_UNDYING, 20);
        }
    }
}
```