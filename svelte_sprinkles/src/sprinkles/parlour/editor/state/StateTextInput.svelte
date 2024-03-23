<script lang="ts">
  import {dialogueData} from "../../dialogueDataStore";
  import type {McText, McTextTranslatable} from "../../BlabberDialogue";

  export let state: string;
  export let textFormat: string = '';

  $: value = $dialogueData.states[state]?.text ?? '';

  function importDialogueText(text: McText) {
    if (!text) return '';
    switch (textFormat) {
      case 'literal': return `${text}`;
      case 'translate': return (text as McTextTranslatable).translate;
      default: return JSON.stringify(text);
    }
  }

  function exportDialogueText(text: string | undefined): McText | undefined {
    if (!text) return undefined;
    switch (textFormat) {
      case 'literal': return text;
      case 'translate': return {translate: text};
      default: return JSON.parse(text);
    }
  }
</script>

<label for="dialogue-state-text" class="not-dialogue-ending">Text</label>
<span class="not-dialogue-ending">
  <input
    type="text"
    class="mc-text-input"
    id="dialogue-state-text"
    data-placeholder-literal="Welcome traveller, ..."
    data-placeholder-translate="mymod:dialogue.my_dialogue.{state}.text"
  />
</span>
