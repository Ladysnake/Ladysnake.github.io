<script context="module" lang="ts"></script>
<script lang="ts">
  import {fade} from 'svelte/transition';
  import {sineOut} from 'svelte/easing';
  import { setupGraph} from './renderGraph';
  import 'vis-network/styles/vis-network.css';
</script>

<div class="graph-container">
  <!--Vis Network is so massive we have to load it in separate chunks-->
  {#await Promise.all([import('vis-data'), import('vis-network')]) }
    <p class="loading" transition:fade={{ duration: 200, easing: sineOut}}>
      Loading...
    </p>
  {:then [{DataSet}, {Network}]}
    <div id="dialogue-graph" use:setupGraph={{DataSet, Network}} on:select transition:fade={{duration: 100}}>
      <p>
        Import a dialogue or create some states in the table view to get started
      </p>
    </div>
  {/await}
</div>

<style>
  .graph-container {
    height: 85vh;
  }
  #dialogue-graph {
    width: 100%;
    height: 100%;
  }
  .loading {
    position: absolute;
  }
</style>
