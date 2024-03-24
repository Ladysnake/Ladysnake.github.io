<script context="module" lang="ts">
  import {getContext} from "svelte";
  import type {Readable, Writable} from "svelte/store";
  import type {DialogueState} from "../../BlabberDialogue";

  const DIALOGUE_STATE_CONTEXT_KEY = 'dialogue_state_data';
  const DIALOGUE_STATE_NAME_CONTEXT_KEY = 'dialogue_state_name_data';

  export function getStateData(): Writable<DialogueState> {
    return getContext(DIALOGUE_STATE_CONTEXT_KEY);
  }

  export function getStateKey(): Readable<string> {
    return getContext(DIALOGUE_STATE_NAME_CONTEXT_KEY);
  }
</script>
<script lang="ts">
  import DialogueStateProperties from "./DialogueStateProperties.svelte";
  import DialogueStateChoices from "./DialogueStateChoices.svelte";
  import {derived, readonly, writable} from "svelte/store";
  import {dialogueData} from "../../dialogueDataStore";
  import {setContext} from "svelte";

  export let selectedState: string;

  const stateKey = writable<string>();
  $: $stateKey = selectedState;

  const stateData: Writable<DialogueState> = {
    ...(derived([dialogueData, stateKey], ([d, k]) => d.states[k])),
    set: (newState: DialogueState) => dialogueData.update((d) => d.withUpdatedState(selectedState, () => newState)),
    update: (fn: (oldState: DialogueState) => DialogueState) => dialogueData.update((d) => d.withUpdatedState(selectedState, fn)),
  };

  setContext(DIALOGUE_STATE_CONTEXT_KEY, stateData);
  setContext(DIALOGUE_STATE_NAME_CONTEXT_KEY, readonly(stateKey));
</script>
<div class="main" id="dialogue-state-pane">
  <h3>State Properties: {selectedState}</h3>
  <DialogueStateProperties/>
  {#if $stateData.type !== 'end_dialogue'}
    <DialogueStateChoices/>
  {/if}
</div>
<style>
  #dialogue-state-pane {
    width: 100%;
    padding-top: 1rem;
  }
</style>
