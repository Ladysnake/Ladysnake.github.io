---
title: Cardinal Components Item
layout: cca_wiki
breadcrumb: Items
---

**Item components have been entirely removed from Cardinal Components API in version 6.0.0.**
{:.admonition.admonition-warning.admonition-icon.large-icon}

The `cardinal-components-item` module now contains an `ItemComponentMigrationRegistry`, which is used to help you migrate to vanilla components.
You can find more information in [the migration page](../upgrade-instructions/CCA-6-changes#changes-to-the-item-module).

{% capture before_v6 %}
This module allows mods to attach components to `ItemStack` instances in the form of a wrapper around the stack's NBT.

## Features
### Registration
Item components are registered by an [`ItemComponentInitializer`](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-item/src/main/java/org/ladysnake/cca/api/v3/item/ItemComponentInitializer.java), exposed as `cardinal-components-item` in the mod json (more information on the [component registration page](../registration#2-attaching-your-component)).

Component factories can be registered to all stacks of a given `Item`, using its identifier. You can also register a component factory with a `Predicate<Item>`, which lets you use your own criteria like "implements a specific interface" or "cannot be stacked" (or even to all items, although this is discouraged for performance reasons).
Registering a factory using both a predicate and an item ID will cause the latter factory to override the former, letting you eg. use a different implementation for your tools than for others'.

### Synchronization
Item components are automatically and systematically synchronized whenever their stack is. **The `AutoSyncedComponent` interface has *no effect* when the component is attached to a stack.**

### Ticking
Item components **do not support ticking**. If you want the stack to change over time, you should store the time it was created/last updated and compute the age when needed.

### Emptiness guarantee
Empty item stacks never expose any components, no matter what was originally attached to them. The components will become available again with no loss if the stack stops being empty at any point.

## Transient Item Components

In most cases, Item components should store their data in their stack's NBT. Since version 2.7.10 of Cardinal Components API, this is facilitated with the [`ItemComponent`](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-item/src/main/java/org/ladysnake/cca/api/v3/item/ItemComponent.java) abstract class.

The following example demonstrates re-implementing the `IntComponent` interface as defined in [Implementing the Component interface](../implementing-component) as an `ItemComponent`.

```java
public class ItemIntComponent extends ItemComponent implements IntComponent {
    @Override public int getValue() { return this.getInt("value"); }
    @Override public void increment() { this.putInt("value", this.getValue() + 1); }
}
```

Item components are registered through one of the `ItemComponentFactoryRegistry#register` overloads.

For example, assuming the existence of a `ComponentKey<IntComponent> MAGIK` constant as defined in [Registering and using a component](../registration):
```java
    @Override
    public void registerItemComponentFactories(ItemComponentFactoryRegistry registry) {
        // Attach an ItemIntComponent to all armor items
        registry.register(item -> item instanceof ArmorItem, MAGIK, ItemIntComponent::new);
        // Attach an ItemIntComponent to leather chestplates specifically
        registry.register(Items.LEATHER_CHESTPLATE, MAGIK, ItemIntComponent::new);
    }
```

### Data Initialization

If your component has specific default values, you should set them lazily. This lets you not use any memory until you actually start using your component.

For example:
```java
    @Override
    public int getValue() {
        if (!this.hasTag("value", NbtType.INT)) this.putInt("value", 10);
        return this.getInt("value");
    }

    @Override
    public void increment() {
        this.putInt("value", this.getValue() + 1); // performs initialization through getValue()
    }
```

### Caching (Advanced)
If you perform a lot of read operations, and especially if your data is costly to deserialize, you may want to cache your component's data. You can invalidate your caches in the `onTagInvalidated` method from `ItemTagInvalidationListener` (implemented by `ItemComponent`).

For example:
```java
    private static final int DEFAULT_VALUE = 10;

    private boolean initialized;
    private int cachedValue;

    @Override
    public int getValue() {
        if (!this.initialized) {
             if (!this.hasKey("value", NbtType.INT)) this.putInt("value", DEFAULT_VALUE);
             this.cachedValue = this.getInt("value");
             this.initialized = true;
        }
        return this.cachedValue;
    }

    @Override
    public void increment() {
        this.putInt("value", this.getValue() + 1); // performs initialization through getValue()
    }

    @Override
    public onTagInvalidated() {
       super.onTagInvalidated(); // Must call super!
       this.initialized = false;
    }
```

#### Live Structures (Very Advanced)
If you need your component to use live objects for speed or API reasons, you can create dedicated classes binding live data to your stack's NBT.

The following example demonstrates an item component that associates identifiers with mutable color objects. Note that this could be more easily implemented through individual methods like `getRed(Identifier)`/`setRed(Identifier, byte)`, but it may be slightly slower or more complex for API users.

```java
public class ItemColorComponent {
    private @Nullable Map<Identifier, MutableColor> colors;

    public MutableColor getColor(Identifier identifier) {
        if (this.colors == null) { // Lazy initialization
            this.colors = new HashMap<>();

            // Load existing data from the stack's NBT
            CompoundTag colorsNbt = this.getCompound("colors");
            for (String id : colorsNbt.getKeys()) {
                if (colorsNbt.contains(id, NbtType.COMPOUND)) {
                    this.colors.put(Identifier.tryParse(id), new MutableColor(colorsNbt.getCompound(id)));
                } else {
                    colorsNbt.remove(id); // clear corrupted data
                    this.putCompound("colors", colorsNbt); // will clean up the stack's NBT if empty
                }
            }
        }
        if (this.colors.containsKey(identifier)) {
            // Return existing color
            return this.colors.get(identifier);
        }
        if (!this.colors.containsKey(identifier)) {
            // Create a new color and bind it to the stack's NBT
            CompoundTag tag = this.getCompound("colors");
            MutableColor color = new MutableColor(new CompoundTag());
            this.colors.put(identifier, color.tag);
            tag.put(identifier.toString(), color.tag);
            this.putCompound("colors", tag); // the tag returned by getCompound may just have been created
            return color;
        }
    }

    public void removeColor(Identifier identifier) {
        if (this.colors != null && this.colors.remove(identifier) != null) {
            CompoundTag tag = this.getCompound("colors");
            tag.remove(identifier.toString());
            this.putCompound("colors", tag); // will clean up the stack's NBT if tag is empty
        }
    }

    @Override
    public onTagInvalidated() {
       super.onTagInvalidated(); // Must call super!
       this.colors = null;
    }

    public static class MutableColor {
        private final CompoundTag tag;
        private byte red, green, blue;

        Color(CompoundTag tag) {
            this.tag = tag;
            this.red = tag.getByte("red");
            this.green = tag.getByte("green");
            this.blue = tag.getByte("blue");
        }

        public int getRed() {
            return this.red;
        }

        public void setRed(int red) {
            this.red = red;
            this.tag.putByte("red", red);
        }
        // etc.
    }
}
```

### A note on component initialization

For performance reasons, item stacks initialize their components lazily, only the first time they are queried. Because of this, components may get displayed clientside before they get initialized serverside. For this reason, ItemStack component initialization must be pure and constant, ie. the initial value of each field must not be random or based on volatile data like stack count or NBT. Failing that can lead to desynchronization, causing clientside item stacks to hold "ghost data" - data that does not match the server's expectations.

```java
private void tryInit() { // Lazy init method
    // Bad:
    this.putDouble("bad0", Math.random()); // DO NOT DO THIS, DESYNC WILL HAPPEN
    this.putInt(stack.getCount()); // ALSO BAD, the stack's count may change before the component gets initialized on the server
    // Good:
    this.putInt("x", 3);  // Constant value
    this.putString("y", Registry.ITEM.getId(stack.getItem).toString()); // cannot change
}

public void init() { // explicit init method
    this.putDouble("r", Math.random()); // This is fine as long as init() is called only on the server
}
```

## Hard Item Components (pre-4.0.0)

**This feature has been removed as of 4.0.0 (for MC 1.18). The following is documentation for the feature as it existed before the API Lookup API.**

"Hard" item components serialize their data separately. They are more prone to mod incompatibilities and suffer from various quirks that transient item components do not have.

Item components are automatically saved and synchronized with the stack they are attached to, and are copied whenever the stack's NBT is copied (notably in some recipes). They are also factored in the results of all `ItemStack` equality methods that consider NBT - **for this reason, component implementations that get attached to item stacks must define a meaningful `equals` method!**

*In development environments, CCA checks that your itemstack components do redefine `equals`. If you want to disable this behaviour, add `-Dcca.debug.noverifyequals=true` to your VM options/run arguments.*

### A note on performance

**If you attach a component to a significant amount of stacks, you really need to minimize your component's impact!** This can be done by not writing default values in `writeToNbt` (speeds up serialization and avoids save file bloat), and by implementing `CopyableComponent` (speeds up stack copies).

### A note on component initialization

For performance reasons, item stacks initialize their components *lazily*, only the first time they are queried. Because of this, components may get displayed clientside *before they get initialized serverside*. For this reason, **ItemStack component initialization must be pure and constant**, ie. the initial value of each field must not be random or based on volatile data like stack count or NBT. Failing that can lead to desynchronization, causing clientside item stacks to hold "ghost data" - data that does not match the server's expectations.

```java
public MyItemStackComponent(ItemStack stack) {
    // Bad:
    this.bad0 = Math.random(); // DO NOT DO THIS, DESYNC WILL HAPPEN
    this.bad1 = stack.getCount(); // ALSO BAD, the stack's count may change before the component gets initialized on the server
    // Good:
    this.x = 3;  // Constant value
    this.y = Registry.ITEM.getId(stack.getItem); // cannot change
}

public void init() {
    this.r = Math.random(); // This is fine as long as init() is called outside of the constructor
}
```

### Equality
Stack equality methods `areTagsEqual` and `isEqualIgnoreDamage` are modified to check component equality. If you have issues when attaching components to item stacks, it usually means you forgot to implement a meaningful `equals` check on your component.

## Vanilla Alternative: Stack NBT
```diff
+ No dependency
+ No setup required, readily available on every stack
+ No overhead whatsoever until the data is actually added
= Automatically synchronized
- Requires a mixin to add data to every created stack
- Must be (de)serialized for every use (can be slow)
- Can only carry raw public data, no private fields, no methods, no interface implementing
```
{% endcapture %}

{% include details.liquid summary="### Before V6" content=before_v6 %}