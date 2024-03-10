---
title: Cardinal Components Chunk
layout: cca_wiki
breadcrumb: Chunks
---

This module allows mods to attach components to Chunk objects. Chunk components can be automatically synchronized by implementing `AutoSyncedComponent`.

**Chunks must be marked for saving by calling `Chunk#setShouldSave(true)` in your component's setter methods**.

## Usage
### Registration
Chunk components are registered by a [`ChunkComponentInitializer`](https://github.com/OnyxStudios/Cardinal-Components-API/blob/master/cardinal-components-chunk/src/main/java/dev/onyxstudios/cca/api/v3/chunk/ChunkComponentInitializer.java), exposed as `cardinal-components-chunk` in the mod json (more information on the [component registration page](../registration#2-attaching-your-component)). Once a component factory is registered, its associated component will be available on every `Chunk` instance, on both clients and servers.

### Saving
As chunks only save when necessary, components must call the `Chunk#setShouldSave` method to ensure they get saved correctly after a change.
For example:

```java
public class MyComponent implements Component {
    private final Chunk chunk;
    private Thing thingy;

    public void setThingy(Thing thingy) {
        this.thingy = thingy;
        this.chunk.setShouldSave(true);
    }
}
```

### Synchronization
Chunk components can be automatically synchronized from the server to the client by implementing [`AutoSyncedComponent`](https://github.com/OnyxStudios/Cardinal-Components-API/blob/master/cardinal-components-base/src/main/java/dev/onyxstudios/cca/api/v3/component/sync/AutoSyncedComponent.java) - more information is available on [the component synchronization page](../synchronization).

### Ticking
Chunk components support [server](https://github.com/OnyxStudios/Cardinal-Components-API/blob/master/cardinal-components-base/src/main/java/dev/onyxstudios/cca/api/v3/component/tick/ServerTickingComponent.java) (not client) ticking. Components get ticked right after the chunk they are attached to.

### `EmptyChunk` guarantees
Empty chunks never expose any components, no matter what was originally attached to them. As such, when chunk components are queried on the client, one should make sure the chunk is loaded, or use `ComponentType#maybeGet` to retrieve a component.

## Vanilla Alternative: Customized `PersistentState`
Instead of components attached to chunks, one can use a `PersistentState` storing a data structure parallel to the actual `Chunk` map (eg. `Map<ChunkPos, MyData>`).

```diff
+ No dependency required
± Does not get unloaded automatically - more memory usage but potentially easier access
- Requires some boilerplate
- Only exists on ServerWorld - cannot be synchronized, requires casting to use, not available from other chunk views
```
To solve the latter 2 issues while keeping control over the data structure, one can also replace the `PersistentState` with a [`World` component](https://github.com/OnyxStudios/Cardinal-Components-API/wiki/Cardinal-Components-World).