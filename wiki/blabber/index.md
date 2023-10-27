---
layout: wiki
title: Blabber
slug: blabber
curse_project: 565396
modrinth: true
extra_toc_links: extra/blabber_editor_link.liquid
---

Are you a modpack maker who wants their players to talk to more than a quest book?
Are you a modded server owner who wants to sprinkle some ✨immersion✨ in their world?
Are you perhaps a modder who is looking for an easy-to-use dialogue library with expansive tooling?

Blabber is a mod and library for displaying interactive dialogues to your players.
Just write your dialogue description files, then start them on demand!

## How it looks

Like that:

![Example Dialogue Screen](example-dialogue-screen.png){:.rounded}

## How it works

### Commands

Blabber adds the `/blabber` command, allowing server operators and mapmakers to interact with the mod through commands.

- `/blabber dialogue`
    - `/blabber dialogue start <dialogue> [<targets]` : Starts a dialogue for one or more players.
        - `<dialogue>` : the unique identifier for the dialogue
        - `[<targets>]` (optional) : If specified, must be either a player's username or a target selector. If unspecified, defaults to the player using the command. When used in a command block, `[<targets>]` is not optional.

### Format

Blabber will automatically load all JSON files in the `data/[namespace]/blabber/dialogues` directory.
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

#### Conditional choices

So what if you want to add requirements for specific dialogue paths? You could always make a separate dialogue file
for each possible combination and trigger one based on prior conditions, but that becomes quite tedious when you have multiple
conditions in a single dialogue, and it also does not give players any indication of what choices they may have missed.

To help with that situation, Blabber gives you the ability to lock some dialogue choices behind [predicates](https://minecraft.wiki/w/Predicate).
Here is what a locked choice may look like:

![Example locked dialogue choice](./example-locked-choice.png){:.rounded}

When you make a choice conditional, you specify when the choice should be available, and how it should be displayed if not.
The condition is given as an identifier for a [predicate](https://minecraft.wiki/w/Predicate).

Mods can register their own `LootCondition`s to allow virtually any check in said predicates.
{:.admonition .admonition-note}

As for the display, you can either make it so the choice is *grayed out*, displaying a little lock icon and explanation message when hovered, or
set it to be *hidden*.

Note that you should avoid the hidden option with choices that can enable or disable themselves mid-dialogue, as it may cause some frustration due to player misclicks.
{:.admonition .admonition-warning}

Here is an example of conditional choices in JSON:

{% capture summary %}<h5 id="grayed-out-choice-json">Grayed out choice</h5>{% endcapture %}
{% capture example_json %}
```json
{
  "text": "I have money.",
  "illustration": "emerald",
  "next": "barter",
  "only_if": {
    "predicate": "babblings:holding_emerald",
    "when_unavailable": {
      "display": "gray_out",
      "message": "You must be holding an emerald to pick this option."
    }
  }
}
```
{% endcapture %}
{% include details.liquid summary=summary content=example_json %}
{% capture summary %}<h5 id="hidden-choice-json">Hidden choice</h5>{% endcapture %}
{% capture example_json %}
```json
{
  "text": "I have money.",
  "illustration": "emerald",
  "next": "barter",
  "only_if": {
    "predicate": "babblings:holding_emerald",
    "when_unavailable": {
      "display": "hidden"
    }
  }
}
```
{% endcapture %}
{% include details.liquid summary=summary content=example_json %}

### Online Dialogue Maker

If you are allergic to code, try this online tool: [blabber dialogue editor](dialogue_generator)

<iframe width="560" height="315" src="https://www.youtube.com/embed/Hm_bQlgqSCQ?si=A5SH8mRNEkGSi14i" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

### Validation

To help creators design dialogues, and prevent players from getting stuck in a *(possibly non-skippable)* dialogue with no ending,
both the online dialogue maker and the mod itself will perform several validation checks on dialogue files.

The validation process checks for the following issues and reports them by either logging a warning or failing with an error:

**Errors:**
- **States with no choices:** Every non-end state must have at least one choice leading out of it. If any state has no choices defined, an error will be thrown.
- **Softlock states:** Every state must have a path leading to an ending (no infinite loops). If any state is lacking a path to an end state, an error will be thrown.

**Warnings:**
- **Conditional softlock states:** Any state that only has *conditional* paths leading to an ending will be reported. Blabber cannot tell whether a condition will necessarily be fulfilled when getting to such a state, and thus cannot prove that the player *will not* be softlocked.
- **Unreachable states:** Any state that is disconnected from the main dialogue graph will be reported with a warning message. While they do not cause immediate issues for players, you may want to connect or remove such orphan states.

## Using Blabber (for developers)

If you are a developer, you can use Blabber as a library for your own project by inserting the following in your `build.gradle` :

You can then add the library version to your `gradle.properties`file:

{% capture groovy %}
`gradle.properties`:
```properties
# Blabber
blabber_version = <BLABBER_VERSION>
# Fabric Permissions API
fpa_version = 0.2-SNAPSHOT
# Cardinal Components
cca_version = <CCA_VERSION>
```

`build.gradle`:
```gradle
repositories {
    maven { 
        name = "Ladysnake Mods"
        url = "https://maven.ladysnake.org/releases"
        content {
            includeGroup 'io.github.ladysnake'
            includeGroup 'org.ladysnake'
            includeGroupByRegex 'dev\\.onyxstudios.*'
        }
    }
    maven {
        name = "Nexus Repository Manager"
        url = "https://oss.sonatype.org/content/repositories/snapshots"
    }
}

dependencies {
    modImplementation "org.ladysnake:blabber:${blabber_version}"
    include "org.ladysnake:blabber:${blabber_version}"
    // Blabber dependencies
    include "me.lucko:fabric-permissions-api:${fpa_version}"
    include "dev.onyxstudios.cardinal-components-api:cardinal-components-base:${cca_version}"
    include "dev.onyxstudios.cardinal-components-api:cardinal-components-entity:${cca_version}"
}
```
{% endcapture %}
{% capture kts %}
`gradle.properties`:
```properties
# Blabber
blabber_version = <BLABBER_VERSION>
# Fabric Permissions API
fpa_version = 0.2-SNAPSHOT
# Cardinal Components
cca_version = <CCA_VERSION>
```

`build.gradle.kts`:
```kotlin
repositories {
    maven {
        name = "Ladysnake Mods"
        url = "https://maven.ladysnake.org/releases"
        content {
            includeGroup("io.github.ladysnake")
            includeGroup("org.ladysnake")
            includeGroupByRegex("""dev\.onyxstudios.*""")
        }
    }
    maven {
        name = "Nexus Repository Manager"
        url = "https://oss.sonatype.org/content/repositories/snapshots"
    }
}

dependencies {
    val blabberVersion = property("blabber_version") as String
    val ccaVersion = property("cca_version") as String
    val fpaVersion = property("fpa_version") as String
    modImplementation("org.ladysnake:blabber:${blabber_version}")
    include("org.ladysnake:blabber:${blabber_version}")
    // Blabber dependencies
    include("me.lucko:fabric-permissions-api:${fpa_version}")
    include("dev.onyxstudios.cardinal-components-api:cardinal-components-base:${cca_version}")
    include("dev.onyxstudios.cardinal-components-api:cardinal-components-entity:${cca_version}")
}
```
{% endcapture %}
{% capture catalogue %}
`libs.versions.toml`:
```toml
[versions]
blabber = '<BLABBER_VERSION>'
cardinalComponentsApi = '<CCA_VERSION>'
fabricPermissionsApi = '0.2-SNAPSHOT'

[libraries]
cca-base = { module = "dev.onyxstudios.cardinal-components-api:cardinal-components-base", version.ref = "cardinalComponentsApi" }
cca-entity = { module = "dev.onyxstudios.cardinal-components-api:cardinal-components-entity", version.ref = "cardinalComponentsApi" }
fpa = { module = "me.lucko:fabric-permissions-api", version.ref = "fabricPermissionsApi" }
blabber = { module = "org.ladysnake:blabber", version.ref = "blabber" }

[bundles]
blabber = [ "cca-base", "cca-entity", "fpa", "blabber" ]
```

`build.gradle` or `build.gradle.kts`:
```kotlin
repositories {
    maven {
        name = "Ladysnake Mods"
        url = "https://maven.ladysnake.org/releases"
        content {
            includeGroup("io.github.ladysnake")
            includeGroup("org.ladysnake")
            includeGroupByRegex("""dev.onyxstudios.*""")
        }
    }
    maven {
        name = "Nexus Repository Manager"
        url = "https://oss.sonatype.org/content/repositories/snapshots"
    }
}

dependencies {
    // Replace modImplementation with modApi if you expose Blabber's interfaces in your own API
    modImplementation(libs.bundles.blabber)
    // Includes Blabber and its dependencies as a Jar-in-Jar dependency (optional but recommended)
    include(libs.bundles.blabber)
}
```
{% endcapture %}
{%- include tabbed_builscript.liquid groovy=groovy kts=kts catalogue=catalogue %}


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
