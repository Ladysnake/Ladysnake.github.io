import {validateDialogue} from "./dialogue-validation.js";

(() => {
    let data = {};

    document.getElementById('dialogue-editor').hidden = false;

    const exportButton = document.getElementById('dialogue-export');
    const startInput = document.getElementById('dialogue-start-at');
    const unskippableInput = document.getElementById('dialogue-unskippable');
    const choiceEditor = document.querySelector('.dialogue-choice-editor');
    const stateList = document.getElementById('dialogue-state-list');

    let selectedState;

    exportButton.disabled = true;
    startInput.disabled = true;
    startInput.addEventListener('change', e => data.start_at = e.target.value);
    unskippableInput.addEventListener('change', e => data.unskippable = e.target.value);

    const textFormatSelect = document.getElementById('dialogue-text-format');

    function refreshMcTextPlaceholders(parent = document) {
        parent.querySelectorAll('.mc-text-input').forEach(el => {
            el.placeholder = (el.dataset[`placeholder${textFormatSelect.value.charAt(0).toUpperCase()}${textFormatSelect.value.substring(1)}`] ?? '').replaceAll('{state}', selectedState);
        });
    }

    function importDialogueText(text) {
        if (!text) return '';
        switch (textFormatSelect.value) {
            case 'literal': return text;
            case 'translate': return text.translate;
            default: return JSON.stringify(text);
        }
    }

    function exportDialogueText(text) {
        if (!text) return undefined;
        switch (textFormatSelect.value) {
            case 'literal': return text;
            case 'translate': return {translate: text};
            default: return JSON.parse(text);
        }
    }

    function detectTextFormat() {
        const texts = Object.values(data.states).flatMap(state => [state.text, ...(state.choices?.map(choice => choice.text) ?? [])]);
        return texts.filter(it => it).map(text => typeof text === 'string' ? 'literal' : (typeof text === 'object' && text.translate) ? 'translate' : 'json').reduce((v1, v2) => v1 === v2 ? v1 : 'json') ?? 'literal';
    }

    function initDialogueEditor() {
        if (data.states) {
            document.getElementById('dialogue-state-pane').hidden = false;
            for (const state of Object.keys(data.states)) {
                appendStateToSelect(startInput, state);
            }
            const textFormat = detectTextFormat();
            textFormatSelect.querySelectorAll('option').forEach(el => el.selected = el.value === textFormat);
        } else {
            document.getElementById('dialogue-state-pane').hidden = true;
        }

        unskippableInput.checked = data.unskippable;
        startInput.value = data.start_at;
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
            if (!data.states[selectedState].choices[row.rowIndex - 1]) data.states[selectedState].choices.push({});
            row.querySelector('.dialogue-choice-text-input').addEventListener('change', e => {
                data.states[selectedState].choices[row.rowIndex - 1].text = exportDialogueText(e.target.value);
            });
            const select = row.querySelector('.dialogue-choice-next-input');
            select.addEventListener('change', e => data.states[selectedState].choices[row.rowIndex - 1].next = e.target.value);
            for (const state of Object.keys(data.states)) {
                appendStateToSelect(select, state);
            }
            refreshMcTextPlaceholders(row);
        },
        rowSwapListener: (row, prevIdx, idx) => {
            const swap = data.states[selectedState].choices[idx];
            data.states[selectedState].choices[idx] = data.states[selectedState].choices[prevIdx];
            data.states[selectedState].choices[prevIdx] = swap;
        }
    });

    function refreshStateType() {
        const endsDialogue = data.states[selectedState].type === 'end_dialogue';
        document.getElementById('dialogue-state-text').disabled = endsDialogue;
        document.querySelectorAll('.not-dialogue-ending').forEach(el => el.hidden = endsDialogue);
    }

    const actionTypeField = document.getElementById('dialogue-state-action-type');
    const actionValueField = document.getElementById('dialogue-state-action-value');

    function initTable(newState) {
        if (!data.states) return;

        if (selectedState) {
            document.querySelector(`li[data-state=${selectedState}]`).classList.remove('toc-highlighted-link');
        }

        selectedState = newState;

        document.querySelector(`li[data-state=${newState}]`).classList.add('toc-highlighted-link');

        // Reset choice table content
        choiceEditor.querySelector('tbody').textContent = '';

        if (!data.states[selectedState].choices) data.states[selectedState].choices = [];

        for (let choice of data.states[selectedState].choices) {
            const tr = appendRow();
            tr.querySelector('.dialogue-choice-text-input').value = importDialogueText(choice.text);
            if (choice.next) tr.querySelector('.dialogue-choice-next-input').value = choice.next;
        }

        document.querySelectorAll('input[name="dialogue-state-type"]').forEach(el => {
            const selectedType = data.states[selectedState].type ?? 'default';
            el.checked = selectedType === el.value;
        });

        refreshStateType();
        refreshMcTextPlaceholders();
        document.getElementById('dialogue-state-text').value = importDialogueText(data.states[selectedState].text);
        actionTypeField.querySelectorAll('option').forEach(el => el.selected = el.value === (data.states[selectedState].action?.type ?? ''));
        actionValueField.value = data.states[selectedState].action?.value ?? '';
        actionTypeField.dispatchEvent(new Event('change'));
    }

    (function setupStatePropertiesForm() {
        let patternErrorMessage;
        document.querySelectorAll('input[name="dialogue-state-type"]').forEach(el => {
            el.addEventListener('change', e => {
                data.states[selectedState].type = e.target.value;
                refreshStateType();
            });
        });
        actionTypeField.addEventListener('change', e => {
            if (!data.states[selectedState].action) data.states[selectedState].action = {};
            data.states[selectedState].action.type = e.target.value;
            const dataset = e.target.querySelector('option:checked').dataset;
            const placeholder = dataset.placeholder;
            actionValueField.disabled = !placeholder;
            actionValueField.placeholder = placeholder;
            actionValueField.pattern = dataset.pattern;
            patternErrorMessage = dataset.errorMessage;
        });
        actionValueField.addEventListener('change', e => {
            const action = data.states[selectedState].action;
            if (action) action.value = e.target.value;
        });
        actionValueField.addEventListener('input', () => {
            if (actionValueField.validity.patternMismatch && patternErrorMessage) {
                actionValueField.setCustomValidity(patternErrorMessage);
                actionValueField.reportValidity();
            } else {
                actionValueField.setCustomValidity('');
            }
        });
        document.getElementById('dialogue-state-text').addEventListener('change', e =>
            data.states[selectedState].text = exportDialogueText(e.target.value)
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
        for (const state of Object.keys(data.states)) {
            appendState(state);
        }
    }

    (function setupNewStateForm() {
        const stateNameField = document.getElementById('new_dialogue_state_name');

        stateNameField.addEventListener('input', e => {
            if (e.target.validity.patternMismatch) {
                e.target.setCustomValidity('Must be a valid non-namespaced identifier (lowercase letters, numbers and dashes/underscores only)');
            } else if (data.states && stateNameField.value in data.states) {
                stateNameField.setCustomValidity('A state with that name already exists');
            } else {
                e.target.setCustomValidity('');
            }
            e.target.reportValidity();
        });

        document.getElementById('new_dialogue_state').addEventListener('submit', e => {
            const log = document.getElementById('new_dialogue_state_log');
            if (!data.states) data.states = {};

            if (!stateNameField.value) {
                stateNameField.setCustomValidity('Please enter a valid non-namespaced identifier');
                stateNameField.reportValidity();
            } else if (stateNameField.value in data.states) {
                stateNameField.setCustomValidity('A state with that name already exists');
                stateNameField.reportValidity();
            } else {
                log.textContent = '';
                const newState = stateNameField.value;
                data.states[newState] = {
                    text: '',
                    choices: [],
                };
                appendState(newState);
                stateNameField.value = '';
            }
            e.preventDefault();
        });
    })();

    function loadData() {
        selectedState = undefined;
        startInput.textContent = '';
        initDialogueEditor();
        resetStateList();
        initTable(data.start_at);
    }

    const ioInfoElement = document.querySelector('.dialogue-io-log.info-log');
    const ioWarningElement = document.querySelector('.dialogue-io-log.warning-log');
    const ioErrorElement = document.querySelector('.dialogue-io-log.error-log');
    const logIoInfo = text => ioInfoElement.textContent = text;
    const logIoWarning = text => ioWarningElement.textContent = text;
    const logIoError = text => ioErrorElement.textContent = text;
    const clearIoLogs = () => {
        ioErrorElement.textContent = '';
        ioInfoElement.textContent = '';
        ioWarningElement.textContent = '';
    }

    function loadDialogueFile(file) {
        if (!file.type.startsWith('application/json')) {
            logIoError(`${file.name} is not a valid JSON file`);
            return;
        }
        const reader = new FileReader();
        reader.addEventListener('load', le => {
            try {
                clearIoLogs();
                const d = JSON.parse(le.target.result);
                if (!d.states) {
                    logIoError(`${file.name} is missing dialogue state data`);
                } else {
                    data = d;
                    loadData();
                    logIoInfo(`Loaded dialogue from ${file.name}`);
                }
            } catch (err) {
                console.error(err);
                logIoError(`Failed to read ${file.name}: ${err.message}`);
            }
        });
        reader.readAsText(file);
    }

    document.getElementById('dialogue-import').addEventListener('change', e => {
        const curFiles = e.target.files;
        if(curFiles.length === 0) {
            logIoError('No files currently selected for upload');
        } else {
            loadDialogueFile(curFiles[0]);
        }
    });

    (function setupDragAndDrop() {
        const importArea = document.querySelector('#dialogue-import-export');
        const importAreaDropZone = importArea.querySelector('.drop-zone');

        let draggingInWindow = 0;
        let draggingInDropZone = 0;

        importArea.addEventListener('drop', (e) => {
            e.preventDefault();
            try {
                if (e.dataTransfer.items && e.dataTransfer.items.length) {
                    // If dropped items aren't files, reject them
                    if (e.dataTransfer.items[0].kind === 'file') {
                        loadDialogueFile(e.dataTransfer.items[0].getAsFile());
                    }
                } else if (e.dataTransfer.files.length) {
                    // Use DataTransfer interface to access the file(s)
                    loadDialogueFile(e.dataTransfer.files[0])
                }
            } finally {
                importAreaDropZone.classList.remove('active', 'hovered');
                draggingInWindow = 0;
                draggingInDropZone = 0;
            }
        });
        document.body.addEventListener('dragenter', (e) => {
            if (!(draggingInWindow++)) {
                importAreaDropZone.classList.add('active');
            }
            if (e.target.classList.contains('drop-zone') && !(draggingInDropZone++)) {
                importAreaDropZone.classList.add('hovered');
            }
        });
        document.body.addEventListener('dragleave', (e) => {
            if (!(--draggingInWindow)) {
                importAreaDropZone.classList.remove('active');
            }
            if (e.target.classList.contains('drop-zone') && !(--draggingInDropZone)) {
                importAreaDropZone.classList.remove('hovered');
            }
        });
        importAreaDropZone.addEventListener('dragover', (e) => e.preventDefault());
    })();

    exportButton.addEventListener('click', () => {
        clearIoLogs();
        if (validateDialogue(data, logIoError, logIoWarning)) {
            saveAs(new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'}), 'my-dialogue.json');
        }
    });

    window.addEventListener('beforeunload', function (e) {
        if (data.states) {
            // Cancel the event
            e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
            // Chrome requires returnValue to be set
            e.returnValue = '';
        }
    });
})();
