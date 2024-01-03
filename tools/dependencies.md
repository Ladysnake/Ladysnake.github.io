---
layout: default
title: Common Dependencies
---

This page is here to help us quickly find dependency versions we often use in our mods.
The version strings may be invalid maven identifiers, as they are currently pulled from Modrinth.
{:.admonition .admonition-warning}

- [Fabric dependency helper](https://fabricmc.net/develop/)
- [Quilt dependency helper](https://lambdaurora.dev/tools/import_quilt.html)

{% capture kts %}
`gradle.properties`:
```properties
# Blabber (dialogues)
blabber_version = <BLABBER_VERSION>
# Cardinal Components API
cca_version = <CCA_VERSION>
# Cloth Config API (config screen)
cloth_config_version = <CLOTH_VERSION>
# EMI
emi_version = <EMI_VERSION>
# Iris (shaders mod)
iris_version = <IRIS_VERSION>
# Midnight Lib (config)
midnight_version = <MIDNIGHT_VERSION>
# Mod Menu
modmenu_version = <MODMENU_VERSION>
# Roughly Enough Items
rei_version = <REI_VERSION>
# Satin (shaders)
satin_version = <SATIN_VERSION>
# Sodium (rendering optimizations)
sodium_version = <SODIUM_VERSION>
```
{% endcapture %}
{% capture catalogue %}
`libs.versions.toml`:
```toml
[versions]
# Blabber (dialogues)
blabber = "<BLABBER_VERSION>"
# Cardinal Components API
cca = "<CCA_VERSION>"
# Cloth Config API (config screen)
clothConfig = "<CLOTH_VERSION>"
# EMI
emi = "<EMI_VERSION>"
# Iris (shaders mod)
iris = "<IRIS_VERSION>"
# Midnight Lib (config)
midnightLib = "<MIDNIGHT_VERSION>"
# Mod Menu
modmenu = "<MODMENU_VERSION>"
# Roughly Enough Items
rei = "<REI_VERSION>"
# Satin (shaders library)
satin = "<SATIN_VERSION>"
# Sodium (rendering optimizations)
sodium = "<SODIUM_VERSION>"

[libraries]
blabber = { module = "org.ladysnake:blabber", version.ref = "blabber" }
cca-base = { module = "dev.onyxstudios.cardinal-components-api:cardinal-components-base", version.ref = "cca" }
cca-entity = { module = "dev.onyxstudios.cardinal-components-api:cardinal-components-entity", version.ref = "cca" }
clothConfig = { module = "me.shedaniel.cloth:cloth-config-fabric", version.ref = "clothConfig"}
emi = { module = "dev.emi:emi-fabric", version.ref = "emi" }
iris = { module = "maven.modrinth:iris", version.ref = "iris" }
midnightLib = { module = "maven.modrinth:midnightlib", version.ref = "midnightLib" }
modmenu = { module = "com.terraformersmc:modmenu", version.ref = "modmenu"}
rei-api = { module = "me.shedaniel:RoughlyEnoughItems-api-fabric", version.ref = "rei" }
satin = { module = "org.ladysnake:satin", version.ref = "satin" }
sodium = { module = "maven.modrinth:sodium", version.ref = "sodium" }
```
{% endcapture %}
{%- assign blabber = "blabber:2oRMVFgd" | split: ":" %}
{%- assign mods = "" | split: "," | push: blabber %}
{%- assign cca = "cca:K01OU20C" | split: ":" %}
{%- assign mods = mods | push: cca %}
{%- assign cloth = "cloth:9s6osm5g" | split: ":" %}
{%- assign mods = mods | push: cloth %}
{%- assign emi = "emi:fRiHVvU7" | split: ":" %}
{%- assign mods = mods | push: emi %}
{%- assign iris = "iris:YL57xq9U" | split: ":" %}
{%- assign mods = mods | push: iris %}
{%- assign midnight = "midnight:codAaoxh" | split: ":" %}
{%- assign mods = mods | push: midnight %}
{%- assign modmenu = "modmenu:mOgUt4GM" | split: ":" %}
{%- assign mods = mods | push: modmenu %}
{%- assign rei = "rei:nfn13YXA" | split: ":" %}
{%- assign mods = mods | push: rei %}
{%- assign satin = "satin:fRbqPLg4" | split: ":" %}
{%- assign mods = mods | push: satin %}
{%- assign sodium = "sodium:AANobbMI" | split: ":" %}
{%- assign mods = mods | push: sodium %}
{%- include tabbed_builscript.liquid mods=mods groovy=kts kts=kts catalogue=catalogue %}
