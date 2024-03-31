<script lang="ts">
  import {EDITOR_TEXT_FORMAT_KEY} from "../localStorageKeys";
  import BlabberDialogue from "../BlabberDialogue";
  import {dialogueData, dialogueTextFormat} from "../dialogueDataStore";
  import {parseMcTextType} from "../../../lib/McText.js";

  let filename: string | undefined;
  let textFormat: string | null = localStorage.getItem(EDITOR_TEXT_FORMAT_KEY);
  let layout: 'blabber:classic' | 'blabber:rpg' = 'blabber:classic';
  let skippable = true;
  let startDialogueStateName = 'start';
  let endDialogueStateName = 'end';

  export function validateFilename(element: HTMLInputElement) {
    if (!element.value) {
      element.setCustomValidity('Please enter a valid non-namespaced identifier');
    } else if (element.validity.patternMismatch) {
      element.setCustomValidity('Must be a valid non-namespaced identifier (lowercase letters, numbers and dashes/underscores only)');
    } else {
      element.setCustomValidity('');
      element.reportValidity();
      return true;
    }
    element.reportValidity();
    return false;
  }

  export function validateStateName(element: HTMLInputElement) {
    if (!element.value) {
      element.setCustomValidity('Please enter a valid non-namespaced identifier');
    } else if (element.validity.patternMismatch) {
      element.setCustomValidity('Must be a valid non-namespaced identifier (lowercase letters, numbers and dashes/underscores only)');
    } else {
      element.setCustomValidity('');
      element.reportValidity();
      return true;
    }
    element.reportValidity();
    return false;
  }

  function setupTextFormatValidation(fieldset: HTMLElement) {
    const textFormatInputs = [...fieldset.querySelectorAll('input[name=text-format]')] as HTMLInputElement[];
    for (let input of textFormatInputs) {
      input.addEventListener('change', () => {
        for (const i of textFormatInputs) {
          i.setCustomValidity('');
          i.reportValidity();
        }
      });
    }
  }

  function handleSubmit(event: Event & { currentTarget: (EventTarget & HTMLFormElement) }) {
    const filenameField = document.getElementById('filename') as HTMLInputElement;
    const startStateField = document.getElementById('start_dialogue_state_name') as HTMLInputElement;
    const endStateField = document.getElementById('end_dialogue_state_name') as HTMLInputElement;
    const textFormatInputs = [...event.currentTarget.querySelectorAll('input[name=text-format]')] as HTMLInputElement[];

    if (!(validateFilename(filenameField) && validateStateName(startStateField) && validateStateName(endStateField))) {
      return;
    }

    if (textFormat) {
      localStorage.setItem(EDITOR_TEXT_FORMAT_KEY, textFormat);
    } else {
      for (const input of textFormatInputs) {
        input.setCustomValidity('Please select one');
        input.reportValidity();
      }
      return;
    }
    $dialogueTextFormat = parseMcTextType(textFormat);
    $dialogueData = new BlabberDialogue({
      states: {
        [startDialogueStateName]: {},
        [endDialogueStateName]: {
          type: 'end_dialogue'
        }
      }
    }).withLayout(layout)
      .withUnskippability(!skippable)
      .withStartAt(startDialogueStateName)
      .withFilename(filename);
  }
</script>

<form id="new-dialogue" on:submit|preventDefault={handleSubmit}>
  <h3>Create a dialogue</h3>
  <div>
    <label for="filename">
      <span>Pick a file name:</span><i>(it will be part of your dialogue's ID)</i><br/>
      <span class="dialogue-filename">
        <input
          maxlength="64"
          id="filename"
          pattern="[a-z0-9_\-]+"
          type="text"
          placeholder="my_awesome_dialogue"
          bind:value={filename}
          on:change={(e) => validateFilename(e.currentTarget)}
        />
        <span class="file-extension">.json</span>
      </span>
    </label>
  </div>
  <fieldset id="dialogue-text-format" use:setupTextFormatValidation>
    <legend>Which format should this editor use for texts?</legend>
    <span class="option">
      <input
        id="literal-text"
        type="radio"
        name="text-format"
        value="plain"
        bind:group={textFormat}
      />
      <label for="literal-text"><span aria-hidden="true" class="icon">📃</span>Literal Text <i>(Easier for playing around)</i></label>
    </span>
    <span class="option">
      <input
        id="translation-keys"
        type="radio"
        name="text-format"
        value="translation_key"
        bind:group={textFormat}
      />
      <label for="translation-keys"><span aria-hidden="true" class="icon">🌐</span>Translation Key <i>(Recommended for public releases)</i></label>
    </span>
    <span class="option">
            <input
              id="json-text"
              type="radio"
              name="text-format"
              value="json"
              bind:group={textFormat}
            />
            <label for="json-text">
              <span aria-hidden="true" class="icon">💻</span>
              Raw JSON
              <i>(See also <a href="https://minecraft.wiki/w/Raw_JSON_text_format">
                the wiki page <svg inline-src="external-link"/>
              </a>, or <a href="https://minecraft.tools/en/json_text.php">
                a generator <svg inline-src="external-link"/>
              </a>)</i></label>
        </span>
  </fieldset>
  <fieldset>
    <legend>What layout do you want your dialogue to use for regular states?</legend>
    <span class="option">
            <input
              id="layout-classic"
              type="radio"
              name="layout"
              value="blabber:classic"
              bind:group={layout}
            />
            <label for="layout-classic">Classic <i>(full screen, good for long texts)</i></label>
        </span>
    <span class="option">
      <input
        id="layout-rpg"
        type="radio"
        name="layout"
        value="blabber:rpg"
        bind:group={layout}
      />
      <label for="layout-rpg">RPG <i>(reduced size, good for NPC dialogues with short choices)</i></label>
    </span>
  </fieldset>
  <div class="option">
    <input type="checkbox" id="dialogue-unskippable" bind:checked={skippable}/>
    <label for="dialogue-unskippable">Can this dialogue be skipped? <i>(e.g. with the escape key)</i></label>
  </div>
  <div class="dialogue-state-name">
    <label for="start_dialogue_state_name">Pick an internal ID for your first dialogue state:</label>
    <input
      id="start_dialogue_state_name"
      class="name-input"
      pattern="[a-z0-9_\-]+"
      type="text"
      placeholder="start, first_steps, ..."
      bind:value={startDialogueStateName}
      on:change={(e) => validateStateName(e.currentTarget)}
    />
  </div>
  <div class="dialogue-state-name">
    <label for="end_dialogue_state_name">Pick an internal ID for an end dialogue state: <i>(you can make more
      later)</i></label>
    <input
      id="end_dialogue_state_name"
      class="name-input"
      pattern="[a-z0-9_\-]+"
      type="text"
      placeholder="end, goodbyes, ..."
      bind:value={endDialogueStateName}
      on:change={(e) => validateStateName(e.currentTarget)}
    />
  </div>
  <button type="submit" class="btn btn-success rounded">Start editing</button>
</form>

<style>
  #new-dialogue {
    display: flex;
    flex-direction: column;
    width: 60%;
    flex: none;
    gap: 0.8em;
    padding-right: 2em;
  }

  label[for='filename'] {
    width: min(100%, 30em);
  }

  .dialogue-filename {
    display: flex;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .dialogue-filename input {
    padding: 0.5em;
    font-weight: normal;
  }

  .dialogue-filename .file-extension {
    pointer-events: none;
    color: var(--button-outline);
  }

  i {
    font-weight: normal;
    margin-left: 1em;
  }

  .option {
    position: relative;
    display: flex;
    align-items: center;
  }

  .option input {
    position: absolute;
    left: 1em;
  }

  .option label {
    margin-bottom: 0;
    padding: 0.8em 1em 0.8em 3em;
    width: 100%;
  }

  .option .icon {
    margin-right: 0.5em;
  }

  .option label:hover,
  .option input:hover + label,
  .option input:focus-visible + label {
    background-color: var(--accent-background-color);
  }

  .dialogue-state-name {
    display: flex;
    flex-direction: column;
  }

  .dialogue-state-name input[type='text'] {
    width: 30%;
  }

  .name-input {
    padding: 0.5em;
  }

  fieldset {
    border: 2px solid transparent;
    transition: border-color 0.1s ease-in-out;
    display: flex;
    flex-direction: column;
    padding: 0;
  }

  fieldset:invalid {
    border-color: var(--color-invalid);
  }

  legend {
    font-weight: bold;
  }

  input[type='text'] {
    width: 99%;
    margin-left: 2px;
    border: 2px solid transparent;
  }

  input[type='text']:invalid {
    border-color: var(--color-invalid);
    color: var(--color-invalid);
  }
</style>
