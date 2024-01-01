---
layout: default
title: Common Dependencies
---

This page is here to help us quickly find dependency versions we often use in our mods.
The version strings may be invalid maven identifiers, as they are currently pulled from Modrinth.
{:.admonition .admonition-warning}

{% capture groovy %}
`gradle.properties`:
```properties
# Blabber
blabber_version = <BLABBER_VERSION>
# Cardinal Components
cca_version = <CCA_VERSION>
# EMI
emi = "<EMI_VERSION>"
# Mod Menu
modmenu = "<MODMENU_VERSION>"
# Roughly Enough Items
rei = "<REI_VERSION>"
```
{% endcapture %}
{% capture kts %}
`gradle.properties`:
```properties
# Blabber
blabber_version = <BLABBER_VERSION>
# Cardinal Components
cca_version = <CCA_VERSION>
# EMI
emi = "<EMI_VERSION>"
# Mod Menu
modmenu = "<MODMENU_VERSION>"
# Roughly Enough Items
rei = "<REI_VERSION>"
```
{% endcapture %}
{% capture catalogue %}
`libs.versions.toml`:
```toml
[versions]
# Blabber
blabber = "<BLABBER_VERSION>"
# Cardinal Components API
cca = "<CCA_VERSION>"
# EMI
emi = "<EMI_VERSION>"
# Mod Menu
modmenu = "<MODMENU_VERSION>"
# Roughly Enough Items
rei = "<REI_VERSION>"

[libraries]
blabber = { module = "org.ladysnake:blabber", version.ref = "blabber" }
cca-base = { module = "dev.onyxstudios.cardinal-components-api:cardinal-components-base", version.ref = "cardinalComponentsApi" }
cca-entity = { module = "dev.onyxstudios.cardinal-components-api:cardinal-components-entity", version.ref = "cardinalComponentsApi" }
emi = { module = "dev.emi:emi-fabric", version.ref = "emi" }
modmenu = { module = "com.terraformersmc:modmenu", version.ref = "modmenu"}
rei-api = { module = "me.shedaniel:RoughlyEnoughItems-api-fabric", version.ref = "rei" }
```
{% endcapture %}
{%- assign blabber = "blabber:2oRMVFgd" | split: ":" %}
{%- assign mods = "" | split: "," | push: blabber %}
{%- assign cca = "cca:K01OU20C" | split: ":" %}
{%- assign mods = mods | push: cca %}
{%- assign emi = "emi:fRiHVvU7" | split: ":" %}
{%- assign mods = mods | push: emi %}
{%- assign modmenu = "modmenu:mOgUt4GM" | split: ":" %}
{%- assign mods = mods | push: modmenu %}
{%- assign rei = "rei:nfn13YXA" | split: ":" %}
{%- assign mods = mods | push: rei %}
{%- include tabbed_builscript.liquid mods=mods groovy=groovy kts=kts catalogue=catalogue %}
