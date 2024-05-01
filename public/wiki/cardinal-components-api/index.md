---
title: Cardinal Components API
slug: cardinal-components-api
custom_title: true
layout: cca_wiki
curse_project: 318449
modrinth: true
---

<h1>{% include svg/cca-banner.svg %}</h1>

A components API for Quilt and Fabric that is easy, modular, and extremely fast.

If you are a regular minecraft player, you may need this API to play with your favorite mods.
Just download the version that works for you - Cardinal Components API does not have any user-facing feature by itself.

If you are a developer, **detailed information is available in the [developer wiki](landing)** *(check the sidebar)*.
The information below is a condensed form of the latter. You can also find a short description and associated examples
in the repository's [README](https://github.com/Ladysnake/Cardinal-Components-API#readme).

## An example

*Let's say you want to make to add mana to your mod. You would most likely want to have a number stored on the player,
which gets saved alongside it. You may want to display a mana bar on the client, which will require synchronization.
You may want your mana to refill slowly over time, which will require ticking.
And then you may want to have something like mana batteries in the world,
which would require re-implementing all that on a custom block or entity.*

**Cardinal Components API takes care of it all.**

## Features\*
- 🔗 Attach data to a variety of vanilla classes
- 🧩 Implement once, plug anywhere - modded data will be saved automatically
- 📤 Synchronize data with a single helper interface
- 👥 Choose how components are copied when a player respawns
- ⏲️ Tick components alongside their target
- 🛠️ Fine-tune everything so that it fits your needs
- ☄️ And enjoy the blazing speed of ASM-generated extensions

*\*Non exhaustive, refer to the wiki and javadoc for the full list.*

## Adding the API to your buildscript

Check out [the dev install page](dev-install) for up-to-date instructions.

## Basic Usage

```java
public interface IntComponent extends Component {
    int getValue();
}

class RandomIntComponent implements IntComponent {
    private int value = (int) (Math.random() * 20);
    @Override public int getValue() { return this.value; }
    @Override public void readFromNbt(CompoundTag tag) { this.value = tag.getInt("value"); }
    @Override public void writeToNbt(CompoundTag tag) { tag.putInt("value", this.value); }
}
```

See [Implementing Component](implementing-component) for information about implementing your own component.
Then, take a look at [Registering and using a component](registration) for your next steps.