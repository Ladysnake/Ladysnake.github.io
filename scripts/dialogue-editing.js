let data = {
    start_at: 'a',
    states: {
        a: {
            text: 'aaa',
            choices: [
                {
                    'text': 'bbb',
                    'next': 'b',
                },
                {
                    'text': 'ccc',
                    'next': 'c',
                }
            ]
        },
        b: {
            text: 'bbb',
            choices: []
        },
        c: {
            text: 'ccc',
            choices: []
        }
    }
};

(() => {

    const choiceEditor = document.querySelector('.dialogue-choice-editor');
    const startInput = document.getElementById('dialogue-start-at');
    const stateList = document.getElementById('dialogue-state-list');

    let selectedState = data.start_at;

    function importDialogueText(text) {
        if (!text) return '';
        switch (document.getElementById('dialogue-text-format').value) {
            case 'literal': return text;
            case 'translate': return text.translate;
            default: return JSON.stringify(text);
        }
    }

    function exportDialogueText(text) {
        if (!text) return undefined;
        switch (document.getElementById('dialogue-text-format').value) {
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
        for (const state in data.states) {
            appendStateToSelect(startInput, state);
        }
        document.getElementById('dialogue-unskippable').checked = data.unskippable;
        document.getElementById('dialogue-start-at').value = data.start_at;
        const textFormat = detectTextFormat();
        document.getElementById('dialogue-text-format').querySelectorAll('option').forEach(el => el.selected = el.value === textFormat);
    }

    initDialogueEditor();

    const appendRow = initEditor({
        element: choiceEditor,
        rowTemplate: `
          <td class="input-cell"><input class="dialogue-choice-text-input mc-text-input" type="text" placeholder="bla bla bla"/></td>
          <td class="input-cell"><select class="dialogue-next-input"></td>
          <td class="table-buttons"><span class="table-up"><button>🔼</button></span><span class="table-down"><button>🔽</button></span></td>
          <td class="table-buttons"><span class="table-remove"><button type="button">❌</button></span></td>
        `,
        rowInitializer: row => {
            if (!data.states[selectedState].choices[row.rowIndex - 1]) data.states[selectedState].choices.push({});
            row.querySelector('.dialogue-choice-text-input').addEventListener('change', e => {
                data.states[selectedState].choices[row.rowIndex - 1].text = exportDialogueText(e.target.value);
            });
            const select = row.querySelector('.dialogue-next-input');
            for (const state in data.states) {
                appendStateToSelect(select, state);
            }
        },
        rowSwapListener: (row, prevIdx, idx) => {
            const swap = data.states[selectedState].choices[idx];
            data.states[selectedState].choices[idx] = data.states[selectedState].choices[prevIdx];
            data.states[selectedState].choices[prevIdx] = swap;
        }
    });

    function initTable(newState) {
        selectedState = newState;

        for (let choice of data.states[selectedState].choices ?? []) {
            const tr = appendRow();
            tr.querySelector('.dialogue-choice-text-input').value = importDialogueText(choice.text);
            if (choice.next) tr.querySelector('.dialogue-next-input').value = choice.next;
        }

        document.querySelectorAll('input[name="dialogue-state-type"]').forEach(el => {
            const selectedType = data.states[selectedState].type ?? 'default';
            el.checked = selectedType === el.value;
        });

        const stateTextField = document.getElementById('dialogue-state-text');
        stateTextField.disabled = data.states[selectedState].type === 'end_dialogue';
        stateTextField.value = importDialogueText(data.states[selectedState].text);
        const actionTypeField = document.getElementById('dialogue-state-action-type');
        actionTypeField.querySelectorAll('option').forEach(el => el.selected = el.value === (data.states[selectedState].action?.type ?? ''));
        const actionValueField = document.getElementById('dialogue-state-action-value');
        actionValueField.value = data.states[selectedState].action?.value ?? '';
        actionValueField.disabled = !actionTypeField.value;
    }

    function resetTable(newState) {
        choiceEditor.querySelector('tbody').textContent = '';
        initTable(newState);
    }

    initTable(selectedState);

    document.querySelectorAll('input[name="dialogue-state-type"]').forEach(el => {
        el.addEventListener('change', e => {
            data.states[selectedState].type = e.target.value;
            document.getElementById('dialogue-state-text').disabled = e.target.value === 'end_dialogue';
        });
    });
    document.getElementById('dialogue-state-action-type').addEventListener('change', e => {
        data.states[selectedState].action = {
            type: e.target.value
        };
        document.getElementById('dialogue-state-action-value').disabled = !e.target.value;
    });
    document.getElementById('dialogue-state-action-value').addEventListener('change', e => {
        const action = data.states[selectedState].action;
        if (action) action.value = e.target.value;
    });
    document.getElementById('dialogue-state-text').addEventListener('change', e =>
        data.states[selectedState].text = exportDialogueText(e.target.value)
    );
    document.getElementById('dialogue-text-format').addEventListener('change', () => document.querySelectorAll('.mc-text-input').forEach(el => el.dispatchEvent(new Event('change'))));

    function appendStateToList(state) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${state}`;
        a.textContent = state;

        a.addEventListener('click', () => {
            resetTable(state);
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
        document.getElementById('dialogue-start-at').textContent = '';
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

    document.getElementById('dialogue-export').addEventListener('click', () => {
        saveAs(new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'}), 'my-dialogue.json');
    });

    window.addEventListener('beforeunload', function (e) {
        // Cancel the event
        e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        // Chrome requires returnValue to be set
        e.returnValue = '';
    });
})();
