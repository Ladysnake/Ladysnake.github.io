---
title: Requiem Configuration
layout: requiem_wiki
datapack_editor: true
---
## Gamerules

Requiem adds a few gamerules to help customize a server's gameplay:
 - {%include gamerule.html name="requiem:showPossessorNameTag"%}: if set to `true`, shows the name of the possessor above the head of possessed entities. (default: `false`)
 - {%include gamerule.html name="requiem:disableCure"%}: if set to `true`, the cure mechanic will be disabled entirely. (default: `false`)
 - {%include gamerule.html name="requiem:startingRemnantType"%}: can be set to `FORCE_REMNANT` or `FORCE_VANILLA` to enforce all players to be respectively a demon or a normal player at the start of the game. (default: `CHOOSE`)
 - {%include gamerule.html name="requiem:possessionKeepInventory"%}: can be set to `LIVING` or `ALWAYS` to respectively keep the inventory on your soul when you split while your possessed entity is still living, or to always keep the inventory on your soul when possession stops for any reason. (default: `NEVER`)


## Datapacks

### Tags
The lists below represent a file tree taking root in the `tags` directory of a datapack.

**New: Edit tags directly in this section, then click "Export" at the end to generate your datapack!**

*Checking "Replace Existing" deletes default values.*

#### Blocks

{%include tag_list.liquid type="block" modid="requiem" tags=site.data.requiem.block_tags%}

#### Biomes
{%include tag_list.liquid type="biome" modid="requiem" tags=site.data.requiem.biome_tags%}

#### Entity Types
Most entity type tags control aspects of possession.

{%include tag_list.liquid type="entity_type" modid="requiem" tags=site.data.requiem.entity_type_tags%}

#### Items

{%include tag_list.liquid type="item" modid="requiem" tags=site.data.requiem.item_tags%}

<div class="tag-export hidden"><!--No JS === no export-->
<button id="export-btn" class="btn btn-info btn-lg">EXPORT</button>
<p id="export-log" class="lead"></p>
</div>

### Loot Tables

Requiem adds the ability to configure what loot a player gets when first possessing a mob by adding loot table files to `<namespace>:loot_tables/requiem/possession/<mob_id>.json`. Those loot tables must have the `requiem:possession` type. For examples, see [possession loot tables for vanilla mobs](https://github.com/Ladysnake/Requiem/tree/1.16/src/main/resources/data/minecraft/loot_tables/requiem/possession).



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
- `walkSpeedModifier` (float): applied as a *multiply_base* attribute modifier on the entity's generic speed attribute. Use negative values to slow down the entity on the ground.
- `inertia`(float, \[0,1\] range): every tick, the movement input is interpolated with the previous speed according to this value. An inertia of 1 means it is impossible to change direction or speed.

### Mob Item Overrides

Requiem allows one to override the behavior of an item when it is used by a possessed mob. This is done through files in the `requiem/mob_items` directory. Each file describes a single override, and contains the following fields:

- `schema_version`(int, required): the version of the data format being used. As of 1.7.8, should be 1.
- `priority`(int, optional): the priority of the scenario. Higher priority scenarios are tested first. Defaults to 100.
- `enabled`(bool, optional): whether this override is enabled or not. Mainly used to disable existing overrides through datapacks. Defaults to `true`.
- `tooltip`(text, optional): the text to display in the item's tooltip when the conditions are fulfilled. If unspecified, no tooltip will be displayed. Specific overrides may tweak the way this tooltip is rendered.
- `mob`(entity predicate, optional): a predicate for the possessed entity "using" the item.
- `override` (object, required):
  - `type`: the type of the overriding behavior. As of Requiem 1.7.8, can be `requiem:diet`, `requiem:healing`, or `requiem:cure`. The other fields in this object depend on the chosen type and are described below.

##### `requiem:diet`

 Specifies one or more items that can exclusively be eaten by the targeted mobs. If multiple diet overrides target the same mob, they will be able to eat any item that is accepted by at least one of them.

Fields:

- `food` (item predicate, required): a predicate for food items that can be eaten by the given mob.
- `filter` (string, optional): a filter that will be applied when eating the food. As of 1.7.8, can be `"none"` or `"remove_harmful_effects"`.

##### `requiem:healing`

Specifies one or more items that can be consumed by the targeted mobs for restoring some health.

Fields:

- `item` (item predicate, required): a predicate for items that can be used.
- `use_time` (int, optional): the time taken to consume the item.
- `cooldown` (int, optional): the time to wait before the same item can be eaten again.
- `usage` (string, required): a consumption action. As of 1.7.8, can be `"eat_to_heal"` or `"replace_bone"`.

##### `requiem:cure`

Specifies one or more items that can be consumed by the targeted mobs to initiate the curing process.

Fields:

- `possessed_state` (entity predicate, required): a predicate for the state the entity must be in before the cure can begin. This predicate will be applied after the parent `mob` predicate, so checking eg. entity type here is redundant.
- `reagent` (item predicate, required): a predicate for the item being used to initiate the cure

#### Schema V0

Old format, should be avoided when possible.

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