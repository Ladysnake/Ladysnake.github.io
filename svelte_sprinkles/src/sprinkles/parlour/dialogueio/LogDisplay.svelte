<script lang="ts">
  import type {HtmlLogger} from "../../../lib/htmlLogger";

  export let logger: HtmlLogger;
  $: ({info, warning, error} = $logger);
</script>

<p class="dialogue-io-log info-log">{info}</p>
<p class="dialogue-io-log warning-log">{warning}</p>
<p class="dialogue-io-log error-log">{error}</p>

<style>
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