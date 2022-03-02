---
title: Chenille
slug: chenille
layout: wiki
extra_toc_links: extra/chenille_gradle_link.liquid
og:
    img: /img/colored-ladysnake-icon-3.png
    img_alt: Ladysnake Icon
    desc: "The Chenille plugin: Get it from the gradle plugin portal!"
---

A gradle plugin that takes care of configuring your minecraft mod project with sensible defaults for common use cases.

## Using Chenille

If you are a developer, you can use Chenille in your own project by inserting the following in your `build.gradle` :

```gradle
plugins {
	id 'io.github.ladysnake.chenille' version '0.6.0'
}
```

For the latest version snippet, refer to the [Gradle Plugin Portal](https://plugins.gradle.org/plugin/io.github.ladysnake.chenille).

## Features

### Publishing

Chenille can setup publishing to various platforms :

```gradle
chenille {
    configurePublishing {
        withArtifactory()
        withCurseforgeRelease()
        withGithubRelease()
        withModrinthRelease()
    }
}
```

- [Artifactory](https://jfrog.com/artifactory/) publishing requires the `artifactory_user` and `artifactory_api_key` user-level gradle properties
- [Curseforge](https://curseforge.com/) publishing requires the `curseforge_api_key` user-level property and the `curseforge_id` project-level property
- [Github](https://github.com) publishing requires the `github_api_key` user-level property
- [Modrinth](https://modrinth.com) publishing requires the `modrinth_api_key` user-level property and the `modrinth_id` project-level property

#### Changelog

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
by calling the following methods in a `chenille.repositories` block :

- `cotton()`
- `cursemaven()`
- `jamieswhiteshirt()`
- `jitpack()`
- `ladysnake()`
- `lucko()`
- `modrinth()`
- `shedaniel()`
- `terraformers()`

To get all these in one shot, you can also call `chenille.repositories.allCommonRepositories()`.

### Dependency Configurations
Chenille adds dependency configurations for common use cases :
- `modIncludeImplementation` : short for `modImplementation include`
- `modIncludeApi` : short for `modApi include`
- `modLocalImplementation` : short for `modCompileOnly modLocalRuntime`

### Test Mod setup

Mods and especially libraries can greatly benefit from having a test mod in the same project.
You can setup such a test mod with automated test cases by calling `chenille.configureTestmod()`.
This will configure a `testmod` sourceset, as well as the following run configs :
- Testmod Client : starts a minecraft client with your mod and your test mod
- Testmod Server : starts a minecraft server with your mod and your test mod
- Auto Test Server : starts a minecraft server with your mod and your test mod, which also runs your test cases
- Game Test : runs your automated testing and shuts down immediately afterward

Game tests will automatically be run as part of the `check` task, preventing you from building if you got an error.
Finally, you can also get a new `modTestImplementation` dependency configuration for this new source set :

```gradle
chenille {
    configureTestmod {
        withDependencyConfiguration()
    }
}

dependencies {
    modTestImplementation("io.github.ladysnake:elmendorf:${elmendorf_version}")
}
```
