---
title: Chenille
slug: chenille
layout: wiki
extra_toc_links: extra/chenille_gradle_link.liquid
og:
    img: /img/colored-ladysnake-icon.png
    img_alt: Ladysnake Icon
    desc: "The Chenille plugin: Get it from the gradle plugin portal!"
---

A gradle plugin that takes care of configuring your minecraft mod project with sensible defaults for common use cases.

## Using Chenille

If you are a developer, you can use Chenille in your own project by inserting the following in your `build.gradle` :

```gradle
plugins {
	id 'io.github.ladysnake.chenille' version '0.1-SNAPSHOT'
}
```

For the latest version snippet, refer to the [Gradle Plugin Portal](https://plugins.gradle.org/plugin/io.github.ladysnake.chenille).

You can apply the plugins you care about before Chenille to have them configured :

```gradle
plugins {
	id 'io.github.ladysnake.chenille' version '0.1-SNAPSHOT' apply false
}

apply plugin: 'com.github.breadmoirai.github-release'
apply plugin: 'com.matthewprenger.cursegradle'
apply plugin: 'com.jfrog.artifactory'
apply plugin: 'org.cadixdev.licenser'
apply plugin: 'maven-publish'
apply plugin: 'io.github.ladysnake.chenille'
```

## Features

### Changelog
Chenille configures your automated github, curseforge, and modrinth releases to use
a changelog file from your project repository (defaulting to `/changelog.md`). The expected format is as follows :
```md
------------------------------------------------------
Version x.y.2
------------------------------------------------------
Changelog for version x y 2

------------------------------------------------------
Version x.y.1
------------------------------------------------------
Changelog for version x y 1

```

### Default Repositories
Chenille lets you quickly add some common repositories to your project
by calling the following methods in your `repositories` block :

- `cotton()`
- `cursemaven()`
- `jitpack()`
- `ladysnake()`
- `lucko()`
- `modrinth()`
- `terraformers()`

To get all these in one shot, you can also call `chenille.defaultRepositories()` in your `repositories` block.

### Dependency Configurations
Chenille adds dependency configurations for common use cases :
- `modIncludeImplementation` : short for `modImplementation include`
- `modIncludeApi` : short for `modApi include`
- `modOptionalImplementation` : short for `modCompileOnly modLocalRuntime`

### Test Mod setup

Mods and especially libraries can greatly benefit from having a test mod in the same project.
You can setup such a test mod with automated test cases by calling `chenille.configureTestmod()`.
This will configure a `testmod` sourceset, as well as the following run configs :
- Testmod Client : starts a minecraft client with your mod and your test mod
- Testmod Server : starts a minecraft server with your mod and your test mod
- Auto Test Server : starts a minecraft server with your mod and your test mod, which also runs your test cases
- Game Test : runs your automated testing and shuts down immediately afterward

Game tests will automatically be run as part of the `check` task, preventing you from building if you got an error.
Finally, you get a new `modTestImplementation` dependency configuration for this new source set :

```gradle
chenille {
    configureTestmod()
}

dependencies {
    modTestImplementation("io.github.ladysnake:elmendorf:${elmendorf_version}")
}
```
