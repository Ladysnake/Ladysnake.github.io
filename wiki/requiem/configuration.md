---
title: Requiem Configuration
layout: requiem_wiki
---
## Gamerules

Requiem adds a few gamerules to help customize a server's gameplay:
 - `requiem:showPossessorNameTag`: if set to `true`, shows the name of the possessor above the head of possessed entities. (default: `false`)
 - `requiem:disableCure`: if set to `true`, the cure mechanic will be disabled entirely. (default: `false`)
 - `requiem:startingRemnantType`: can be set to `FORCE_REMNANT` or `FORCE_VANILLA` to enforce all players to be respectively a demon or a normal player at the start of the game. (default: `CHOOSE`)
 - `requiem:possessionKeepInventory`: can be set to `LIVING` or `ALWAYS` to respectively keep the inventory on your soul when you split while your possessed entity is still living, or to always keep the inventory on your soul when possession stops for any reason. (default: `NEVER`)


## Datapacks

### Tags
The lists below represent a file tree taking root in the `tags` directory of a datapack.

#### Blocks
- [`requiem:tags/blocks`](https://github.com/Ladysnake/Requiem/tree/1.16/src/main/resources/data/requiem/tags/blocks)
	- `soul_impermeable.json`: specifies which blocks **cannot** be phased through by incorporeal players

#### Entity Types
Most entity type tags control aspects of possession.

- [`requiem:tags/entity_types`](https://github.com/Ladysnake/Requiem/tree/1.16/src/main/resources/data/requiem/tags/entity_types)
	- `behavior`
		- `immovable.json`: Entities that cannot move normally, like shulkers in vanilla. Those are also included by default in `frictionless_hosts`.
		- `regular_eaters.json`: Entities that should use a regular hunger bar when possessed.
	- `inventory`
		- `armor_banned.json`: Entities that cannot use armor when possessed, overrides the automatic detection of armor users.
		- `armor_users.json`: Entities that can use armor when possessed.
		- `inventory_carriers.json`: Entities that can use the whole player inventory when possessed.
		- `item_users.json`: Entities that can hold items in their hands and use them when possessed. An entity must currently have this tag to be curable.
		- `supercrafters.json`: Entities that give access to a portable 3x3 crafting inventory when possessed.
	- `possession`
		- `frictionless_hosts.json`: Entities that can be dissociated from at any time, like golems in the base mod.
		- `possessables.json`: Entities that can be possessed. Irrelevant when pandemonium is installed.
		- `possession_blacklist.json`: Entities that can never be possessed, like the Wither and the Ender Dragon.
	- `tranformation`
		- `replaceable_skeletons.json`: Skeletons that will be swapped with a regular vanilla skeleton after replacing enough bones, like wither skeletons in the base mod.
		- `skeletonizable.json`: Mobs that can use the totem of skeletonization when possessed.
	- `vision`
		- `dichromats.json`: Mobs that use the dichromatic shader in first person.
		- `tetrachromats.json`: Mobs that use the "tetrachromatic" (not very tetrachromatic) shader in first person.
	- `golems.json`: Golems are by default included in the `frictionless_hosts` tag.
	- `humanoid_skeletons.json`: Humanoid skeletons are by default included in the `armor_users`, `item_users`, `inventory_carriers`, `skeletonizable`, and `skeletons` tags.
	- `humanoid_zombies.json`: Humanoid zombies are by default included in the `armor_users`, `item_users`, `inventory_carriers`, `skeletonizable`, and `zombies` tags.
	- `humans.json`: Humans are by default included in the `armor_users`, `inventory_carriers`, `item_users`, and `skeletonizable` tags.
	- `piglins.json`: Piglins are by default included in the `item_users` and `skeletonizable` tags.
	- `skeletons.json`: Skeletons are by default included in the `undead` tag.
	- `undead.json`: Undead mobs are by default included in the `possessables` tag.
	- `zombies.json`: Zombies are by default included in the `undead` tag. Players killed by them may resurrect as zombies.


#### Items
- [`requiem:tags/items`](https://github.com/Ladysnake/Requiem/tree/1.16/src/main/resources/data/requiem/tags/items)
	- `bones.json`: Items that can be used by skeletons to regenerate health.
	- `raw_fishes.json`: Items that can be eaten by drowneds.
	- `raw_meats.json`: Items that can be eaten by zombies.
	- `undead_cures.json`: Items that can be eaten to cure a possessed undead entity.

### Changes to Predicates

To support more functionality in the following systems, Requiems adds its own predicates to vanilla ones.

#### Entity Predicates

- `requiem:can_be_cured`: can be `true` or `false`. If left unspecified, will not affect the predicate in any way. If `true`, only entities that are possessed and can currently be cured will be matched. If `false`, only entities that *cannot* be cured will be matched.
- `requiem:health_fraction`: a float range between 0 and 1, that will be applied to the quotient of the current health over the entity's max health.

#### Item Predicates

- `requiem:food`: a JSON object representing a food component predicate. If left unspecified, will not affect the item predicate in any way. Otherwise, will only match food items. All attributes below are ignored if left unspecified.
  - `hunger`: an int range for the food's hunger value
  - `saturation_modifier`: a float range for the food's saturation modifier
  - `meat`: a boolean compared with the food's `meat` attribute
  - `always_edible`: a boolean compared with the food's `alwaysEdible` attribute
  - `snack`: a boolean compared with the food's `snack` attribute

### Resurrections

When a player or a possessed entity dies in specific conditions, it may resurrect as a new entity.
The `requiem_resurrections` data directory contains the files defining that behavior. Each resurrection scenario is written as a JSON file with the following attributes :

- `schema_version`(int): the version of the data format being used. As of 1.4.3, must be 0.
- `priority`(int, optional): the priority of the scenario. Higher priority scenarios are tested first. Defaults to 100.
- `killing_blow`(damage predicate, optional): a predicate for the damage that killed the entity.
- `player`(entity predicate, optional): a predicate for the player being resurrected, or the player possessing the entity being resurrected.
- `possessed`(entity predicate, optional): a predicate for the possessed entity being resurrected. If absent, the scenario will only succeed if the player is not possessing anything.
- `consumable`(item predicate, optional): a predicate for an item that will be consumed from the player's inventory if the scenario succeeds. If absent, no item is consumed.
- `entity`:
	- `type`(identifier): the type of the entity that will be summoned if the scenario succeeds.
	- `nbt`(NBT, optional): additional data for the resulting entity.

### Entity Movement
Entities in Minecraft can move in a number of ways. Requiem attempts to capture the movement characteristics of each entity through the `requiem:entity_mobility` JSON data file.
Each entry in this file represents a mob, and contains the following fields (all optional):
- `flightMode`(DISABLED/ENABLED/FORCED/UNSPECIFIED): whether an entity can fly, and whether it can stop flying. If not specified, auto-detection will be attempted based on the entity's class.
- `swimMode`(DISABLED/ENABLED/FORCED/UNSPECIFIED): whether an entity can swim, and whether it can stop swimming. If not specified, auto-detection will be attempted based on the entity's class.
- `flopsOnLand`(bool): if `true`, the entity will consistently autojump when on land, like a fish.
- `climbsWalls`(bool): if `true`, the entity will be able to climb walls, like a spider.
- `phasesThroughWalls`(bool): if `true`, the entity will be able to phase through walls, like a vex.
- `gravity`(float): this number will be subtracted from the entity's vertical velocity each tick. Stacks with regular minecraft gravity. May be negative for inverted gravity.
- `fallSpeedModifier`(float): each tick the entity is falling, its vertical velocity will be multiplied by this amount.
- `inertia`(float, \[0,1\] range): every tick, the movement input is interpolated with the previous speed according to this value. An inertia of 1 means it is impossible to change direction or speed.

### Mob Item Overrides

Requiem allows one to override the behavior of an item when it is used by a possessed mob. This is done through files in the `requiem/mob_items` directory. Each file describes a single override, and contains the following fields:

- `schema_version`(int): the version of the data format being used. As of 1.7.0, must be 0.
- `priority`(int, optional): the priority of the scenario. Higher priority scenarios are tested first. Defaults to 100.
- `enabled`(bool, optional): whether this override is enabled or not. Mainly used to disable existing overrides through datapacks. Defaults to `true`.
- `tooltip`(text, optional): the text to display in the item's tooltip when the conditions are fulfilled. If unspecified, no tooltip will be displayed.
- `possessed`(entity predicate, optional): a predicate for the possessed entity "using" the item.
- `used_item`(item predicate, optional): a predicate for the item stack being used
- `use_time`(int, optional): the time to play a use animation for. Defaults to 0.
- `result`:
  - `action`(string): as of 1.7.0, with no add-on, can be one of the following:
    - `requiem:pass`: lets the default item behavior take place
    - `requiem:fail`: prevents the item from being used
    - `requiem:cure`: attempts to start a curing process
    - `requiem:eat_to_heal`: available only for food items; converts the food's hunger value to HP
    - `requiem:replace_bone`: available only for skeleton entities; heals 2 hearts
  - `cooldown`(int, optional): the cooldown before another item of the same type can be used