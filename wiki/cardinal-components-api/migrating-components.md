---
title: Migrating Components
layout: cca_wiki
---

Sometimes, you want to rename or delete a component between versions of your mod. Cardinal Components API does not currently have specific utilities to help with that, but here is how you would proceed.

## Removing a component from your mod

You can just do it, the library will not complain much but it will print warnings in the logs saying it "failed to deserialize a component" when an old world or chunk gets loaded. If you want to avoid these warnings, you can register an empty component that writes no data (e.g. a `TransientComponent`) with the ID of the component you just removed. After a while - typically during the next major minecraft update - you can remove that transient component with no warnings.

### Deprecating gracefully

When your component is part of a public API, you should avoid suddenly removing the old interface - consider annotating the class with `@Deprecated`, and replacing all the public methods with dummies (empty methods with a fixed return value) to avoid crashing compatible mods.

## Changing a component's ID

Similarly to the removal case, you can register a temporary component with the old ID, but instead of doing absolutely nothing it should read the old data and transfer it to the new component:

```java
public class OldIntComponent implements Component {
    private final Object owner;

    public OldIntComponent(Object owner) {
        this.owner = owner;
    }

    @Override
    default void readFromNbt(NbtCompound tag) {
        NEW_INT_COMPONENT_KEY.get(this.owner).readFromNbt(tag); // makes the new component read the old data if it exists
    }

    @Override
    default void writeToNbt(NbtCompound tag) {
        // Nothing to write, the new component should write its own data
    }
}
```
To ensure deterministic data loading, you should add an ordering between the old and the new components; in the case of entity components:
```java
    @Override
    public void registerEntityComponentFactories(EntityComponentFactoryRegistry registry) {
        registry.registerFor(entityClass, OLD_INT_COMPONENT_KEY, OldIntComponent::new);
        registry.beginRegistration(entityClass, NEW_INT_COMPONENT_KEY).after(OLD_INT_COMPONENT_KEY).end(IntComponent::new);
    }
```

### Deprecating gracefully

Again, when your component is part of a public API, you should avoid suddenly removing the old interface - consider annotating the transition class with `@Deprecated`, and replacing all the public methods with delegates to the new interface to avoid crashing compatible mods.
