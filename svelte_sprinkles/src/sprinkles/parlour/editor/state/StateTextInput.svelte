<script lang="ts">
  import {dialogueTextFormat} from "../../dialogueDataStore";
  import {McTextType, type McText} from "../../../../lib/McText";
  import McTextInput from "../../../../lib/McTextInput.svelte";
  import {getStateData, getStateKey} from "./DialogueStateView.svelte";

  const stateKey = getStateKey();
  const stateData = getStateData();

  $: value = $stateData.text ?? '';

  function updateText(text: McText) {
    $stateData = {
      ...$stateData,
      text,
    };
  }
</script>

<label for="dialogue-state-text" class="not-dialogue-ending">Text</label>
<div class="not-dialogue-ending">
  <McTextInput
    textFormat={$dialogueTextFormat}
    value={value}
    class="mc-text-input"
    id="dialogue-state-text"
    placeholders={{
      [McTextType.PLAIN]: 'Welcome traveller, ...',
      [McTextType.TRANSLATION_KEY]: `mymod:dialogue.my_dialogue.${$stateKey}.text`,
      [McTextType.JSON]: '{...}',
    }}
    on:change={(e) => updateText(e.detail)}
  />
</div>

<style>
  .not-dialogue-ending {
    overflow-x: auto;
  }
</style>
