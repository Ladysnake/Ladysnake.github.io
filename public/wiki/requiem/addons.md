---
title: Requiem Addons
breadcrumb: Addons
layout: requiem_wiki
---

## Pandemonium

Pandemonium is the first-party "testing grounds" for Requiem.
It includes features that are deemed too unpolished to fit in the main mod.

### Current content
#### Wandering spirit
The Wandering Spirit is a new soul state that permanently has the effects of Penance II, Reclamation, and Emancipation.
It can enter and leave other bodies as it wishes, but cannot make a human body on its own.


### Removed content

The following sections describe content that has been removed from pandemonium as it has been
integrated into the main mod.

{% capture summary %}<h4 id="before-v2">Before v2.0.0</h4>{% endcapture %}
{% capture content %}
##### Changes to Requiem

- Most living entities can be possessed. Notable exceptions are the Enderdragon, the Wither boss, and other players.
- Players in their regular form can dissociate at any time, leaving a *player shell* behind.

##### Player shells

When a player dissociates from their regular body, they create a player shell. If that shell is possessed by another player, that player will gain the identity of the original player - see [Impersonate](../impersonate) for more information.

Items on inert shells can be added and removed like on armor stands.

###### Mod compatibility

- Shells will keep Origins powers. If a shell is possessed by another player, that player's origin will be changed to the shell's.
- Shells will keep Haema's vampirism. If a shell is possessed by another player, that player will gain or lose vampirism based on the shell.

##### Special Item Uses

Pandemonium adds some special item uses for the newly possessable mobs.

###### Witch's Brew Base

Witches can brew potions on the fly: when they are holding a water bottle, witches will
automatically brew the potion they need to survive certain situations.

##### Admin Commands

- `/pandemonium shell`
  - `/pandemonium shell create [player]`: creates a shell copying the targeted player's data at the command's location. If no player is specified, will copy the player who run the command.
  - `/pandemonium shell split [players]`: artificially splits one or more players as if they used the dissociate keybind.
  - `/pandemonium shell identity set <profile> [shells]`: sets the identity (name and skin) of one or more shells to the given profile.
{% endcapture %}
{% include details.liquid summary=summary content=content%}
