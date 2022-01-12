---
layout: wiki
title: Blabber
slug: blabber
curse_project: 565396
---

Are you a modpack maker who wants their players to talk to more than a quest book?
Are you a modded server owner who wants to sprinkle some ✨immersion✨ in their world?
Are you perhaps a modder who is looking for an easy-to-use dialogue library with expansive tooling?

Blabber is a mod and library for displaying interactive dialogues to your players.
Just write your dialogue description files, then start them on demand!

## How it looks

Like that:

(image pending)

## How it works

### Commands

Blabber adds the `/blabber` command, allowing server operators and mapmakers to interact with the mod through commands.

- `/blabber dialogue`
    - `/blabber dialogue start <dialogue> [<targets]` : Starts a dialogue for one or more players.
        - `<dialogue>` : the unique identifier for the dialogue
        - `[<targets>]` (optional) : If specified, must be either a player's username or a target selector. If unspecified, defaults to the player using the command. When used in a command block, `[<targets>]` is not optional.

### Format

Blabber will automatically load all JSON files in the `data/[namespace]/blabber_dialogues` directory.
Those can be provided either by mods, or by datapacks.

Each file describes the various states a dialogue can be in.

Here's a super basic example:

<p>
{% include_relative basic-dialogue.svg %}
</p>

This dialogue has 5 states: `start`, `accept`, `end_success`, `refuse`, and `end_failure`.
When a player gets this dialogue, they will first be shown "Do you want potatoes?" with the options "Yes please!" and "No thanks.".

- If they click "Yes please!", they will switch to the `accept` state and be shown the text "Alright, have potatoes" with the only choice "ok".
When they click on that choice, they will switch to the `end_success` state, which ends the dialogue.

- If they click "No thanks.", they will switch to the `refuse` state and be shown the text "Are you sure?" with the choices "yes" and "I changed my mind." being available.
    - If they click on "yes", they will switch to the `end_failure` state, which also ends the dialogue. 
    - However, if they click on "I changed my mind", they will switch to the `accept` state, and be shown the same text and only choice.

Of course, this would be quite useless if we didn't give the player their potatoes.
We can fix this by adding an action to the `end_success` state; a command action with the value `/give @s potato 12` should do nicely.

Here's the JSON file corresponding to what we just described:

{% capture summary %}<h4 id="basic-dialogue-json">basic-dialogue.json</h4>{% endcapture %}
{% capture example_json %}
```json
{% include_relative basic-dialogue.json %}
```
{% endcapture %}
{% include details.liquid summary=summary content=example_json %}

### Online Dialogue Maker

If you are allergic to code, try this online tool: [blabber dialogue editor](dialogue_generator.html)

## Using Blabber (for developers)

If you are a developer, you can use Blabber as a library for your own project by inserting the following in your `build.gradle` :

```gradle
repositories {
	maven { 
        name = "Ladysnake Mods"
        url = "https://ladysnake.jfrog.io/artifactory/mods"
        content {
            includeGroup 'io.github.ladysnake'
            includeGroupByRegex 'io\\.github\\.onyxstudios.*'
        }
    }
    maven {
        name = "Nexus Repository Manager"
        url = 'https://oss.sonatype.org/content/repositories/snapshots'
    }
}

dependencies {
    modImplementation "io.github.ladysnake:blabber:${blabber_version}"
    include "io.github.ladysnake:blabber:${blabber_version}"
    // Blabber dependencies
    include "me.lucko:fabric-permissions-api:${fpa_version}"
    include "com.github.onyxstudios.Cardinal-Components-API:cardinal-components-base:${cca_version}"
    include "com.github.onyxstudios.Cardinal-Components-API:cardinal-components-entity:${cca_version}"
}
```

You can then add the library version to your `gradle.properties`file:

```properties
# Blabber
blabber_version = 0.x.y
# Fabric Permissions API
fpa_version = 0.1-SNAPSHOT
# Cardinal Components
cca_version = 2.x.y
```

You can find the current version of Blabber in the [releases](https://github.com/Ladysnake/Blabber/releases) tab of the repository on Github,
and the latest CCA version in the [appropriate repository](https://github.com/OnyxStudios/Cardinal-Components-API/releases).

### API

Everything is currently done with 2 methods:
- `Blabber#startDialogue(ServerPlayerEntity, Identifier)`: starts the dialogue with the given id for the given player
- `Blabber#registerAction`: registers an action for use in dialogues, 2 overloads available:
  - `registerAction(Identifier, DialogueAction)`: registers a simple action that takes no additional configuration from the dialogue description file.
  - `registerAction(Identifier, Codec<? extends DialogueAction)`: registers an action type. The codec is used to create new dialogue actions based on the action `value` specified in the dialogue description file.

### JSON Schema

The schema for Blabber dialogue files is available here: [dialogue.schema.json](dialogue.schema.json)
