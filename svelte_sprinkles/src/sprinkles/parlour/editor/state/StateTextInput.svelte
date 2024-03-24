<script lang="ts">
  import {dialogueTextFormat} from "../../dialogueDataStore";
  import {McTextType, type McText} from "../../../../lib/McText";
  import McTextInput from "../../../../lib/McTextInput.svelte";
  import {getStateData, getStateKey} from "./DialogueStateView.svelte";

  const stateKey = getStateKey();
  const stateData = getStateData();

  $: value = $stateData.text ?? '';
  $: console.log($stateKey, $stateData);

  let placeholder: string;

  $: {
    switch ($dialogueTextFormat) {
      case McTextType.PLAIN:
        placeholder = 'Welcome traveller, ...';
        break;
      case McTextType.TRANSLATION_KEY:
        placeholder = `mymod:dialogue.my_dialogue.${$stateKey}.text`;
        break;
      case McTextType.JSON:
        placeholder = '{...}';
        break;
    }
  }

  function updateText(text: McText) {
    $stateData = {
      ...$stateData,
      text,
    };
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
