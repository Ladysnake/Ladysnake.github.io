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
  <h3>Global Properties</h3>
  <!--                <label for="dialogue-filename-input">File name</label><input id="dialogue-filename-input" type="text"/>-->
  <div>
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
      </label>
    </span>
  </div>
  <fieldset class="dialogue-layout-selection">
    <legend>Layout</legend>
    <label>
      <input
        type="radio"
        name="dialogue-layout"
        value="blabber:classic"
        bind:group={$dialogueLayout}
      />
      Classic
    </label>
    <label>
      <input
        type="radio"
        name="dialogue-layout"
        value="blabber:rpg"
        bind:group={$dialogueLayout}
      />
      RPG
    </label>
  </fieldset>
  <div>
    <label for="dialogue-start-at">Starting state</label><br/>
    <select title="Starting state selector; requires at least one state to exist" id="dialogue-start-at"
            disabled={!($dialogueStateKeys.length)} bind:value={$dialogueStart}>
      {#each $dialogueStateKeys as state}
        <option value={state}>{state}</option>
      {/each}
    </select>
  </div>
  <div>
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
  <button class="close-btn btn btn-info btn-sm" on:click>
    Close
  </button>
</div>

<style>
  .dialogue-properties {
    display: flex;
    flex-direction: column;
    max-width: 20em;
    gap: 1em;
  }

  h3 {
    margin-bottom: 1rem;
    font-size: 20px;
  }

  fieldset {
    border: none;
    padding: 0;
    display: flex;
    justify-content: space-evenly;
  }

  legend {
    display: block;
    font-weight: bold;
  }

  .yes-no-container {
    position: relative;

    & input {
      position: absolute;
    }
  }

  .dialogue-layout-selection {
    grid-row-end: span 2;
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    gap: 0.2em;

    & label {
      margin-bottom: 0;
      margin-right: 2em;
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
    width: 100%;
    background-color: var(--base-background-color);
    border: 1px solid var(--button-outline);

    &:hover {
      border-color: var(--button-hover-outline);
    }
  }

  .close-btn {
    margin-top: 1em;
  }
</style>
