<script lang="ts">
  import type {HtmlLogger} from "../../../lib/htmlLogger";
  import {loadDialogueFile} from "./dialogueIo";
  import {createEventDispatcher} from "svelte";
  import BlabberDialogue from "../model/BlabberDialogue";

  export let ioLogger: HtmlLogger;

  const dispatch = createEventDispatcher<{
    'load': BlabberDialogue,
  }>();

  function importDialogue(e: Event & { currentTarget: HTMLInputElement }) {
    const curFiles = e.currentTarget.files;
    if (curFiles && curFiles.length > 0) {
      loadDialogueFile(curFiles[0], ioLogger, dispatch);
    } else {
      ioLogger.logError('No files currently selected for upload');
    }
  }
</script>

<input id="dialogue-import" type="file" accept="application/json" on:change={importDialogue}/>
<label class="btn btn-info" for="dialogue-import">
  <svg class="btn-icon" inline-src="octicon-upload-24"/>
  Import JSON dialogue file
</label>

<style>
  input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  label {
    display: flex;
    align-items: center;
  }

  input:focus-visible + label {
    outline: auto;
  }
</style>
