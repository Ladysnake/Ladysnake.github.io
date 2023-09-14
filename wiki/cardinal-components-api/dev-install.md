---
title: Installation (for developers)
breadcrumb: Dev Installation
layout: cca_wiki
---

There are several ways of getting Cardinal Components into your workspace, most involving just a few lines in your Gradle buildscript (`build.gradle` file). To minimize user inconvenience, it is also recommended to use the [Jar-in-Jar](https://fabricmc.net/wiki/tutorial:loader04x#nested_jars) mechanism provided by the Fabric toolchain to include Cardinal Components in your own builds, eliminating the need for manual install.

Unless specified otherwise, the following block must be added to your `build.gradle` **after** the relevant `repositories` block:

{% capture groovy %}
`gradle.properties`:
```properties
cca_version = <VERSION>
```

`build.gradle`:
```gradle
dependencies {
    // Replace modImplementation with modApi if you expose components in your own API
    modImplementation "dev.onyxstudios.cardinal-components-api:<MODULE>:${project.cca_version}"
    // Includes Cardinal Components API as a Jar-in-Jar dependency (optional but recommended)
    include "dev.onyxstudios.cardinal-components-api:<MODULE>:${project.cca_version}"
}
```
{% endcapture %}
{% capture kts %}
`gradle.properties`:
```properties
cca_version = <VERSION>
```

`build.gradle`:
```kotlin
dependencies {
    val ccaVersion = property("cca_version") as String
    // Replace modImplementation with modApi if you expose components in your own API
    modImplementation("dev.onyxstudios.cardinal-components-api:<MODULE>:$ccaVersion")
    // Includes Cardinal Components API as a Jar-in-Jar dependency (optional but recommended)
    include("dev.onyxstudios.cardinal-components-api:<MODULE>:$ccaVersion")
}
```
{% endcapture %}
{% capture catalogue %}
`libs.versions.toml`:
```toml
[versions]
cca = '<VERSION>'

[libraries]
cca-base = { module = "dev.onyxstudios.cardinal-components-api:cardinal-components-base", version.ref = "cca" }
cca-<MODULE> = { module = "dev.onyxstudios.cardinal-components-api:<MODULE>", version.ref = "cca" }

[bundles]
cca = [ "cca-base", "cca-<MODULE>" ]
```

`build.gradle` or `build.gradle.kts`:
```kotlin
dependencies {
    // Replace modImplementation with modApi if you expose components in your own API
    modImplementation(libs.bundles.cca)
    // Includes Cardinal Components API as a Jar-in-Jar dependency (optional but recommended)
    include(libs.bundles.cca)
}
```
{% endcapture %}
{%- capture groovy_title %}
{% include svg/groovy-logo.svg %} build.gradle
{%- endcapture %}
{% capture kts_title %}
{% include svg/kotlin-logo.svg %} build.gradle.kts
{% endcapture %}
{% capture catalogue_title %}
{% include svg/gradle-logo.svg %} Version Catalogues
{% endcapture %}
{%- assign tab_names = "" | split: "," | push: groovy_title | push: kts_title | push: catalogue_title %}
{%- assign tabs = "" | split: "," | push: groovy | push: kts | push: catalogue %}

{%- include tabbed.liquid tab_names=tab_names tabs=tabs %}


## Ladysnake Reposilite

The current recommended way of getting the latest releases of Cardinal Components API is to use the Ladysnake maven repository :

```gradle
repositories {
    maven {
        name = "Ladysnake Mods"
        url = 'https://maven.ladysnake.org/releases'
    }
}
```

This maven repository contains binaries for every version since 3.0.0-21w06a.

## Jitpack

[Jitpack](https://jitpack.io#OnyxStudios/Cardinal-Components-API) is a simple alternative to dedicated mavens, building GitHub repositories on demand. It can be used to get any version of Cardinal Components, including snapshots of development branches. Note however that it tends to slow down your builds, and that it often times out the first time it builds an artefact (just restart the build when that happens). Further use information can be found on the website itself.

```gradle
repositories {
    maven {
        name = "Jitpack"
        url = "https://jitpack.io"
    }
}
```

## Ladysnake artifactory

```gradle
repositories {
    maven {
        name = "Ladysnake Mods"
        url = 'https://ladysnake.jfrog.io/artifactory/mods'
    }
}
```

This maven repository contained binaries for every version between 3.0.0-21w06a and 5.2.1. Due to JFrog Artifactory's free tier shutting down, it is now unavailable.

## Ladysnake bintray

```gradle
repositories {
    maven {
        name = "Ladysnake Libs"
        url = 'https://dl.bintray.com/ladysnake/libs'
    }
}
```

This maven repository contained binaries for every version between 2.3.5 (MC 1.15) and 2.7.11 (MC 1.16). Due to bintray shutting down, it is now unavailable.

## OnyxStudios Maven

The official maven, that contains versions up to 2.3.0:

```gradle
repositories {
    maven {
        name = "OnyxStudios"
        url = "https://maven.abusedmaster.xyz"
    }
}
```

## Curseforge

CurseForge is mostly a platform for distributing mods to users. Although not recommended, it can be used as a maven repository by following [the instructions on the website](https://authors.curseforge.com/knowledge-base/projects/529-api). A slightly better way to do it is using the [CurseMaven Gradle plugin](https://github.com/Wyn-Price/CurseMaven).

You are however encouraged to declare [Cardinal Components API](https://www.curseforge.com/minecraft/mc-mods/cardinal-components-api) as an *embedded library* of your project, for documentation purposes and to make it simpler for users to report issues to the right repository.

## Modrinth

Modrinth is also a platform for distributing mods to users, which can also be used as a maven repository by following [the instructions on their website](https://docs.modrinth.com/docs/tutorials/maven/).

Same as with Curseforge, you are encouraged to declare [Cardinal Components API](https://modrinth.com/mod/cardinal-components-api/) as an "Embedded" dependency.