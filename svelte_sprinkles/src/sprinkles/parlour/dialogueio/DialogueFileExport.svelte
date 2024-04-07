<script lang="ts">
  import {dialogueData, dialogueFilename} from "../dialogueDataStore.js";
  import {exportDialogue} from "./dialogueIo.js";
  import type {HtmlLogger} from "../../../lib/htmlLogger";

  export let ioLogger: HtmlLogger;
</script>
<button class="btn btn-warning" id="dialogue-export" disabled={Object.keys($dialogueData.states).length === 0} on:click={() => exportDialogue($dialogueData, $dialogueFilename, ioLogger)}>
  <svg class="btn-icon" inline-src="octicon-download-24"/>
  Export JSON dialogue file
</button>
<style>
</style>
