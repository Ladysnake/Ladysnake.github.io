---
title: Registering and using a component
layout: cca_wiki
---

Once you are done [writing your own implementation of the `Component` interface](implementing-component), you still need to register it for it to function. This is done in two steps : the registration of the component itself, and the registration of one or more factories to attach it to the desired objects.

## 1) Registering your component

Components are provided by various objects through the `ComponentProvider` interface. 
To interact with those, you need to obtain a [`ComponentKey`](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-base/src/main/java/org/ladysnake/cca/api/v3/component/ComponentKey.java) instance - a unique key made up of an identifier and of the component's type information. Such an instance can be retrieved in a few ways, all using the [`ComponentRegistry`](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-base/src/main/java/org/ladysnake/cca/api/v3/component/ComponentRegistry.java). Note that the same `Component` implementation can be reused between several `ComponentKey`s.

### Mod Metadata

Since version 2.4 of Cardinal Components API, components are declared and attached statically. Component containers will hold those components in runtime-generated dedicated fields, guaranteeing a `ComponentKey#get` performance comparable to direct field access (that's fast). This however means that all component types must be known before the first `ComponentKey` is created.

To register a component, you must first **declare your component's identifier** in your mod's metadata.

*Note: It is safe to declare a component type that belongs to another mod. It is also safe to declare an id that may not be registered at runtime.*

{%- capture quilt_title %}
![Quilt Logo](/img/quilt_logo_transparent.png) On Quilt
{%- endcapture %}
{% capture fabric_title %}
![Fabric Logo](/img/fabric-logo.png) On Fabric
{% endcapture %}

{% tabbed modloader %}
[- {{ quilt_title }} -]
Declare your component's identifier in your `quilt.mod.json` at the top level. This is done by adding the identifier to an array of strings with the key `"cardinal-components"`. For more information on the structure of the `quilt.mod.json` file, refer to the [Quilt RFC](https://github.com/QuiltMC/rfcs/blob/master/specification/0002-quilt.mod.json.md#the-entrypoints-field).

For example, if your mod uses a component with the id `"mymod:magik"`, your `quilt.mod.json` should contain the following custom field (in addition to everything else that is already there) :
```json
{
    "schema_version": 1,
    "quilt_loader": {
        "id": "mymod"
    },
    "cardinal-components": [
        "mymod:magik"
    ]
}
```

[- {{ fabric_title}} -]
Declare your component's identifier in your `fabric.mod.json`'s `custom` properties. This is done by adding the identifier to an array of strings with the key `"cardinal-components"`. For more information on the structure of the `fabric.mod.json` file, refer to the [fabric wiki](https://fabricmc.net/wiki/documentation:fabric_mod_json_spec).

For example, if your mod uses a component with the id `"mymod:magik"`, your `fabric.mod.json` should contain the following custom field (in addition to everything else that is already there) :
```json
{
    "schemaVersion": 1,
    "id": "mymod",

    "custom": {
        "cardinal-components": [
            "mymod:magik"
        ]
    }
}
```

{% endtabbed %}

### ComponentKey

Then, to retrieve the [`ComponentKey`](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-base/src/main/java/org/ladysnake/cca/api/v3/component/ComponentKey.java), you need to call [`ComponentRegistry.getOrCreate(Identifier, Class)`](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-base/src/main/java/org/ladysnake/cca/api/v3/component/ComponentRegistry.java#L44-L76). The first argument is the identifier you put in your `fabric.mod.json`. The second argument should be the component class you wish to use. This class should be the superclass or superinterface of all implementations you may use with the resulting key (eg. `MyComponent`, not `MyComponentImpl`).

For example, if you created an `IntComponent` class like in the [Implementing the Component interface](implementing-component) page, you would retrieve the corresponding key as such :

```java
// retrieving a type for my component or for a required dependency's
public static final ComponentKey<IntComponent> MAGIK = 
        ComponentRegistry.getOrCreate(new Identifier("mymod", "magik"), IntComponent.class);
```

### Retrieval of an existing key

If your mod uses *another mod's* component, you may not want to (or may not be able to) register it yourself - in which case you can use the `get` method (note that it returns `null` if the component was not registered). If you retrieve a component through this method, you do not have to declare it in your `fabric.mod.json` metadata.

The following example demonstrates retrieving a component that another mod registers with the identifier `theirmod:blue` :
```java
// retrieving a component type registered by an optional dependency
public static final Lazy<@Nullable ComponentKey<?>> BLUE = 
        new Lazy<>(() -> ComponentRegistry.get(new Identifier("theirmod:blue")));
```

## 2) Attaching your component
Component containers use component factories to initialize their generated component fields.

Those factories are registered through dedicated entrypoints, which are typically implemented as follows:
```java
public final class MyComponents implements XComponentInitializer[, YComponentInitializer...] {
    public static final ComponentKey<IntComponent> MAGIK = ...;

    @Override
    public void registerXComponentFactories(XComponentFactoryRegistry registry) {
        registry.register(MAGIK, XIntComponent::new);
    }
}
```
Where `X` is one of the possible component providers (eg. [`EntityComponentInitializer`](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-entity/src/main/java/org/ladysnake/cca/api/v3/entity/EntityComponentInitializer.java), [`ItemComponentInitializer`](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-item/src/main/java/org/ladysnake/cca/api/v3/item/ItemComponentInitializer.java)).

*Note:`XIntComponent::new` is a [constructor reference](https://docs.oracle.com/javase/tutorial/java/javaOO/methodreferences.html). You can also write `it -> new XIntComponent()` if your constructor does not take parameters.*

The component registrar should then be added as an entrypoint to your mod's metadata:

{% tabbed modloader %}

[- {{ quilt_title }} -]

[Entrypoint documentation](https://github.com/QuiltMC/rfcs/blob/master/specification/0002-quilt.mod.json.md#the-entrypoints-field)

```json
{
    "schema_version": 1,

    "quilt_loader": {
        "id": "mymod",
        "entrypoints": {
            "cardinal-components": "a.b.c.MyComponents"
        },
    },

    "cardinal-components": [
        "mymod:magik"
    ]
}
```

[- {{ fabric_title }} -]

[Entrypoint documentation](https://fabricmc.net/wiki/documentation:entrypoint)

```json
{
    "schemaVersion": 1,
    "id": "mymod",

    "entrypoints": {
        "cardinal-components": [
            "a.b.c.MyComponents"
        ]
    },

    "custom": {
        "cardinal-components": [
            "mymod:magik"
        ]
    }
}
```

{%- endtabbed -%}

---

Instead of the universal entrypoint, you can also use the component module's name as a key, for example:
```json
    "entrypoints": {
        "cardinal-components-entity": "a.b.c.MyComponents",
        "cardinal-components-world": "a.b.c.MyComponents::registerWorldComponents"
    },
```
Note that this is the only way to use method references as registration entrypoints.

### Component ordering
Components are added to a provider in the order they were registered. Some modules (currently `cardinal-components-entity` and `cardinal-components-block`) also support explicit ordering through `Registration#after(ComponentKey)`. This ordering is reflected in (de)serialization, synchronization, and ticking. Currently, **components are initialized all at once**, which means a component cannot reference another component in its constructor (unless the latter is attached to another provider).

## 3) Using your component

Once the component is getting attached to at least one provider, you can access it with the `ComponentKey` you obtained earlier. To do this, simply pass an object of the right type to [`ComponentKey#get`](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-base/src/main/java/org/ladysnake/cca/api/v3/component/ComponentKey.java#L78-L87) or one of its variants ([`ComponentKey#maybeGet`](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-base/src/main/java/org/ladysnake/cca/api/v3/component/ComponentKey.java#L89-L97) and [`ComponentKey#getNullable`](https://github.com/Ladysnake/Cardinal-Components-API/blob/master/cardinal-components-base/src/main/java/org/ladysnake/cca/api/v3/component/ComponentKey.java#L66-L76)).

The following example demonstrates getting an `IntComponent` - as written in the [Implementing the Component interface](implementing-component) page - that was attached to instances of the `Entity` class using the [`cardinal-components-entity`](Cardinal-Components-Entity) module.
```java
public static final ComponentKey<IntComponent> MAGIK = ...; // See the "Registering your component" section

public static void useMagik(Entity provider) { // anything will work, as long as a module allows it!
    // Retrieve a provided component
    int magik = MAGIK.get(provider).getValue();
    // Or, if the object is not guaranteed to provide that component:
    int magik = MAGIK.maybeGet(provider).map(IntComponent::getValue).orElse(0);
    // ...
}
```

*Note: if you are using Loom 0.11+ and CCA 4.1+, you can see which objects implement `ComponentProvider`. Otherwise, you can assume objects implement it behind the scenes as long as you have a corresponding module (eg. if you have the `cardinal-components-world` module, any `World` object can be passed to `ComponentKey#get`)*
