import {
    commonDialogueInit,
    EDITOR_TEXT_FORMAT_KEY,
    setupFieldNameValidation,
    storeDialogueToSession,
    validateIdentifierField
} from "./dialogue-common.js";
import BlabberDialogue from "./blabber-dialogue.js";

(() => {
    const dialogue = new BlabberDialogue();

    document.getElementById('dialogue-editor').hidden = false;

    const exportButton = document.getElementById('dialogue-export');
    const startInput = document.getElementById('dialogue-start-at');
    const unskippableInput = document.getElementById('dialogue-unskippable');
    const dialogueLayoutInputs = document.querySelectorAll('input[name=dialogue-layout]');
    const choiceEditor = document.querySelector('.dialogue-choice-editor');
    const stateList = document.getElementById('dialogue-state-list');

    let selectedState;

    exportButton.disabled = true;
    startInput.disabled = true;
    startInput.addEventListener('change', e => dialogue.startAt(e.target.value));
    unskippableInput.addEventListener('change', e => dialogue.unskippable(e.target.value));
    dialogueLayoutInputs.forEach((e) => e.addEventListener('change', (ev) => {
        dialogue.layout(document.querySelector('input[name=dialogue-layout]:checked').value);
    }))

    const textFormatSelect = document.getElementById('dialogue-text-format');

    function refreshMcTextPlaceholders(parent = document) {
        parent.querySelectorAll('.mc-text-input').forEach(el => {
            el.placeholder = (el.dataset[`placeholder${textFormatSelect.value.charAt(0).toUpperCase()}${textFormatSelect.value.substring(1)}`] ?? '').replaceAll('{state}', selectedState);
        });
    }

    /**
     *
     * @param {McText} text
     * @returns {string}
     */
    function importDialogueText(text) {
        if (!text) return '';
        switch (textFormatSelect.value) {
            case 'literal': return `${text}`;
            case 'translate': return text.translate;
            default: return JSON.stringify(text);
        }
    }

    /**
     *
     * @param {?string} text
     * @returns {?McText}
     */
    function exportDialogueText(text) {
        if (!text) return undefined;
        switch (textFormatSelect.value) {
            case 'literal': return text;
            case 'translate': return {translate: text};
            default: return JSON.parse(text);
        }
    }

    function detectTextFormat() {
        const texts = Object.values(dialogue.data.states).flatMap(state => [state.text, ...(state.choices?.map(choice => choice.text) ?? [])]);
        return texts.filter(it => it)
            .map(text => typeof text === 'string' ? 'literal' : (typeof text === 'object' && text.translate) ? 'translate' : 'json')
            .reduce((v1, v2) => v1 === undefined ? v2 : (v1 === v2 ? v1 : 'json'), undefined) ?? localStorage.getItem(EDITOR_TEXT_FORMAT_KEY) ?? 'literal';
    }

    function initDialogueEditor() {
        if (dialogue.data.states) {
            document.getElementById('dialogue-state-pane').hidden = false;
            for (const state of dialogue.states()) {
                appendStateToSelect(startInput, state);
            }
            const textFormat = detectTextFormat();
            textFormatSelect.querySelectorAll('option').forEach(el => el.selected = el.value === textFormat);
        } else {
            document.getElementById('dialogue-state-pane').hidden = true;
        }

        unskippableInput.checked = dialogue.unskippable();
        dialogueLayoutInputs.forEach((e) => e.checked = e.value === dialogue.layout());
        startInput.value = dialogue.startAt();
    }

    initDialogueEditor();

    const appendRow = initEditor({
        element: choiceEditor,
        rowTemplate: `
          <td class="input-cell"><input class="dialogue-choice-text-input mc-text-input" type="text" data-placeholder-literal="bla bla bla" data-placeholder-translate="mymod:dialogue.my_dialogue.{state}.bla"/></td>
          <td class="input-cell"><select class="dialogue-choice-next-input"></td>
          <td class="table-buttons"><span class="table-up"><button>🔼</button></span><span class="table-down"><button>🔽</button></span></td>
          <td class="table-buttons"><span class="table-remove"><button type="button">❌</button></span></td>
        `,
        rowInitializer: row => {
            if (!dialogue.stateData(selectedState).choices[row.rowIndex - 1]) dialogue.stateData(selectedState).choices.push({});
            row.querySelector('.dialogue-choice-text-input').addEventListener('change', e => {
                dialogue.stateData(selectedState).choices[row.rowIndex - 1].text = exportDialogueText(e.target.value);
            });
            const select = row.querySelector('.dialogue-choice-next-input');
            select.addEventListener('change', e => {
                dialogue.stateData(selectedState).choices[row.rowIndex - 1].next = e.target.value;
                dialogue.markDirty();
            });
            for (const state of dialogue.states()) {
                appendStateToSelect(select, state);
            }
            refreshMcTextPlaceholders(row);
        },
        rowSwapListener: (row, prevIdx, idx) => {
            const swap = dialogue.stateData(selectedState).choices[idx];
            dialogue.stateData(selectedState).choices[idx] = dialogue.stateData(selectedState).choices[prevIdx];
            dialogue.stateData(selectedState).choices[prevIdx] = swap;
            dialogue.markDirty();
        }
    });

    function refreshStateType() {
        const endsDialogue = dialogue.stateData(selectedState).type === 'end_dialogue';
        document.getElementById('dialogue-state-text').disabled = endsDialogue;
        document.querySelectorAll('.not-dialogue-ending').forEach(el => el.hidden = endsDialogue);
    }

    const actionTypeField = document.getElementById('dialogue-state-action-type');
    const actionValueField = document.getElementById('dialogue-state-action-value');

    function initTable(newState) {
        if (!dialogue.data.states) return;

        if (selectedState) {
            document.querySelector(`li[data-state=${selectedState}]`).classList.remove('toc-highlighted-link');
        }

        selectedState = newState;

        document.querySelector(`li[data-state=${newState}]`).classList.add('toc-highlighted-link');

        // Reset choice table content
        choiceEditor.querySelector('tbody').textContent = '';

        if (!dialogue.stateData(selectedState).choices) dialogue.stateData(selectedState).choices = [];

        for (const choice of dialogue.stateData(selectedState).choices) {
            const tr = appendRow();
            tr.querySelector('.dialogue-choice-text-input').value = importDialogueText(choice.text);
            if (choice.next) tr.querySelector('.dialogue-choice-next-input').value = choice.next;
        }

        document.querySelectorAll('input[name="dialogue-state-type"]').forEach(el => {
            const selectedType = dialogue.stateData(selectedState).type ?? 'default';
            el.checked = selectedType === el.value;
        });

        refreshStateType();
        refreshMcTextPlaceholders();
        document.getElementById('dialogue-state-text').value = importDialogueText(dialogue.stateData(selectedState).text);
        actionTypeField.querySelectorAll('option').forEach(el => el.selected = el.value === (dialogue.stateData(selectedState).action?.type ?? ''));
        actionValueField.value = dialogue.stateData(selectedState).action?.value ?? '';
        actionTypeField.dispatchEvent(new Event('change'));
    }

    (function setupStatePropertiesForm() {
        let patternErrorMessage;
        document.querySelectorAll('input[name="dialogue-state-type"]').forEach(el => {
            el.addEventListener('change', e => {
                dialogue.stateData(selectedState).type = e.target.value;
                dialogue.markDirty();
                refreshStateType();
            });
        });
        actionTypeField.addEventListener('change', e => {
            if (!dialogue.stateData(selectedState).action) dialogue.stateData(selectedState).action = {};
            dialogue.stateData(selectedState).action.type = e.target.value;
            dialogue.markDirty();
            const dataset = e.target.querySelector('option:checked').dataset;
            const placeholder = dataset.placeholder;
            actionValueField.disabled = !placeholder;
            actionValueField.placeholder = placeholder;
            actionValueField.pattern = dataset.pattern;
            patternErrorMessage = dataset.errorMessage;
        });
        actionValueField.addEventListener('change', e => {
            const action = dialogue.stateData(selectedState).action;
            if (action) {
                action.value = e.target.value;
                dialogue.markDirty();
            }
        });
        actionValueField.addEventListener('input', () => {
            if (actionValueField.validity.patternMismatch && patternErrorMessage) {
                actionValueField.setCustomValidity(patternErrorMessage);
                actionValueField.reportValidity();
            } else {
                actionValueField.setCustomValidity('');
            }
        });
        document.getElementById('dialogue-state-text').addEventListener('change', e => {
                dialogue.stateData(selectedState).text = exportDialogueText(e.target.value);
                dialogue.markDirty();
            }
        );
    })();

    textFormatSelect.addEventListener('change', () => {
        document.getElementById('raw-text-tip').hidden = textFormatSelect.value !== 'json';
        document.querySelectorAll('.mc-text-input').forEach(el => {
            el.dispatchEvent(new Event('change'));
        });
        refreshMcTextPlaceholders();
    });

    function appendStateToList(state) {
        const li = document.createElement('li');
        li.dataset.state = state;
        const a = document.createElement('a');
        a.href = `#${state}`;
        a.textContent = state;

        a.addEventListener('click', () => {
            initTable(state);
        });

        li.append(a);
        stateList.append(li);
    }

    function appendStateToSelect(select, state) {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        select.appendChild(option);
    }

    function appendState(state) {
        appendStateToList(state);
        for (const select of document.querySelectorAll('.dialogue-next-input')) {
            appendStateToSelect(select, state);
        }
        appendStateToSelect(startInput, state);

        if (!selectedState) {
            initTable(state);
            document.getElementById('dialogue-state-pane').hidden = false;
            exportButton.disabled = false;
            startInput.disabled = false;
            startInput.dispatchEvent(new Event('change'));
        }
    }

    function resetStateList() {
        stateList.textContent = '';
        for (const state of dialogue.states()) {
            appendState(state);
        }
    }

    (function setupNewStateForm() {
        const stateNameField = document.getElementById('new_dialogue_state_name');
        setupFieldNameValidation(stateNameField, dialogue, true);

        document.getElementById('new_dialogue_state').addEventListener('submit', e => {
            const log = document.getElementById('new_dialogue_state_log');
            if (!dialogue.data.states) dialogue.data.states = {};

            if (validateIdentifierField(stateNameField)) {
                log.textContent = '';
                const newState = stateNameField.value;
                dialogue.data.states[newState] = {
                    text: '',
                    choices: [],
                };
                appendState(newState);
                stateNameField.value = '';
            }
            e.preventDefault();
        });
    })();

    function loadDialogueData(newSelectedState) {
        selectedState = undefined;
        startInput.textContent = '';
        document.getElementById('dialogue-filename').textContent = dialogue.filename;
        initDialogueEditor();
        resetStateList();
        initTable(newSelectedState ?? dialogue.startAt());
        if (newSelectedState) document.querySelector('.wiki-container').scrollIntoView({behavior: 'smooth'});
    }

    document.getElementById('dialogue-view-toggle').addEventListener('click', () => {
        storeDialogueToSession(dialogue, selectedState);
        dialogue.unload();
        window.location.replace('./graph-view');
    });

    commonDialogueInit(dialogue, loadDialogueData);
})();
