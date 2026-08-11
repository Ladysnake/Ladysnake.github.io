<script lang="ts">
  import {type KnownSchemas, schemaDefinitions} from "./schemaValidation";
  import type {JSONContent, AjvValidatorOptions, Content, OnChangeStatus, TextContent} from "svelte-jsoneditor";

  export let json: unknown;
  let lastJson = json;
  export let schemaKey: KnownSchemas;

  const validatorOptions = {
    schema: schemaDefinitions[schemaKey],
    schemaDefinitions,
    ajvOptions: {
      strictSchema: 'log',
    }
  } satisfies AjvValidatorOptions;

  let content: Content = { json };
  $: {
    if (json !== lastJson) {
      content = { json }
      lastJson = json;
    }
  }

  const onChange = (content: Content, _: Content, { contentErrors }: OnChangeStatus) => {
    if (contentErrors === null) {
      json = (content as JSONContent).json ?? JSON.parse((content as TextContent).text);
      lastJson = json;
    }
  }
</script>

<div>
  {#await import('svelte-jsoneditor')}
    Loading
  {:then {createAjvValidator, JSONEditor, Mode}}
    <JSONEditor bind:content onChange={onChange} validator={createAjvValidator(validatorOptions)} mode={Mode.text} mainMenuBar={true}/>
  {/await}
</div>
