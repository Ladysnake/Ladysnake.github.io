---
title: Requiem
slug: requiem
mod_logo: requiem.png
layout: wiki
curse_project: 265729
modrinth: true
---

## Introduction

Requiem is a mod aiming at revamping Minecraft's death system and the gameplay surrounding it.  
In the base game, death presents itself as the simple threat of losing your items, setting you back proportionally
to how much stuff you carried.

With this mod installed however, every player can choose an alternate path where death leads
to a completely different gameplay sequence where they play as an actual ghost with the goal of finding a replacement body.
Further down the line, players can learn to harness their otherworldly powers, perfecting the dark art of body possession, and
unlocking special tech to assist them.

---

## Content

{% assign index = site.data.requiem.wiki_index %}
{% include page_listing.liquid pages=index.current root_url="/wiki/requiem" %}

<hgroup>
<h3>Removed content</h3>
<p>The following pages describe content that no longer exists:</p>
</hgroup>

{% include page_listing.liquid pages=index.removed root_url="/wiki/requiem" %}

---

## Mod Interactions

- **Origins**:
    - when installed, the choice between mortal and demon is done through the Origins selection screen instead of through a dialogue at first death
    - when outside of a regular player body, origin powers are all disabled
- **Eldritch Mobs**:
    - Eldritch mobs cannot be possessed
- **Golems Galore**:
    - All modded golems can be possessed by default
- **Better Nether**:
    - Jungle skeletons can be possessed by default

### Known Incompatibilities

- First Person Mod: Makes the possessed mob appear in first person, blocking the sight.
- Optifine/Optifabric: Incompatible with Requiem.