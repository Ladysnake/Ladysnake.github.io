<script lang="ts">
  import type {McText} from "./McText";

  export let text: McText;
  let className: string;

  export { className as class };
</script>

<div class={className}>
  {typeof text === 'string' ? text : text.translate ?? text.text}
</div>

<style>
  div {
    padding: 0.1em;
  }
</style>