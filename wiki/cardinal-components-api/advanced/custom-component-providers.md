---
title: Making Custom Component Providers
layout: cca_wiki
---

## Barebones Implementation
```java
public class MyCustomProvider implements ComponentProvider {
    private static final ComponentContainer.Factory<MyCustomProvider> CONTAINER_FACTORY =
        ComponentContainer.Factory.builder(MyCustomProvider.class)
            .component(MyComponents.KEY1, MyComponent1::new)
            .component(MyComponents.KEY2, MyComponent2::new)
            .build();

    private final ComponentContainer components = CONTAINER_FACTORY.createContainer(this);

    @Override
    public ComponentContainer getComponentContainer() {
        return this.components;
    }
}
```
The argument class passed to `ComponentContainer.Factory` can be anything; in most modules it is the provider itself.

### Using entrypoints
```java
    private static final ComponentContainer.Factory<MyCustomProvider> CONTAINER_FACTORY;

    static {
        ComponentContainer.Factory.Builder<MyCustomProvider> builder = ComponentContainer.Factory.builder(MyCustomProvider.class);
        for (CustomProviderComponentInitializer entrypoint : FabricLoader.getInstance().getEntrypoints("mymod:custom-provider-components", CustomProviderComponentInitializer.class)) {
            entrypoint.registerComponents(builder);
        }
        CONTAINER_FACTORY = builder.build();
    }

    public interface CustomProviderComponentInitializer {
        void registerComponents(ComponentContainer.Factory.Builder<MyCustomProvider> builder);
    }
```

## Adding Synchronization Capabilities
To support `AutoSyncedComponent`, you must implement 2 other methods (and a temporary kludge):
```java
    @Override
    public Iterator<ServerPlayerEntity> getRecipientsForComponentSync() {
        // TODO return an iterator over the list of players watching this provider, eg. world.getPlayers().iterator()
    }

    @Nullable
    @Override
    public <C extends AutoSyncedComponent> CustomPayloadS2CPacket toComponentPacket(PacketByteBuf buf, ComponentKey<? super C> key, ComponentPacketWriter writer, ServerPlayerEntity recipient) {
        // TODO write here the information needed to uniquely identify this provider on the client
        buf.writeInt(myId);
        // Write the component data
        buf.writeIdentifier(key.getId());
        writer.writeSyncPacket(buf, recipient);
        // Finally, construct the packet with your own channel ID
        return new CustomPayloadS2CPacket(MY_PACKET_ID, buf);
    }

    @Override
    public boolean supportsCustomComponentPacketWriters() {
        return true;  // temporary required kludge, will be gone in 1.17
    }
```
Then you must register the corresponding packet listener during the client's initialization ([relevant wiki page](https://fabricmc.net/wiki/tutorial:networking#server_to_client_s2c_packets)):
```java
            ClientSidePacketRegistry.INSTANCE.register(PACKET_ID, (context, buffer) -> {
                try {
                    // TODO read here the information you wrote in toComponentPacket
                    int myId = buffer.readInt();
                    Identifier componentKeyId = buffer.readIdentifier();
                    ComponentKey<?> componentKey = ComponentRegistry.get(componentKeyId);
                    if (componentKey == null) {
                        return;
                    }
                    PacketByteBuf copy = new PacketByteBuf(buffer.copy());
                    context.getTaskQueue().execute(() -> {
                        try {
                            componentKey.maybeGet(/* TODO get your clientside provider here */)
                                .ifPresent(c -> {
                                    if (c instanceof AutoSyncedComponent) {
                                        ((AutoSyncedComponent) c).applySyncPacket(copy);
                                    }
                                });
                        } finally {
                            copy.release();
                        }
                    });
                } catch (Exception e) {
                    LOGGER.error("Error while reading components from network", e);
                    throw e;
                }
            });
```