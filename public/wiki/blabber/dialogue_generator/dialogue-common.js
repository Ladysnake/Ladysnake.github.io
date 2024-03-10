import {validateDialogue} from "./dialogue-validation.js";

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

/**
 *
 * @param {BlabberDialogue} dialogue
 * @param {string=} selected
 */
export function storeDialogueToSession(dialogue, selected) {
    sessionStorage.setItem('blabber_open_dialogue', JSON.stringify(dialogue.data));
    if (dialogue.filename) sessionStorage.setItem('blabber_filename', dialogue.filename);
    if (selected) sessionStorage.setItem('blabber_selected_state', selected);
}

/**
 *
 * @param {BlabberDialogue} dialogue
 * @param callback
 * @returns {boolean}
 */
function loadDialogueFromSession(dialogue, callback) {
    const serialized = sessionStorage.getItem('blabber_open_dialogue');
    const selected = sessionStorage.getItem('blabber_selected_state');
    const filename = sessionStorage.getItem('blabber_filename');

    if (serialized) {
        try {
            dialogue.data = JSON.parse(serialized);
            dialogue.filename = filename;
            callback(selected);
            return true;
        } catch (e) {
            console.error(e);
            logIoError(`Failed to restore your data: ${e.message}`);
        } finally {
            sessionStorage.removeItem('blabber_open_dialogue');
            sessionStorage.removeItem('blabber_selected_state');
        }
    }

    return false;
}

/**
 *
 * @param {HTMLInputElement} element
 * @param {BlabberDialogue} [dialogue]
 * @param {boolean} [acceptEmpty]
 * @returns {boolean}
 */
export function validateIdentifierField(element, dialogue, acceptEmpty) {
    if (!(acceptEmpty || element.value)) {
        element.setCustomValidity('Please enter a valid non-namespaced identifier');
    } else if (element.validity.patternMismatch) {
        element.setCustomValidity('Must be a valid non-namespaced identifier (lowercase letters, numbers and dashes/underscores only)');
    } else if (dialogue && dialogue.data.states && element.value in dialogue.data.states) {
        element.setCustomValidity('A state with that name already exists');
    } else {
        element.setCustomValidity('');
        element.reportValidity();
        return true;
    }
    element.reportValidity();
    return false;
}

/**
 *
 * @param {HTMLInputElement} stateNameField
 * @param {BlabberDialogue} [dialogue]
 * @param {boolean} [acceptEmpty]
 */
export function setupFieldNameValidation(stateNameField, dialogue, acceptEmpty) {
    stateNameField.addEventListener('input', e => {
        validateIdentifierField(e.target, dialogue, acceptEmpty);
    });
}

export const EDITOR_TEXT_FORMAT_KEY = 'blabber-editor-text-format';

export function commonDialogueInit(dialogue, loadDataCallback) {
    setupDialogueIo(dialogue, loadDataCallback);

    const historyCallback = ({state}) => {
        if (state) loadDataCallback(state.data, state.selected);
    }

    window.addEventListener('popstate', historyCallback);

    if (!loadDialogueFromSession(dialogue, loadDataCallback)) {
        const pageAccessedByReload = (
            (window.performance.navigation && window.performance.navigation.type === 1) ||
            window.performance
                .getEntriesByType('navigation')
                .map((nav) => nav.type)
                .includes('reload')
        );
        // Reloading the page should reset the dialogue
        if (pageAccessedByReload) {
            if (window.history.state?.data?.states) window.history.pushState({data: {}}, '');
        } else {
            historyCallback(history);
        }
    }

    window.addEventListener('beforeunload', function (e) {
        if (dialogue.isLoaded()) {
            // Cancel the event
            e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
            // Chrome requires returnValue to be set
            e.returnValue = '';
        }
    });

    const dialogueFilename = document.getElementById('dialogue-filename');
    dialogueFilename?.addEventListener('keydown', (e) => {
        if (e.key.indexOf('Enter') >= 0) {
            e.preventDefault();
            e.target.blur();
        }
    });
    dialogueFilename?.addEventListener('beforeinput', (e) => {
        setTimeout(() => {
            if (e.target.innerHTML !== e.target.textContent) {
                e.target.innerHTML = e.target.textContent
            }
        })
    });
    dialogueFilename?.addEventListener('blur', (e) => {
        dialogue.filename = e.target.textContent;
    })
}

/**
 *
 * @param {BlabberDialogue} dialogue
 * @param loadData
 */
function setupDialogueIo(dialogue, loadData) {
    function loadDialogueFile(file) {
        if (!file.type.startsWith('application/json')) {
            logIoError(`${file.name} is not a valid JSON file`);
            return;
        }
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            try {
                clearIoLogs();
                const d = JSON.parse(reader.result);
                if (!d.states) {
                    logIoError(`${file.name} is missing dialogue state data`);
                } else {
                    // You can go back to the previous dialogue after loading a new one!
                    if (dialogue.isLoaded()) window.history.pushState(null, '');

                    dialogue.data = d;
                    dialogue.filename = file.name.endsWith('.json') ? file.name.substring(0, file.name.length - 5) : file.name;
                    loadData();
                    logIoInfo(`Loaded dialogue from ${file.name}`);
                    dialogue.markDirty();
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

    document.getElementById('dialogue-export')?.addEventListener('click', () => {
        clearIoLogs();
        if (validateDialogue(dialogue, logIoError, logIoWarning)) {
            dialogue.prune();
            saveAs(new Blob([JSON.stringify(dialogue.data, null, 2)], {type: 'application/json'}), dialogue.filename + '.json');
        }
    });
}
