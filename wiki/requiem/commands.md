---
title: Requiem Commands
breadcrumb: Commands
layout: requiem_wiki
---

Requiem adds a few admin commands to make testing the mod or helping clueless players easier.
All Requiem commands start with `/requiem`. Most of them take an optional player argument. If that argument is not given, the target of the command will be the command executor.

- `/requiem remnant`
    - `/requiem remnant set <true|false> [player]`: sets the remnant status of a player (Remnants are also called demons in the lore, they turn into ghosts when they die).
      This command by itself does not prevent the choice menu from appearing on next death.
    - `/requiem remnant query [player]`: queries the remnant status of a player.
- `/requiem vagrant` <span class="badge badge-secondary">&gt; 2.0.0</span>
    - `/requiem vagrant set <true|false> [player]`: sets the vagrant status of a remnant player. If `true`, the player will become an ethereal ghost.
    - `/requiem vagrant query [player]`: queries the vagrant status of a player.
- `/requiem possession`
    - `/requiem possession start <mob> [player]`: makes the player start possessing a mob, if they are already a soul.
    - `/requiem possession stop [player]`: stops an ongoing possession on the specified player.
- `/requiem shell` <span class="badge badge-secondary">&gt; 2.0.0</span>
    - `/requiem shell create [player]`: creates a shell copying the targeted player's data at the command's location. If no player is specified, will copy the player who run the command.
    - `/requiem shell split [players]`: artificially splits one or more players as if they used the *dissociate* keybind.
    - `/requiem shell identity set <profile> <shells>`: sets the identity (name and skin) of one or more shells to the given profile.
    - `/requiem shell merge <shell> [player]`: artificially merges a vagrant player with a shell as if they tried to possess it. If no player is specified, will merge the shell with the player who run the command.
- `/requiem soul` <span class="badge badge-secondary">&gt; 2.0.0</span>
    - `/requiem soul remove <entities>`: removes the soul of one or more entities as if a soul vessel was used on it.
    - `/requiem soul restore <entities>`: restores the soul of one or more entities as if it got released from a soul vessel.
- `/requiem soul` <span class="badge badge-danger">&lt; 2.0.0</span>
    - `/requiem soul set <true|false> [player]`: sets the soul status of a remnant player.
    - `/requiem soul query [player]`: queries the soul status of a player

### Other useful commands
In order to summon a soulless entity via commands, attach the `{cardinal_components:{"requiem:soul_holder":{"removed_soul": 1b}}}` tag to the mob within the command structure.

_Example:_
```bash
# Summons a soulless blaze
summon minecraft:blaze ~ ~ ~ {cardinal_components:{"requiem:soul_holder":{"removed_soul": 1b}}}
```

### Remnant choice screen
The remnant choice screen is based on [Blabber](../blabber) and can as such be interacted with through the mod's commands.
It normally appears when a player dies without the `requiem:adventure/the_choice` advancement and with the 
[`requiem:startingRemnantType`](configuration#requiem-startingremnanttype) gamerule set to `DEFAULT`.

### Predicates

Requiem adds 3 new [predicates](https://minecraft.fandom.com/wiki/Predicate). More advanced predicates can also be created
in datapacks using the new [loot conditions](./configuration#loot-table-conditions).

{% capture predicate_src %}{{site.data.requiem.links.data_src}}/predicates{% endcapture %}

- [`requiem:live_shell`]({{predicate_src}}/live_shell.json): checks if an entity is a vagrant player with a live player shell bound to it.
- [`requiem:possessing`]({{predicate_src}}/possessing.json): checks if an entity is a vagrant player currently possessing a mob.
- [`requiem:possessed`]({{predicate_src}}/possessed.json): checks if an entity is a mob possessed by a vagrant player.

_Example:_
```bash
# Makes every vagrant player with a live shell say "Hello, World!"
execute as @e[predicate="requiem:live_shell"] run say Hello, World!
```

### Target Selector Arguments
Requiem also adds a new [Target Selector Argument](https://minecraft.gamepedia.com/Commands#Target_selector_arguments) - `"requiem:possessor"`.
Any command that can target entities can use this argument to select entities based on their possessor.
The argument uses the name of the possessor, or empty string to match entities that are not possessed.
It can be negated by prepending the `'!'` character.

_Example:_
```bash
# Makes every possessed entity say "Hello, World!"
execute as @e["requiem:possessor"=!] run say Hello, World!
```
