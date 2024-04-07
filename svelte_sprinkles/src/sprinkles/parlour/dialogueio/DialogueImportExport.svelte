<svelte:body on:dragenter={onDragEnter} on:dragleave={onDragLeave}/>
<div
  id="dialogue-import-export"
  role="region"
  aria-label="Dialogue import/export"
  class:landing-page={importOnly}
  on:drop|preventDefault={onDrop}
>
  {#if !importOnly}
    <button class="btn btn-danger" id="dialogue-reset" on:click={resetDialogue}>
      <svg inline-src="octicon-trashcan"/>
      Reset dialogue
    </button>
  {/if}
  <input id="dialogue-import" type="file" accept="application/json" on:change={importDialogue}/>
  <label class="btn btn-info" for="dialogue-import">
    <svg inline-src="octicon-upload"/>
    Import JSON dialogue file
  </label>
  <slot></slot>
  {#if !importOnly}
    <button class="btn btn-warning" id="dialogue-export" disabled={Object.keys($dialogueData.states).length === 0} on:click={exportDialogue}>
      <svg inline-src="octicon-download"/>
      Export JSON dialogue file
    </button>
  {/if}
  <div
    class="drop-zone"
    role="region"
    aria-label="File drop zone for importing dialogue"
    class:active={draggingInWindow > 0}
    class:hovered={draggingInDropZone > 0}
    on:dragover|preventDefault
  >
    <svg inline-src="octicon-upload"/>
    Drop a dialogue file <strong class="drop-zone">here</strong> to import
  </div>
</div>
<p class="dialogue-io-log info-log">{info}</p>
<p class="dialogue-io-log warning-log">{warning}</p>
<p class="dialogue-io-log error-log">{error}</p>

<script lang="ts">
  import BlabberDialogue, {StateType} from "../model/BlabberDialogue";
  import {dialogueData, dialogueFilename} from "../dialogueDataStore";
  import {validateDialogue} from "../validation/DialogueValidator";
  import {saveAs} from "file-saver";
  import {createEventDispatcher} from "svelte";
  import {choiceIdKey, genChoiceId} from "../model/DialogueChoice";

  let info: string = '';
  let warning: string = '';
  let error: string = '';
  let draggingInWindow = 0;
  let draggingInDropZone = 0;

  export let importOnly = false;

  const dispatch = createEventDispatcher<{
    'load': BlabberDialogue,
  }>();

  const logIoInfo = (text: string) => info = text;
  const logIoWarning = (text: string) => warning = text;
  const logIoError = (text: string) => error = text;
  const clearIoLogs = () => {
    info = '';
    warning = '';
    error = '';
  }

  function loadDialogueFile(file: File) {
    if (!file.type.startsWith('application/json')) {
      logIoError(`${file.name} is not a valid JSON file`);
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      try {
        clearIoLogs();
        if (typeof reader.result !== 'string') {
          logIoError(`Could not parse ${file.name}`);
          return;
        }
        const d = JSON.parse(reader.result, function (key, value) {
          if (key === 'choices') {
            for (const choice of value) {
              choice[choiceIdKey] = genChoiceId();
            }
          }
          return value;
        });
        if (!d.states) {
          logIoError(`${file.name} is missing dialogue state data`);
        } else {
          // You can go back to the previous dialogue after loading a new one!
          if ($dialogueData.isLoaded()) window.history.pushState(null, '');

          let filename = file.name.endsWith('.json') ? file.name.substring(0, file.name.length - 5) : file.name;
          $dialogueData = new BlabberDialogue(d, filename);
          dispatch('load', $dialogueData);
          logIoInfo(`Loaded dialogue from ${file.name}`);
        }
      } catch (err: any) {
        console.error(err);
        logIoError(`Failed to read ${file.name}: ${err.message}`);
      }
    });
    reader.readAsText(file);
  }

  function resetDialogue() {
    if (window.confirm('Do you really want to reset the dialogue?\n\n(You can undo this action by using the "Go Back" button of your browser)')) {
      window.history.pushState({}, '', '#');
      $dialogueData = new BlabberDialogue();
    }
  }

  function importDialogue(e: Event & { currentTarget: HTMLInputElement }) {
    const curFiles = e.currentTarget.files;
    if (curFiles && curFiles.length > 0) {
      loadDialogueFile(curFiles[0]);
    } else {
      logIoError('No files currently selected for upload');
    }
  }

  function exportDialogue() {
    clearIoLogs();
    if (validateDialogue($dialogueData, logIoWarning, logIoError)) {
      saveAs(new Blob(
          [JSON.stringify(
            $dialogueData.data,
            function (key, value) {
              if (key === 'action' && typeof value === 'object' && value.type === '') {
                return undefined;
              } else if (key === 'condition' && typeof value === 'object' && !value.predicate) {
                return undefined;
              } else if (key === choiceIdKey) {
                return undefined;
              } else if (key === 'choices' && this.type === StateType.END_DIALOGUE) {
                return undefined;
              } else {
                return value;
              }
            },
            2,
          )],
          { type: 'application/json' }),
        $dialogueFilename + '.json');
    }
  }

  function onDrop(e: DragEvent) {
    try {
      if (e.dataTransfer?.items && e.dataTransfer.items.length) {
        // If dropped items aren't files, reject them
        if (e.dataTransfer.items[0].kind === 'file') {
          loadDialogueFile(e.dataTransfer.items[0].getAsFile()!);
        }
      } else if (e.dataTransfer?.files.length) {
        // Use DataTransfer interface to access the file(s)
        loadDialogueFile(e.dataTransfer.files[0])
      }
    } finally {
      draggingInWindow = 0;
      draggingInDropZone = 0;
    }
  }

  function onDragEnter(e: DragEvent) {
    draggingInWindow++;
    if ((e.target as HTMLElement | null)?.classList?.contains('drop-zone')) {
      draggingInDropZone++;
    }
  }

  function onDragLeave(e: DragEvent) {
    draggingInWindow--;
    if ((e.target as HTMLElement | null)?.classList.contains('drop-zone')) {
      draggingInDropZone--;
    }
  }
</script>

<style>
  #dialogue-import-export.landing-page {
    outline: none;
    border: none;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  #dialogue-import-export {
    flex: auto;
    position: relative;
    display: flex;
    justify-content: space-around;
    padding: 1rem;
    background-color: var(--base-background-color);
    border-top: 1px solid var(--button-outline);
    outline: 2px solid var(--base-background-color);
  }

  svg {
    margin-right: 1rem;
    width: 16px;
    height: auto;
  }

  div.drop-zone {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 80%;
    visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--button-background);
    font-weight: bold;
    font-size: large;

    &.hovered {
      color: var(--button-selected-outline);
    }

    &.active {
      visibility: visible;
    }

    & strong {
      margin: 0 0.5rem 0 0.5rem;
      font-weight: bolder;
      font-size: larger;

      &::before {
        content: '>';
        margin-right: 0.3rem;
      }

      &::after {
        content: '<';
        margin-left: 0.3rem;
      }
    }
  }

  #dialogue-import {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;

    & + label {
      display: flex;
      align-items: center;
    }

    &:focus-visible + label {
      outline: auto;
    }
  }

  .dialogue-io-log {
    text-align: center;
    font-weight: bold;
    width: 100%;
    margin: 0;
    align-self: end;
  }

  .error-log {
    background-color: var(--color-invalid);
  }

  .warning-log {
    background-color: var(--color-warning);
  }

  .info-log {
    background-color: var(--color-primary);
  }
</style>
