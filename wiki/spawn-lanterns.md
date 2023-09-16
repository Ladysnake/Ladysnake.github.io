---
layout: wiki
title: Spawn Lanterns
slug: spawn-lanterns
curse_project: 418565
---

**Spawn Lanterns** is a Minecraft Fabric mod that introduces a solution for regulating hostile mob spawn rates.

## Features

### Lantern Conversion

Soul lanterns can be converted into spawn lanterns depending on the ingredient used.

### Soothing Lantern

Using a honey bottle on a soul lantern will transform it into a Soothing lantern (along with giving you back an empty bottle).
Soothing lanterns grant the Soothing effect in a 20x20x20 block radius around the lantern. 

![Soothing Lantern](spawn-lanterns/SoothingLantern.png)

#### Soothing

Soothing avoids hostile mob spawns if the light level is above 0, meaning mobs won't spawn on the surface, even during the night.
However, Soothing doesn't decrease the mob spawn cap, meaning you may find more mobs in caves during nighttime.

![Soothing Effect](spawn-lanterns/Soothing.png)

### Crying Lantern

Using a crying obsidian block on a soul lantern will transform it into a Crying lantern (along with giving you back an obsidian block).
Crying lanterns grant the Provocation effect in a 20x20x20 block radius around the lantern. 

![Crying Lantern](spawn-lanterns/CryingLantern.png)

#### Provocation

Provocation multiplies the mob spawn limit by two, meaning more hostiles will be present at the same moment.
Provocation also makes neutral mobs (wolves, bears...) and neutral-hostile mobs (endermen, zombified piglins...) target you automatically.

![Provocation Effect](spawn-lanterns/Provocation.png)

## FAQ

#### Can I include this mod in a modpack?

**Yes**: You can. Go  ahead, don't bother asking. Please however provide credit and a link to  either the [GitHub repository](https://github.com/ladysnake/spawn-lanterns) or [Curse Forge project page](https://www.curseforge.com/minecraft/mc-mods/spawn-lanterns).

#### Forge?

**No**: As this mod uses a consequent amount of Mixins and Forge does not officially and stably  support Mixin injection, no, we won't port this mod to Forge. The code is open source though, so if you want to do it, go ahead.

## Gallery

![Soothing](spawn-lanterns/SoothingScreenshot.png)

![Provocation](spawn-lanterns/ProvocationScreenshot.png)

