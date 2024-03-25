<script>
  import {darkModeEnabled} from "../../lib/darkModeStore";
  import {crossfade} from "svelte/transition";
  import {quintInOut} from "svelte/easing";

  const key = 'darkmode-toggle-transition';

  const [send, receive] = crossfade({
    duration: 800,
    easing: quintInOut,
  });

  $: {
    if ($darkModeEnabled === undefined) {
      $darkModeEnabled = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    if ($darkModeEnabled) {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
    }
  }

  document.body.classList.remove("uninitialized-dark-mode");
</script>

<button on:click={darkModeEnabled.toggle} title="Toggle Dark Mode">
  {#if ($darkModeEnabled)}
    <svg inline-src="darkmode_1" aria-label="Light Mode Icon" in:send={{ key }} out:receive={{ key }}></svg>
  {:else}
    <svg inline-src="darkmode_0" aria-label="Dark Mode Icon" in:send={{ key }} out:receive={{ key }}></svg>
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
