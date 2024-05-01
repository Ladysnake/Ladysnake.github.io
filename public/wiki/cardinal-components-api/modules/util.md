---
title: Utilities
layout: cca_wiki
notoc: true
---

This module contains some utilities for more advanced component interaction.

*At the time of writing, its content is entirely experimental and quite susceptible to change.*

Main APIs:
- `Components`, a class with static methods for checking component equality between 2 providers
- `ObjectPath`, a functional [Lens-like](https://medium.com/zyseme-technology/functional-references-lens-and-other-optics-in-scala-e5f7e2fdafe) interface that can be useful in conjunction with complex component structures
- `LazyComponentType`, a more fleshed out alternative to `Lazy<ComponentType>` that can be useful when dealing with components from other mods
- `ComponentContainerMetafactory` and `GenericComponentInitializer`, interfaces that basically let you do your very own third-party CCA module (by opening up access to internals used by other modules)

**module ref:** `cardinal-components-util`