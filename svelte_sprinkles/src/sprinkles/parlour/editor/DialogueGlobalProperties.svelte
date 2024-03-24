<script lang="ts">
  import {
    dialogueLayout,
    dialogueStart,
    dialogueStateKeys,
    dialogueTextFormat,
    dialogueUnskippable
  } from "../dialogueDataStore";
</script>
<div class="dialogue-properties">
  <details class="dialogue-global-properties">
    <summary>
      <h3>Global Properties</h3>
    </summary>
    <div class="menu">
      <!--                <label for="dialogue-filename-input">File name</label><input id="dialogue-filename-input" type="text"/>-->
      <label for="dialogue-unskippable">Skippable?</label>
      <span class="yes-no-container">
        <input
          type="checkbox"
          class="yes-no-input"
          id="dialogue-unskippable"
          bind:checked={$dialogueUnskippable}
        />
        <label for="dialogue-unskippable" class="btn btn-xs btn-yes">
          <svg inline-src="checked-box"/> Yes
        </label>
        <label for="dialogue-unskippable" class="btn btn-xs btn-no">
          <svg inline-src="unchecked-box"/> No
        </label></span>
      <fieldset class="dialogue-layout-selection">
        <legend>Layout</legend>
        <input
          type="radio"
          id="dialogue-layout-classic"
          name="dialogue-layout"
          value="blabber:classic"
          bind:group={$dialogueLayout}
        />
        <label for="dialogue-layout-classic">Classic</label>
        <input
          type="radio"
          id="dialogue-layout-rpg"
          name="dialogue-layout"
          value="blabber:rpg"
          bind:group={$dialogueLayout}
        />
        <label for="dialogue-layout-rpg">RPG</label>
      </fieldset>
      <label for="dialogue-start-at">Starting state</label>
      <select title="Starting state selector; requires at least one state to exist" id="dialogue-start-at" disabled={!($dialogueStateKeys.length)} bind:value={$dialogueStart}>
        {#each $dialogueStateKeys as state}
          <option value={state}>{state}</option>
        {/each}
      </select>
      <label for="dialogue-text-format">Editor text format</label>
      <span>
        <select id="dialogue-text-format" bind:value={$dialogueTextFormat}>
          <option value="plain">📃 Literal Text</option>
          <option value="translation_key">🌐 Translation Key</option>
          <option value="json">💻 Raw JSON</option>
        </select>
        <span id="raw-text-tip" hidden>See also <a href="https://minecraft.tools/en/json_text.php">Minecraft Tools' Text Generator</a></span>
      </span>
    </div>
  </details>
</div>

<style>
  #dialogue-filename {
    border-radius: 0.1em;

    &:not(:focus-visible):hover {
      outline: 1px solid var(--button-outline);
    }
  }

  .dialogue-global-properties {
    margin-bottom: 0.2rem;
  }

  h3 {
    margin-bottom: 1rem;
    font-size: 20px;
  }

  .menu {
    display: grid;
    width: 100%;
    grid-auto-flow: column;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: min-content min-content;
    place-items: center;
    gap: 0.5em;

    & .yes-no-container {
      position: relative;

      & input {
        position: absolute;
      }
    }

    & .dialogue-layout-selection {
      grid-row-end: span 2;
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      padding-right: 1em;
      gap: 0.2em;

      & label {
        margin-bottom: 0;
        margin-right: 2em;
      }
    }

    & > * {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
  }

  input, select {
    &:disabled {
      background-color: var(--button-background);
      border-color: var(--button-background);
      cursor: not-allowed;

      &:hover {
        border-color: var(--color-danger);
      }
    }
  }

  select {
    background-color: var(--base-background-color);
    border: 1px solid var(--button-outline);

    &:hover {
      border-color: var(--button-hover-outline);
    }
  }
</style>
