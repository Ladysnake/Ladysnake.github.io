<div id="dialogue-editor" class="dialogue-landing">
  <NewDialogueForm/>
  <span class="vertical-separator"></span>
  <div class="import-pane">
    <DialogueImportExport importOnly>
      <i>Or drop a dialogue file in this area to import</i>
    </DialogueImportExport>
  </div>
</div>

<script>
  import NewDialogueForm from './NewDialogueForm.svelte';
  import DialogueImportExport from '../dialogueio/DialogueImportExport.svelte';
</script>

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
</style>
