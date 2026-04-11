---
title: Upgrading from CCA 7.x to 8.0
breadcrumb: 8.x upgrade
layout: cca_wiki
---

With Minecraft 26.1 comes Mojmap everywhere, and so we adapt.
Thus comes Cardinal Components API v8 - The One Remapping.

This page details the main changes in the 8.0.0 update, and how to deal with them. Note that the rest of the documentation is not updated yet, we thank you for your patience.

## Components

The main change: to avoid conflicts with Minecraft's text `Component` class, the library's main interface has been renamed to `CardinalComponent`.
The new interfaces live in the `org.ladysnake.cca.v8` package.

## World, Level, and LevelData

**Summary: `World` is now called `Level`. `LevelProperties` is now called `LevelData`**
{:.admonition.admonition-important}

To match this naming change, the `cardinal-components-world` module has been migrated to `cardinal-components-level`.
The old `cardinal-components-level` module has in turn been renamed to `cardinal-components-leveldata`.
All interfaces inside these two modules have been renamed accordingly.

`cardinal-components-leveldata` is still officially deprecated in favour of `cardinal-components-scoreboard` and has again more limitations :
Components attached to a `LevelData` object (using the `cardinal-components-leveldata` module) can no longer use dynamic registries in serialization (vanilla limitation).
