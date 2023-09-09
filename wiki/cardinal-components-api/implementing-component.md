---
title: Implementing the `Component` Interface
breadcrumb: Implementing Component
layout: cca_wiki
---

## The Component Interface

To get started with Cardinal Components API, you only need a class implementing the `Component` interface. This interface is currently defined as such :
```java
public interface Component {
    void readFromNbt(NbtCompound tag);
    void writeToNbt(NbtCompound tag);
}
```
The two methods to implement are for reading and writing your component's data to disk. Implementing those correctly is necessary for your data to carry over whenever the thing to which your component is attached gets unloaded.

It is good practice (though not required) to make an interface for your component separate from the implementation, so that internals get properly encapsulated and so that the component itself can be used as an API by other mods.

**After implementing the `Component` interface, you need to register it. See [Registering and using a component](registration) for more information.**

## Barebones Example

The example below demonstrates storing an integer in a component and saving it to disk.
Once [registered](registration#1-registering-your-component) and [attached to a provider](registration#2-attaching-your-component), the component's value can be retrieved or incremented at any time.

In the example, the integer is saved to the provided tag under the key `"value"` - you can replace this with any string, but you can only have one entry for each key in your tag, and you will need to remember the key in order to retrieve the data later.

```java
// Your own component interface. You still need to register it!
public interface IntComponent extends Component {
    int getValue();
    void increment();
}

class RandomIntComponent implements IntComponent {
    private int value = (int) (Math.random() * 50); // random initial value because why not
    @Override public int getValue() { return this.value; }
    @Override public void increment() { this.value++; }
    @Override public void readFromNbt(NbtCompound tag) { this.value = tag.getInt("value"); }
    @Override public void writeToNbt(NbtCompound tag) { tag.putInt("value", this.value); }
}
```

## Extensions

A `Component` implementation can also implement some extended interfaces to help with tasks such as [server-client synchronization](synchronization), [data transfers](https://github.com/OnyxStudios/Cardinal-Components-API/blob/master/cardinal-components-base/src/main/java/dev/onyxstudios/cca/api/v3/component/CopyableComponent.java) or [ticking](ticking). More information on those interfaces is available in the javadoc and in the documentation for each module.

**[Next up: Registering and using a component](registration)**