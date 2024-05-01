---
title: Base (Core Modules)
breadcrumb: Base
layout: cca_wiki
notoc: true
---

This module defines the component framework, with the base common API and implementation. Any application that uses Cardinal Components depends on this module. Its main APIs are:

- `Component`, the base interface that every component must implement ([More Information](../implementing-component))
- `ComponentKey`, the class through which components are retrieved
- `ComponentRegistry`, the interface through which you register `ComponentKey`s ([More Information](../registration))
- `SyncedComponent`, the utility interface for synchronizing components ([More Information](../synchronization))
- `ComponentProvider` and `ComponentContainer`, interfaces that can be used to attach componentFs to your own objects, or to interact with components generically

module ref: **cardinal-components-base**