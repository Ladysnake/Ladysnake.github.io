<script lang="ts">
  import DialogueImport from "./dialogueio/DialogueImport.svelte";
  import GraphOutline from "../../assets/GraphOutline.svelte";
  import ViewDashboardOutline from "../../assets/ViewDashboardOutline.svelte";

  export let mainView = true;

  function toggleView(): void {
    mainView = !mainView;
  }
</script>
<div class="dialogue-footer">
  <DialogueImport>
    <button id="dialogue-view-toggle" class="btn btn-success" on:click={toggleView}>
      {#if mainView}
        <GraphOutline alt="Toggle"/>
      {:else}
        <ViewDashboardOutline alt="Toggle"/>
      {/if}
      Toggle Graph View
    </button>
  </DialogueImport>
</div>
