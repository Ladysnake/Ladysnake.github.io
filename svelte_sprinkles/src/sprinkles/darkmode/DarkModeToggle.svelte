<script>
  import {darkModeEnabled} from "../../lib/darkMode";
  import {crossfade} from "svelte/transition";
  import {quintInOut} from "svelte/easing";

  const key = 'darkmode-toggle-transition';

  const [send, receive] = crossfade({
    duration: 800,
    easing: quintInOut,
  });

  function toggleDarkMode() {
    darkModeEnabled.update((v) => !v);
  }
</script>

<button on:click={toggleDarkMode} title="Toggle Dark Mode">
  {#if ($darkModeEnabled)}
    <svg inline-src="darkmode-disable" aria-label="Light Mode Icon" in:send={{ key }} out:receive={{ key }}></svg>
  {:else}
    <svg inline-src="darkmode-enable" aria-label="Dark Mode Icon" in:send={{ key }} out:receive={{ key }}></svg>
  {/if}
</button>

<style>
  button {
    display: inline-grid;
  }

  svg {
    grid-column: 1;
    grid-row: 1;
    height: 25px;
    vertical-align: middle;
    cursor: pointer;
  }
</style>
