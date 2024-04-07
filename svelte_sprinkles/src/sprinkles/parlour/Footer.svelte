<script lang="ts">
  import {createHtmlLogger} from "../../lib/htmlLogger";
  import DialogueResetButton from "./dialogueio/DialogueResetButton.svelte";
  import LogDisplay from "./dialogueio/LogDisplay.svelte";
  import DialogueDropZone from "./dialogueio/DialogueDropZone.svelte";
  import DialogueFileExport from "./dialogueio/DialogueFileExport.svelte";
  import DialogueFileInput from "./dialogueio/DialogueFileInput.svelte";

  export let mainView = true;

  function toggleView(): void {
    mainView = !mainView;
  }

  const htmlLogger = createHtmlLogger();
</script>
<div class="dialogue-footer">
  <div
    id="dialogue-import-export"
    aria-label="Dialogue import/export"
  >
    <DialogueResetButton/>
    <DialogueFileInput ioLogger={htmlLogger}/>
    <button id="dialogue-view-toggle" class="btn btn-success" on:click={toggleView}>
      {#if mainView}
        <svg class="btn-icon" inline-src="graph-outline" />
        Graph View
      {:else}
        <svg class="btn-icon" inline-src="octicon-browser-24"/>
        Main View
      {/if}
    </button>
    <DialogueFileExport ioLogger={htmlLogger}/>
    <DialogueDropZone on:load ioLogger={htmlLogger}/>
  </div>
  <LogDisplay logger={htmlLogger}/>
</div>

<style>
  .dialogue-footer {
    margin-top: auto;
    position: sticky;
    bottom: 0;
  }

  #dialogue-view-toggle {
    justify-content: space-around;
    width: 15em;
  }
</style>
