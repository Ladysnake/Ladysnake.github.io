<script lang="ts">
  import {choiceIdKey, type DialogueChoice, UnavailableDisplay,} from "../../../model/DialogueChoice";
  import type {Writable} from "svelte/store";
  import McTextInput from "../../../../../lib/McTextInput.svelte";
  import {type Identifier, type McText, McTextType} from "../../../../../lib/McText";

  export let choice: Writable<DialogueChoice>;
  export let choiceIndex: number;
  export let stateKey: string;

  let dialog: HTMLDialogElement;
  let predicateLocation: Identifier | '';
  let predicateLocationInput: HTMLInputElement;
  let hideChoice: boolean;
  let unavailableMessage: McText;

  $: idBase = "choice-" + $choice[choiceIdKey];
  $: predicateLocationMatch = predicateLocation?.match(/^(.+):(.+)$/);

  function openEditor() {
    predicateLocation = $choice.only_if?.predicate ?? '';
    hideChoice = $choice.only_if?.when_unavailable?.display === UnavailableDisplay.HIDDEN;
    unavailableMessage = $choice.only_if?.when_unavailable?.message ?? '';
    dialog.showModal();
  }

  export function validateIdentifier(element: HTMLInputElement) {
    if (element.validity.patternMismatch) {
      element.setCustomValidity('Must be a valid identifier (lowercase letters, numbers, dashes/underscores and forward slashes only)');
    } else {
      element.setCustomValidity('');
    }
    return element.reportValidity();
  }

  function clear() {
    predicateLocation = '';
    predicateLocationInput.value = '';
    predicateLocationInput.setCustomValidity('');
    predicateLocationInput.reportValidity();
    hideChoice = false;
    unavailableMessage = '';
  }

  function save() {
    if (validateIdentifier(predicateLocationInput)) {
      $choice = {
        ...$choice,
        only_if: predicateLocation !== '' ? {
          predicate: predicateLocation,
          when_unavailable: {
            display: hideChoice ? UnavailableDisplay.HIDDEN : UnavailableDisplay.GRAYED_OUT,
            message: unavailableMessage,
          }
        } : undefined,
      }
    }
  }
</script>

<button class="table-input" on:click={openEditor} title={$choice.only_if ? 'Configure condition' : 'Add condition'}>
  {#if $choice.only_if}
    <svg role="graphics-symbol" inline-src="octicon-gear-16"/>
  {:else}
    <svg role="graphics-symbol" inline-src="octicon-plus-16"/>
  {/if}
</button>
<dialog bind:this={dialog}>
  <form method="dialog" on:submit={save}>
    <div class="predicate">
      <label class="predicate-label" for={`${idBase}-predicate`}>Predicate</label>
      <input
        pattern="^$|[a-z0-9_\-]+:[a-z0-9\/_\-]+"
        type="text"
        placeholder="my_namespace:predicate"
        id={`${idBase}-predicate`}
        bind:value={predicateLocation}
        bind:this={predicateLocationInput}
        on:input={(e) => validateIdentifier(e.currentTarget)}
      />
      <button class="clear btn-danger rounded" type="button" title="Remove condition" disabled={!predicateLocation} on:click={clear}>
        <svg inline-src="octicon-trashcan"/>
      </button>
      <p class="predicate-tip">
        {#if predicateLocationMatch}
          This will look for the file <code>data/{predicateLocationMatch[1]}/predicates/{predicateLocationMatch[2]}.json</code>
          in your mod or datapack.
        {:else}
          This will look for a file in the <code>data/&lt;namespace&gt;/predicates/</code> directory of the corresponding mod or datapack.
        {/if}
        <a href="https://minecraft.wiki/w/Predicate" target="_blank">More information on predicates</a>
      </p>
    </div>
    <fieldset disabled={!predicateLocationMatch}>
      <legend>When condition is not met:</legend>
      <div class="hide">
        <input id={`${idBase}-unavailable-hide`} type="checkbox" bind:checked={hideChoice}/>
        <label for={`${idBase}-unavailable-hide`}>
          Hide choice
        </label>
      </div>
      {#if !hideChoice}
        <div>
          <label for={`${idBase}-unavailable-message`}>
            Show this hint:
          </label>
          <McTextInput
            id={`${idBase}-unavailable-message`}
            placeholders={{
              [McTextType.PLAIN]: "“Find the meaning of life to unlock this path”",
              [McTextType.TRANSLATION_KEY]: `mymod:dialogue.my_dialogue.${stateKey}.choice_${choiceIndex}.hint`,
              [McTextType.JSON]: "{...}",
            }}
            bind:value={unavailableMessage}
          />
        </div>
      {/if}
    </fieldset>
    <div class="exit">
      <button class="btn btn-sm btn-warning" type="button" on:click={() => dialog.close()}>Cancel</button>
      <button class="btn btn-sm btn-info" type="submit" disabled={!!predicateLocation && !predicateLocationMatch}>Save {#if !predicateLocation}without condition{/if}</button>
    </div>
  </form>
</dialog>

<style>
  dialog {
    width: min(80%, 60rem);
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }

  fieldset:disabled, button:disabled {
    opacity: 60%;
  }

  .predicate {
    display: grid;
    grid: "label label" "input delete" min-content "tip tip" / 1fr max-content;
  }

  .predicate-label {
    grid-area: label;
  }

  .predicate-tip {
    grid-area: tip;
  }

  .clear {
    margin: 0 0.4em;
    border: none;
    height: 3em;
    width: 3em;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    & svg {
      height: 2em;
      width: auto;
    }
    &:disabled {
      background-color: var(--button-outline);
    }
  }

  .hide {
    display: flex;
    align-items: center;
    & label {
      flex: auto;
      padding-left: 0.5em;
      margin: 0;
    }
  }

  .exit {
    display: flex;
    justify-content: end;
    gap: 1em;
    margin: 0 1em;
  }
</style>
