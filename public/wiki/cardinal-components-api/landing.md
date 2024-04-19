---
title: Cardinal Components API
custom_title: true
layout: default
---

<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="/">Home</a></li>
        <li class="breadcrumb-item"><a href="/wiki/cardinal-components-api">Cardinal Components API</a></li>
        <li class="breadcrumb-item active" aria-current="page">Wiki</li>
    </ol>
</nav>

<h1>{% include svg/cca-banner.svg %}</h1>

## Description

Cardinal Components API is a Quilt and Fabric library that allows Minecraft mods to attach custom data to game objects in the form of components. Its goals are to offer an accessible API that is just as fast as direct mixins attachments, as well as to promote interoperability between mods using it.

For a short description and associated examples, see the repository's [README](https://github.com/Ladysnake/Cardinal-Components-API#readme).

<div id="search-bar" hidden="">
    <form class="search-form" action="/wiki/cardinal-components-api/search" method="get">
        <h2><label for="search-box" style="font-weight: inherit">Search a page</label></h2>
        <input type="text" id="search-box" name="query">
        <input type="submit" value="search">
    </form>
</div>
<script>
    // Search is currently client-only, so only display it when javascript is enabled
    document.getElementById('search-bar').hidden = false
</script>

## Wiki structure
### Setup

This section contains instructions for getting Cardinal Components API running in your instance, either as a developer or as a user.

- [Installation (for developers)](dev-install)
- [Installation (for users)](user-install)

### Basics

This section contains explanations and examples for the library's basic concepts.

- [Registering and using a component](registration)
- [Synchronizing components](synchronization)

### Advanced

This section contains documentation for advanced features, which may not be needed by most mods.

- [Creating custom component providers](advanced/custom-component-providers)

### Modules

This section regroups detailed information on each module. Note that more information is available for API classes in the form of Javadoc.

#### Generic Modules

These modules are not specific to a type of provider, and contain interfaces and helpers that can be used with any other module.

##### **[Base (core module)](modules/base)**

The core of Cardinal Components, required by every other module to function. It needs to be added to any development environment that makes use of the library.

**module ref:** `cardinal-components-base`

##### **[Utilities](modules/util)**

A collection of utilities for interacting with components as well as making your own component providers.

**module ref:** `cardinal-components-util`

#### Provider Modules

Those modules hook into existing Minecraft classes so that you can use them as component providers.
They also contain some helpers for common use cases with those specific providers.

##### **[Entities](modules/entity)**

Allows attaching components to any `Entity`, with filtering based on entity class and helpers for player data.

**module ref:** `cardinal-components-entity`

##### **[Items](modules/item)**

Allows attaching components to any `ItemStack`, with filtering based on the `Item`.

**module ref:** `cardinal-components-item`

##### **[Worlds](modules/world)**

Allows attaching components to both server and client `World`s.

**module ref:** `cardinal-components-world`

##### **[Saves (levels)](modules/level)**

Allows attaching components to `WorldProperties`, effectively used for global data storage.

**module ref:** `cardinal-components-level`

##### **[Scoreboard and teams](modules/scoreboard)**

Allows attaching components to `Scoreboard`s and `Team`s. Can be used for global data storage.

**module ref:** `cardinal-components-scoreboard`

##### **[Chunks](modules/chunk)**

Allows attaching components to `Chunk`s.

**module ref:** `cardinal-components-chunk`

##### **[Blocks](modules/block)**

Provides helpers and interfaces for attaching components to custom blocks and block entities.

**module ref:** `cardinal-components-block`