<script lang="ts">
  import DialogueImportExport from "./dialogueio/DialogueImportExport.svelte";

  export let mainView = true;

  function toggleView(): void {
    mainView = !mainView;
  }
</script>
<div class="dialogue-footer">
  <DialogueImportExport>
    <button id="dialogue-view-toggle" class="btn btn-success" on:click={toggleView}>
      {#if mainView}
        <svg inline-src="graph-outline" />
      {:else}
        <svg inline-src="view-dashboard-outline"/>
      {/if}
      Toggle Graph View
    </button>
  </DialogueImportExport>
</div>

<style>
  .btn {
    display: flex;
    align-items: center;
  }
  .dialogue-footer {
    position: sticky;
    bottom: 0;
  }
</style>
