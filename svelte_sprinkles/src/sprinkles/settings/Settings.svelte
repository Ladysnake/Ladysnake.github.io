<script lang="ts">
  import {darkModeSetting} from "../../lib/darkMode";
  import {derived} from "svelte/store";

  const darkMode = {
    ...derived(darkModeSetting, (d) => {
      if (d === undefined) {
        return 'system';
      } else if (d) {
        return 'enable';
      } else {
        return 'disable';
      }
    }),
    set: (value: string) => darkModeSetting.set(value === 'system' ? undefined : value === 'enable'),
  };

  function reset() {
    $darkModeSetting = undefined;
  }
</script>
<form>
  <!-- Simply prevent unwanted resets from clicking on the label -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions a11y-click-events-have-key-events -->
  <label for="clear-settings" on:click|preventDefault>
    <svg inline-src="octicon-trashcan"/>
    <span>Reset all settings to default</span>
  </label>
  <button type="reset" id="clear-settings" class="btn btn-warning btn-sm" on:click|preventDefault={reset}>Clear</button>
  <hr/>
  <label for="dark-mode-setting">
    <svg inline-src="darkmode-enable"/>
    <span>Dark Mode: What theme do you want to use?</span>
    <p>You can toggle this with the button at the top of the page.</p>
  </label>
  <select id="dark-mode-setting" bind:value={$darkMode}>
    <option value="enable">Dark Mode</option>
    <option value="disable">Light Mode</option>
    <option value="system">Use system setting</option>
  </select>
</form>

<style>
  form {
    display: grid;
    width: 80%;
    margin: 2em auto auto;
    grid-auto-flow: column;
    grid-template-columns: 2em 1fr max-content;
    justify-content: space-between;
    row-gap: 0.5em;
  }

  hr {
    grid-column: 1 / span 3;
    width: 100%;
    border-width: 2px;
    margin: 0.5em;
  }

  p {
    grid-area: desc;
    margin: 0;
    font-weight: normal;
  }

  label {
    display: grid;
    grid-auto-flow: column;
    grid-column: 1 / span 2;
    grid-template-columns: subgrid;
    grid-template-areas: "icon title" "desc desc";
    align-items: center;
    column-gap: 1em;
    justify-content: start;
  }

  label > svg {
    grid-area: icon;
    height: 25px;
  }

  label > span {
    grid-area: title;
  }
</style>
