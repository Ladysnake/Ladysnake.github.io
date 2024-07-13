<script lang="ts">
  import LadysnakeButton from "./LadysnakeButton.svelte";
  import BlabberButton from "./BlabberButton.svelte";
  import DarkModeToggle from "./DarkModeToggle.svelte";
  import siteUrl from "../../../lib/siteUrl";
  import {dialogueFilename as globalDialogueFilename} from "../dialogueDataStore";
  import DialogueFilenameInput from "./DialogueFilenameInput.svelte";
  import type {Writable} from "svelte/store";
  import DialogueGlobalProperties from "./DialogueGlobalProperties.svelte";

  export let dialogueFilename: Writable<string | undefined> = globalDialogueFilename;
  let globalPropertiesDialog: HTMLElement;
</script>

<header>
  <div class="global">
    <LadysnakeButton href={siteUrl('/')}/>
    <BlabberButton href={siteUrl('/wiki/blabber')}/>
    <DarkModeToggle/>
  </div>
  {#if $dialogueFilename}
    <span class="vertical-separator"/>
    <div class="dialogue-filename">
      Editing:&nbsp;<DialogueFilenameInput bind:value={$dialogueFilename}/><span>.json</span>
    </div>
    <button popovertarget="dialogue-global-properties" class="configuration"><svg inline-src="configuration-icon"/></button>
    <article id="dialogue-global-properties" bind:this={globalPropertiesDialog} popover="auto"><DialogueGlobalProperties on:click={() => globalPropertiesDialog.hidePopover()}/></article>
  {/if}
  <div class="admonition admonition-warning">
    <strong class="admonition-heading">🚧 This page is still under construction!</strong>
    <span>Illustrations (added in Blabber 1.5) are not yet available in this editor.</span>
  </div>
  </header>

<style>
  header {
    height: 3em;
    --button-size: 3em;
    display: flex;
    background-color: var(--base-background-color);
    align-items: center;
  }
  .admonition {
    align-self: end;
    flex: auto;
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: auto;
    gap: 0.2em;
  }

  .global {
    display: flex;
    padding-right: 1em;
  }
  .vertical-separator {
    height: 80%;
  }
  .dialogue-filename {
    padding-left: 1em;
    padding-right: 0.5em;
    display: flex;
    align-items: center;
  }
  .configuration {
    background-color: transparent;
    border: none;
    width: var(--button-size);
    cursor: pointer;
    margin-right: 1em;
    height: 100%;
    & > svg {
      vertical-align: middle;
      height: 65%;
      fill: var(--base-text-color);
    }
  }
</style>
