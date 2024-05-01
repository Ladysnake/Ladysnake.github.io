<script lang="ts">
  import NewDialogueForm from './NewDialogueForm.svelte';
  import {createHtmlLogger} from "../../../lib/htmlLogger";
  import DialogueFileInput from "../dialogueio/DialogueFileInput.svelte";
  import DialogueDropZone from "../dialogueio/DialogueDropZone.svelte";
  import LogDisplay from "../dialogueio/LogDisplay.svelte";

  const ioLogger = createHtmlLogger();
</script>

<div id="dialogue-editor" class="dialogue-landing">
  <NewDialogueForm/>
  <span class="vertical-separator"></span>
  <div class="import-pane">
    <div
      id="dialogue-import-export"
      aria-label="Dialogue import/export"
    >
      <DialogueFileInput ioLogger={ioLogger}/>
      <i>Or drop a dialogue file in this area to import</i>
      <DialogueDropZone ioLogger={ioLogger}/>
    </div>
    <LogDisplay logger={ioLogger}/>
  </div>
</div>

<style>
  .dialogue-landing {
    display: flex;
  }

  .import-pane {
    display: flex;
    flex: auto;
    flex-direction: column;
    justify-content: center;
  }

  #dialogue-import-export {
    outline: none;
    border: none;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
