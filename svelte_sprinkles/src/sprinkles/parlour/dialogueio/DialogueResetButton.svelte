<script lang="ts">
  import {dialogueData} from "../dialogueDataStore";
  import BlabberDialogue from "../model/BlabberDialogue";

  function resetDialogue() {
    if (window.confirm('Do you really want to reset the dialogue?\n\n(You can undo this action by using the "Go Back" button of your browser)')) {
      window.history.pushState({}, '', '#');
      $dialogueData = new BlabberDialogue();
    }
  }
</script>
<button class="btn btn-danger" id="dialogue-reset" on:click={resetDialogue}>
  <svg class="btn-icon" inline-src="octicon-trashcan-24"/>
  Reset
</button>
