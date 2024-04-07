<script lang="ts">
  import {dialogueData} from "../dialogueDataStore";
  import BlabberDialogue from "../model/BlabberDialogue";
  import ConfirmDialogue from "../../../lib/ConfirmDialogue.svelte";

  let dialog: ConfirmDialogue;

  async function resetDialogue() {
    if (await dialog.confirm(null)) {
      window.history.pushState({}, '', '#');
      $dialogueData = new BlabberDialogue();
    }
  }
</script>
<button class="btn btn-danger" id="dialogue-reset" on:click={resetDialogue}>
  <svg class="btn-icon" inline-src="octicon-trashcan-24"/>
  Reset
</button>
<ConfirmDialogue bind:this={dialog}>
  <h4>Do you really want to reset the dialogue?</h4>

  <p class="admonition admonition-important">You can undo this action by using the "Go Back" button of your browser.</p>
</ConfirmDialogue>
