<script lang="ts">
  import {dialogueData, dialogueTextFormat} from "../../dialogueDataStore";
  import {McTextType, type McText} from "../../../../lib/McText";
  import McTextInput from "../../../../lib/McTextInput.svelte";
  import {type DialogueState} from "../../BlabberDialogue";

  export let state: string;

  $: value = $dialogueData.states[state]?.text ?? '';

  let placeholder: string;

  $: {
    switch ($dialogueTextFormat) {
      case McTextType.PLAIN:
        placeholder = 'Welcome traveller, ...';
        break;
      case McTextType.TRANSLATION_KEY:
        placeholder = `mymod:dialogue.my_dialogue.${state}.text`;
        break;
      case McTextType.JSON:
        placeholder = '{...}';
        break;
    }
  }

  function updateText(text: McText) {
    $dialogueData = $dialogueData.withUpdatedState(state, (oldState) => ({
      ...oldState,
      text,
    } as DialogueState));
  }
</script>

<label for="dialogue-state-text" class="not-dialogue-ending">Text</label>
<span class="not-dialogue-ending">
  <McTextInput
    textFormat={$dialogueTextFormat}
    value={value}
    class="mc-text-input"
    id="dialogue-state-text"
    placeholder={placeholder}
    on:change={(e) => updateText(e.detail)}
  />
</span>
