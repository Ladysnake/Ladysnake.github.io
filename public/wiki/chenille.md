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
	id 'io.github.ladysnake.chenille' version '0.11.3'
}
```

For the latest version snippet, refer to the [Gradle Plugin Portal](https://plugins.gradle.org/plugin/io.github.ladysnake.chenille).

## Features

### Quilt Setup

Chenille applies the `quilt-loom` plugin to your project, unless `fabric-loom` was applied first.

### Publishing

Chenille can setup publishing to various platforms :

```gradle
version = ... // Must be set before chenille configuration

chenille {
    configurePublishing {
        mainArtifact = remapStandaloneJar.archiveFile
        withLadysnakeMaven()
        withCurseforgeRelease()
        withGithubRelease()
        withModrinthRelease()
    }
}
```

The `mainArtifact` option determines the main jar to upload.
If left unspecified, it will default to `remapJar.archiveFile`.

#### Modrinth

[Modrinth](https://modrinth.com) \[`withModrinthRelease`] publishing requires the `modrinth_api_key` user-level property and the following project-level properties:

| name                | required?  | description                                                                                                                           |
|---------------------|------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `modrinth_id`       | required   | the ID or slug of the project (the ID can be obtained in the modrinth interface by clicking the three dots in the upper right corner) |
| `modrinth_versions` | required\* | the semicolon-separated list of game versions supported by your mod                                                                   |
| `release_type`      | required   | `alpha`, `beta`, or `release`                                                                                                         |
| `mr_requirements`   | optional   | the semicolon-separated list of Modrinth projects required by your mod                                                                |
| `mr_optionals`      | optional   | the semicolon-separated list of Modrinth projects with which your mod has optional compatibility features                             |
| `mr_embeddeds`      | optional   | the semicolon-separated list of Modrinth projects that are embedded (Jar-in-Jar'ed) in your mod                                       |
| `mr_incompatibles`  | optional   | the semicolon-separated list of Modrinth projects that are incompatible with your mod                                                 |

\*If `modrinth_versions` if left unspecified, it will fall back to checking `curseforge_versions` and then `minecraft_version`.
However these properties may not actually match Modrinth's version scheme, so you are strongly encouraged to set `modrinth_versions` directly.

The loader setting will be set to `fabric` **and** `quilt` if `fabric-loom` is applied, otherwise it will be set to just `quilt`.

You can further customize the Modrinth publication by using the `modrinth` extension provided by the 
[minotaur plugin](https://github.com/modrinth/minotaur), which is automatically applied when you use `withModrinthRelease`:
```groovy
chenille {
  configurePublishing {
    mainArtifact = remapStandaloneJar.archiveFile
    withModrinthRelease()
  }
}

modrinth {
  // advanced configuration
}
```

#### Curseforge

[Curseforge](https://curseforge.com/) \[`withCurseforgeRelease`] publishing requires the `curseforge_api_key` user-level property and the following project-level properties:

| name                  | required? | description                                                                                                 |
|-----------------------|-----------|-------------------------------------------------------------------------------------------------------------|
| `curseforge_id`       | required  | the ID of the project on Curseforge                                                                         |
| `curseforge_versions` | required  | the semicolon-separated list of game versions supported by your mod                                         |
| `release_type`        | required  | `alpha`, `beta`, or `release`                                                                               |
| `cf_requirements`     | optional  | the semicolon-separated list of Curseforge projects required by your mod                                    |
| `cf_optionals`        | optional  | the semicolon-separated list of Curseforge projects with which your mod has optional compatibility features |
| `cf_embeddeds`        | optional  | the semicolon-separated list of Curseforge projects that are embedded (Jar-in-Jar'ed) in your mod           |
| `cf_incompatibles`    | optional  | the semicolon-separated list of Curseforge projects that are incompatible with your mod                     |

Just like for Modrinth, the loader setting will be set to `fabric` **and** `quilt` if `fabric-loom` is applied, otherwise it will be set to just `quilt`.

#### GitHub

[GitHub](https://github.com) \[`withGithubRelease`] publishing requires the `github_api_key` user-level property.
You can further customize the GitHub release by using the `githubRelease` extension provided by the
[github-release plugin](https://github.com/BreadMoirai/github-release-gradle-plugin/wiki), which is automatically applied when you use `withGithubRelease`.

#### Ladysnake Maven

[Ladysnake Maven](https://maven.ladysnake.org) \[`withLadysnakeMaven`] publishing requires the `ladysnake_maven_username` and `ladysnake_maven_password` user-level property.

#### Artifactory

[Artifactory](https://jfrog.com/artifactory/) \[`withArtifactory`] publishing requires the `artifactory_user` and `artifactory_api_key` user-level gradle properties.
This method is now deprecated as Jfrog ended their free tier for Open Source projects.

#### The `release` task

Setting up at least one publication method with Chenille will trigger the creation of a `release` task, which will :
- build and test the project
- verify that the local Git repository is in a state suitable for a release
  1. no uncommitted files
  2. on a branch that is named either `main` or after a semantic version (e.g. `1.20` or `1.19.4`)
  3. on a branch that is up-to-date with its remote
  4. no existing git tag for the current version (ineffective without GitHub releases)
- parse the changelog file (see below)
- trigger all the publishing

#### Changelog

Chenille configures your automated github, curseforge, and modrinth releases to use
a changelog file from your project repository (defaulting to `/changelog.md`).
The expected format is as follows :
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

The generated changelog for each version contains a link to the full changelog.
You can customize that link by setting `changelogUrl`.
By default, it guesses the link to the GitHub file as follows:
```groovy
"https://github.com/$owners/$displayName/blob/$modVersion/changelog.md"
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
- Auto Test Server : starts a minecraft server with your mod and your test mod, which shuts down after loading every mixin
- Game Test : runs your automated testing and shuts down immediately afterward

Game tests will automatically be run as part of the `check` task, preventing you from building if you got an error.
