<script lang="ts">
  import {darkModeEnabled} from "../../../lib/darkMode";

  const toggleDarkMode = () => darkModeEnabled.update((v) => !v);
</script>
<button title="Toggle Dark Mode" id="darkmode-toggle" on:click={toggleDarkMode}>
  <span aria-label="Light Mode Icon">
    <svg inline-src="darkmode-disable"/>
  </span>
  <span aria-label="Dark Mode Icon" class="dark-mode-alt">
    <svg inline-src="darkmode-enable"/>
  </span>
</button>

<style>
  #darkmode-toggle {
    justify-items: center;
    align-items: center;
    height: var(--button-size);
    width: var(--button-size);
    background-color: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
  }
  span {
    height: 70%;
    width: 70%;
  }
  #darkmode-toggle svg {
    height: 100%;
    width: 100%;
  }
</style>
