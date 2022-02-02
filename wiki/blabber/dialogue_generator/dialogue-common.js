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
    if (selected) sessionStorage.setItem('blabber_selected_state', selected);
}

/**
 *
 * @returns {{data: ?DialogueData, selected: ?string}}
 */
export function loadDialogueFromSession() {
    const serialized = sessionStorage.getItem('blabber_open_dialogue');
    const selected = sessionStorage.getItem('blabber_selected_state');
    if (!serialized) return null;
    try {
        return {data: JSON.parse(serialized), selected};
    } catch (e) {
        console.error(e);
        logIoError(`Failed to restore your data: ${e.message}`);
    } finally {
        sessionStorage.removeItem('blabber_open_dialogue');
        sessionStorage.removeItem('blabber_selected_state');
    }
}

export function setupDialogueIo(dialogue, loadData) {
    function loadDialogueFile(file) {
        if (!file.type.startsWith('application/json')) {
            logIoError(`${file.name} is not a valid JSON file`);
            return;
        }
        const reader = new FileReader();
        reader.addEventListener('load', le => {
            try {
                clearIoLogs();
                const d = JSON.parse(reader.result);
                if (!d.states) {
                    logIoError(`${file.name} is missing dialogue state data`);
                } else {
                    loadData(d);
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

    document.getElementById('dialogue-export').addEventListener('click', () => {
        clearIoLogs();
        if (validateDialogue(dialogue, logIoError, logIoWarning)) {
            saveAs(new Blob([JSON.stringify(dialogue.data, null, 2)], {type: 'application/json'}), 'my-dialogue.json');
        }
    });

    window.addEventListener('beforeunload', function (e) {
        if (dialogue.data.states) {
            // Cancel the event
            e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
            // Chrome requires returnValue to be set
            e.returnValue = '';
        }
    });
}
