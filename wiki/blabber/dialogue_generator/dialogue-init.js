import {
    storeDialogueToSession,
    setupFieldNameValidation,
    EDITOR_TEXT_FORMAT_KEY,
    commonDialogueInit,
    validateIdentifierField,
} from "./dialogue-common.js";
import BlabberDialogue from "./blabber-dialogue.js";

(function init() {
    const form = document.getElementById('new-dialogue');
    const filenameField = document.getElementById('filename');
    const startStateField = document.getElementById('start_dialogue_state_name');
    const endStateField = document.getElementById('end_dialogue_state_name');
    const textFormatInputs = [...form.querySelectorAll('input[name=text-format]')];
    const defaultTextFormat = localStorage.getItem(EDITOR_TEXT_FORMAT_KEY);
    const dialogue = new BlabberDialogue();

    textFormatInputs.forEach((input) => {
        input.checked = input.value === defaultTextFormat;
        input.addEventListener('change', () => textFormatInputs.forEach((i) => {
            i.setCustomValidity('');
            i.reportValidity();
        }))
    });
    setupFieldNameValidation(filenameField);
    setupFieldNameValidation(startStateField);
    setupFieldNameValidation(endStateField);
    commonDialogueInit(dialogue, (selected) => {
        storeDialogueToSession(dialogue, selected);
        dialogue.unload();
        window.location.assign('./main-view');
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const unskippable = document.getElementById('dialogue-unskippable').value;
        const textFormat = textFormatInputs.find((it) => it.checked)?.value;

        if (![filenameField, startStateField, endStateField].every((e) => validateIdentifierField(e))) {
            return;
        }

        if (textFormat) {
            localStorage.setItem(EDITOR_TEXT_FORMAT_KEY, textFormat);
        } else {
            textFormatInputs.forEach((input) => {
                input.setCustomValidity('Please select one');
                input.reportValidity();
            });
            return;
        }

        const startState = startStateField.value;
        const endState = endStateField.value;
        dialogue.filename = filenameField.value;
        dialogue.unskippable(unskippable);
        dialogue.startAt(startState);
        dialogue.data.states = {
            [startState]: {},
            [endState]: {
                type: 'end_dialogue'
            }
        };
        storeDialogueToSession(dialogue, startState);
        dialogue.unload();
        window.location.assign('./main-view');
    });
})();
