(() => {
    let data = {};

    document.getElementById('dialogue-editor').hidden = false;

    const exportButton = document.getElementById('dialogue-export');
    const startInput = document.getElementById('dialogue-start-at');
    const unskippableInput = document.getElementById('dialogue-unskippable');
    const choiceEditor = document.querySelector('.dialogue-choice-editor');
    const stateList = document.getElementById('dialogue-state-list');

    let selectedState = data.start_at;

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
            for (const state in data.states) {
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
            for (const state in data.states) {
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

    function initTable(newState) {
        if (!data.states) return;

        if (selectedState) {
            document.querySelector(`li[data-state=${selectedState}]`).classList.remove('toc-highlighted-link');
        }

        selectedState = newState;

        document.querySelector(`li[data-state=${newState}]`).classList.add('toc-highlighted-link');

        for (let choice of data.states[selectedState].choices ?? []) {
            const tr = appendRow();
            tr.querySelector('.dialogue-choice-text-input').value = importDialogueText(choice.text);
            if (choice.next) tr.querySelector('.dialogue-next-input').value = choice.next;
        }

        document.querySelectorAll('input[name="dialogue-state-type"]').forEach(el => {
            const selectedType = data.states[selectedState].type ?? 'default';
            el.checked = selectedType === el.value;
        });

        refreshStateType();
        refreshMcTextPlaceholders();
        document.getElementById('dialogue-state-text').value = importDialogueText(data.states[selectedState].text);
        const actionTypeField = document.getElementById('dialogue-state-action-type');
        actionTypeField.querySelectorAll('option').forEach(el => el.selected = el.value === (data.states[selectedState].action?.type ?? ''));
        document.getElementById('dialogue-state-action-value').value = data.states[selectedState].action?.value ?? '';
        actionTypeField.dispatchEvent(new Event('change'));
    }

    function resetTable(newState) {
        choiceEditor.querySelector('tbody').textContent = '';
        initTable(newState);
    }

    document.querySelectorAll('input[name="dialogue-state-type"]').forEach(el => {
        el.addEventListener('change', e => {
            data.states[selectedState].type = e.target.value;
            refreshStateType();
        });
    });
    document.getElementById('dialogue-state-action-type').addEventListener('change', e => {
        data.states[selectedState].action = {
            type: e.target.value
        };
        const actionValueField = document.getElementById('dialogue-state-action-value');
        const placeholder = e.target.querySelector('option:checked').dataset.placeholder;
        actionValueField.disabled = !placeholder;
        actionValueField.placeholder = placeholder;
    });
    document.getElementById('dialogue-state-action-value').addEventListener('change', e => {
        const action = data.states[selectedState].action;
        if (action) action.value = e.target.value;
    });
    document.getElementById('dialogue-state-text').addEventListener('change', e =>
        data.states[selectedState].text = exportDialogueText(e.target.value)
    );
    textFormatSelect.addEventListener('change', () => {
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
            resetTable(state);
        });

        li.append(a);
        stateList.append(li);

        if (!selectedState) {
            initTable(state);
            document.getElementById('dialogue-state-pane').hidden = false;
            exportButton.disabled = false;
            startInput.disabled = false;
        }
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
    }

    function initStateList() {
        for (const state in data.states) {
            appendStateToList(state);
        }
    }

    function resetStateList() {
        stateList.textContent = '';
        initStateList();
    }

    initStateList();

    const submitNewState = () => {
        const input = document.getElementById('new_dialogue_state_name');
        const log = document.getElementById('new_dialogue_state_log');
        if (!data.states) data.states = {};

        if (!input.value) {
            log.textContent = 'Enter a name for the new state';
        } else if (input.value in data.states) {
            log.textContent = 'A state with that name already exists';
        } else {
            log.textContent = '';
            const newState = input.value;
            data.states[newState] = {
                text: '',
                choices: [],
            };
            appendState(newState);
            input.value = '';
        }
    };

    document.getElementById('new_dialogue_state_name').addEventListener('keydown', e => {
        if (e.code === 'Enter') {
            submitNewState();
        }
    });
    document.getElementById('new_dialogue_state_submit').addEventListener('click', submitNewState);

    function loadData() {
        startInput.textContent = '';
        selectedState = data.start_at;
        initDialogueEditor();
        resetStateList();
        resetTable(selectedState);
    }

    document.getElementById('dialogue-import').addEventListener('change', e => {
        const curFiles = e.target.files;
        const log = document.getElementById('dialogue-global-log');
        if(curFiles.length === 0) {
            log.textContent = 'No files currently selected for upload';
        } else {
            const file = curFiles[0];
            if (!file.type.startsWith('application/json')) {
                log.textContent = `${file.name} is not a valid JSON file`;
                return;
            }
            const reader = new FileReader();
            reader.addEventListener('load', le => {
                data = JSON.parse(le.target.result);
                loadData();
            });
            reader.readAsText(file);
        }
    });

    exportButton.addEventListener('click', () => {
        saveAs(new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'}), 'my-dialogue.json');
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
