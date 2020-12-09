---
title: Requiem
slug: requiem
mod_logo: requiem_icon_0.png
layout: wiki
---

<strong style="font-size: x-large;">Requiem has a [wiki](requiem/landing.html)!</strong>

## What is Requiem?

Requiem is a Minecraft (Java Edition) mod aiming at removing the continuity break resulting from death. <br />
In vanilla Minecraft, dying is bland and can be frustrating: you lose all your items and get redirected
to a menu where you can choose to reappear at your spawn point or quit the game.<br />
With Requiem installed however, this immersion-breaking menu is removed and dying gives place to various gameplay elements.

## Why would you want to use it?

As explained above, Requiem is great for players willing to make death a little different from most games.
Additionally, Requiem has other benefits and features that other players can enjoy:

 - Explorers wanting to venture far in their world, only to be retained by their death leading back to their respawn point. 
   As such, Requiem allows an infinite journey, so you don't have to walk the same path twice.
 - Players searching to change their playstyle by roleplaying an undead, fleeing sunlight, drowning endlessly
   in the ocean or eventually searching for preys to feast on.
 - And players wanting to experience this new Death, while having friends not willing to. 
   The mod allows both death systems,Vanilla and Requiem, to coexist in the same world at the same time, 
   depending on each player's needs.

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

## Admin Commands

Requiem adds a few admin commands to make testing the mod or helping clueless players more easily.
All Requiem commands start with `/requiem`. Most of them take an optional player argument. If that argument is not given, the target
of the command will be the command executor.

 - `/requiem remnant`
    - `/requiem remnant set <true|false> [player]`: sets the remnant status of a player. (Remnants are called demons in the lore, they turn into ghosts when they die)
    - `/requiem remnant query [player]`: queries the remnant status of a player.
 - `/requiem soul`
    - `/requiem soul set <true|false> [player]`: sets the soul status of a remnant player.
    - `/requiem soul query [player]`: queries the soul status of a player
 - `/requiem possession`
    - `/requiem possession start <mob> [player]`: makes the player start possessing a mob, if they are already a soul.
    - `/requiem possession stop [player]`: stops an ongoing possession on the specified player.

On top of those commands, Requiem adds a few gamerules to help customize a server's gameplay:
 - `requiem:showPossessorNameTag`: if set to `true`, shows the name of the possessor above the head of possessed entities. (default: `false`)
 - `requiem:startingRemnantType`: can be set to `FORCE_REMNANT` or `FORCE_VANILLA` to enforce all players to be respectively a demon or a normal player at the start of the game. (default: `CHOOSE`)
