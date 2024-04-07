<script lang="ts">
  import {dialogueStart, dialogueStateKeys} from "../dialogueDataStore.js";
  import ConfirmDialogue from "../../../lib/ConfirmDialogue.svelte";

  let dialog: ConfirmDialogue;
  let newStartingState: string | undefined;

  export async function confirm(state: string, references: {state: string; choice: number}[]): Promise<boolean> {
    newStartingState = undefined;
    if (await dialog.confirm({ state, references })) {
      if (state === $dialogueStart) {
        $dialogueStart = newStartingState;
      }
      return true;
    }
    return false;
  }
</script>
<ConfirmDialogue bind:this={dialog} danger let:arg>
  {#if arg.references.length}
    <p>
      The following {arg.references.length > 1 ? 'states reference' : 'state references'} <code>{arg.state}</code>:
    </p>

    <ul class="confirm-refs" role={arg.references.length > 1 ? 'list' : 'none'}>
      {#each arg.references as reference}
        <li><code>{reference.state}</code> (choice <span class="choice-index">#{reference.choice + 1}</span>)</li>
      {/each}
    </ul>
  {/if}

  {#if arg.state === $dialogueStart}
    <p>You are attempting to delete the starting state. Please select a replacement before proceeding.</p>
    <label>
      New starting state:
      <select bind:value={newStartingState}>
        {#each $dialogueStateKeys as otherState}
          {#if otherState !== arg.state}
            <option value={otherState}>{otherState}</option>
          {/if}
        {/each}
      </select>
    </label>
  {/if}

  <strong>Do you want to delete <code>{arg.state}</code> {#if arg.references.length}and every choice referencing it{/if}{#if arg.state === $dialogueStart}, and set <code>{newStartingState}</code> as the new starting state{/if}?</strong>
</ConfirmDialogue>

<style>
  p {
    margin: 0;
  }

  label {
    font-weight: normal;
  }
</style>
