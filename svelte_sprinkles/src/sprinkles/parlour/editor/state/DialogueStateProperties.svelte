<script lang="ts">
  import StateTypeInput from "./type/StateTypeInput.svelte";
  import StateActionInput from "./StateActionInput.svelte";
  import StateTextInput from "./StateTextInput.svelte";

  export let state: string;
</script>
<form id="dialogue-state-properties">
  <StateTypeInput state={state}/>
  <StateActionInput state={state}/>
  <StateTextInput state={state}/>
</form>

<style>
  form {
    margin-top: 1rem;
    margin-bottom: 1rem;
    display: grid;
    grid-template-columns: min-content auto;
    grid-auto-rows: minmax(3.1rem, max-content);
    column-gap: 1rem;
    row-gap: 0.5rem;
    background-color: var(--button-background);
    padding: 1rem;
    align-items: center;
  }

  form :global(input) {
    background-color: transparent;
    border: 1px solid var(--button-outline);
    padding: 0.5rem;

    &:invalid {
      border-color: var(--color-invalid);
      color: var(--color-invalid);
    }
  }
</style>
