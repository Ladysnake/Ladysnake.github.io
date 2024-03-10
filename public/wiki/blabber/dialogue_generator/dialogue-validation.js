function validateStructure(dialogue, logWarning, logError) {
    const ancestors = {};
    const waitList = new Set();
    const unvalidated = new Set();

    for (const state of dialogue.states()) {
        if (dialogue.stateData(state).type === 'end_dialogue') {
            waitList.add(state);
        } else if (!dialogue.stateData(state).choices) {
            logError(`${state} has no available choices but is not an end state`);
        } else {
            unvalidated.add(state);
            for (const {next} of dialogue.stateData(state).choices) {
                if (!ancestors[next]) ancestors[next] = new Set();
                ancestors[next].add(state);
            }
        }
    }

    while (waitList.size) {
        const [state] = waitList;
        waitList.delete(state);

        if (ancestors[state]) {
            for (const ancestor of ancestors[state]) {
                if (unvalidated.delete(ancestor)) {
                    waitList.add(ancestor);
                }
            }
        } else if (state !== dialogue.startAt()) {
            logWarning(`${state} is unreachable`);
        }
    }

    for (const bad of unvalidated) {
        let log;
        if (bad !== dialogue.startAt() && !ancestors[bad]) {
            // Unreachable states do not cause infinite loops, but we still want to be aware of them
            logWarning(`${bad} is unreachable`);
            log = logWarning;
        } else {
            log = logError;
        }
        log(`${bad} does not have any path to the end of the dialogue`);
    }
}

export function validateDialogue(dialogue, logError, logWarning) {
    let warnings = [];
    let errors = [];
    try {
        validateStructure(dialogue, w => warnings.push(w), e => errors.push(e));
    } catch (e) {
        console.error(e);
        errors.push(e.message);
    }
    if (warnings.length) logWarning(`There ${warnings.length > 1 ? `were ${warnings.length} warnings` : 'was a warning'}: ${warnings.join('; ')}`);
    if (errors.length) {
        logError(`There ${errors.length > 1 ? `were ${errors.length} errors` : 'was an error'}: ${errors.join('; ')}`);
        return false;
    }
    return true;
}
