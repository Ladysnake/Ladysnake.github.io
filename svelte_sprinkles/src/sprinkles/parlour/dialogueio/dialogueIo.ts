import type {HtmlLogger} from "../../../lib/htmlLogger";
import {choiceIdKey, genChoiceId} from "../model/DialogueChoice";
import {dialogueData, dialogueTextFormat} from "../dialogueDataStore";
import BlabberDialogue, {StateType} from "../model/BlabberDialogue";
import {get} from "svelte/store";
import type {EventDispatcher} from "svelte";
import {validateDialogue} from "../validation/DialogueValidator";
import {saveAs} from "file-saver";
import {McTextType} from "../../../lib/McText";
import {loadChosenTextFormat} from "../localStorageKeys";

function detectTextFormat(dialogue: BlabberDialogue) {
  const texts = Object.values(dialogue.states).flatMap(state => [state.text, ...(state.choices?.map(choice => choice.text) ?? [])]);
  return texts.filter(it => it)
      .map(text => typeof text === 'string' ? McTextType.PLAIN : (typeof text === 'object' && 'translate' in text) ? McTextType.TRANSLATION_KEY : McTextType.JSON)
      .reduce((v1: McTextType | undefined, v2) => v1 === undefined ? v2 : (v1 === v2 ? v1 : McTextType.JSON), undefined) ?? loadChosenTextFormat() ?? McTextType.PLAIN;
}

export function loadDialogueFile(file: File, ioLogger: HtmlLogger, dispatch: EventDispatcher<{ load: BlabberDialogue }>) {
  if (!file.type.startsWith('application/json')) {
    ioLogger.logError(`${file.name} is not a valid JSON file`);
    return;
  }
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    try {
      ioLogger.clearLogs();
      if (typeof reader.result !== 'string') {
        ioLogger.logError(`Could not parse ${file.name}`);
        return;
      }
      const d = JSON.parse(reader.result, function (key, value) {
        if (key === 'choices') {
          for (const choice of value) {
            choice[choiceIdKey] = genChoiceId();
          }
        }
        return value;
      });
      if (!d.states) {
        ioLogger.logError(`${file.name} is missing dialogue state data`);
      } else {
        // You can go back to the previous dialogue after loading a new one!
        if (get(dialogueData).isLoaded()) window.history.pushState(null, '');

        let filename = file.name.endsWith('.json') ? file.name.substring(0, file.name.length - 5) : file.name;
        const importedDialogue = new BlabberDialogue(d, filename);
        dialogueData.set(importedDialogue);
        dialogueTextFormat.set(detectTextFormat(importedDialogue));
        dispatch('load', importedDialogue);
        ioLogger.logInfo(`Loaded dialogue from ${file.name}`);
      }
    } catch (err: any) {
      console.error(err);
      ioLogger.logError(`Failed to read ${file.name}: ${err.message}`);
    }
  });
  reader.readAsText(file);
}

export function exportDialogue(dialogue: BlabberDialogue, filename: string | undefined, ioLogger: HtmlLogger) {
  ioLogger.clearLogs();
  if (validateDialogue(dialogue, ioLogger.logWarning, ioLogger.logError)) {
    saveAs(new Blob(
            [JSON.stringify(
                dialogue.data,
                function (key, value) {
                  if (key === 'action' && typeof value === 'object' && value.type === '') {
                    return undefined;
                  } else if (key === 'condition' && typeof value === 'object' && !value.predicate) {
                    return undefined;
                  } else if (key === choiceIdKey) {
                    return undefined;
                  } else if (key === 'choices' && this.type === StateType.END_DIALOGUE) {
                    return undefined;
                  } else {
                    return value;
                  }
                },
                2,
            )],
            { type: 'application/json' }),
        filename + '.json');
  }
}
