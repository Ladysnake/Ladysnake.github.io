<script lang="ts">
  import Landing from "./landing/Landing.svelte";
  import {dialogueFilename} from "./dialogueDataStore";
</script>

<main>
  {#if (!$dialogueFilename)}
    <Landing/>
  {:else}
    <p>{$dialogueFilename}</p>
    <button on:click={() => $dialogueFilename = undefined}>Reset</button>
  {/if}
</main>

<style>
</style>
