import type BlabberDialogue from "./BlabberDialogue";

export function validateIdentifierField(element: HTMLInputElement, dialogue?: BlabberDialogue, acceptEmpty?: boolean) {
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

function validateStructure(dialogue: BlabberDialogue, logWarning: (msg: string) => void, logError: (msg: string) => void) {
  const ancestors: Record<string, Set<string>> = {};
  const waitList: Set<string> = new Set();
  const unvalidated: Set<string> = new Set();

  for (const [state, { type, choices }] of dialogue.states) {
    if (type === 'end_dialogue') {
      waitList.add(state);
    } else if (!choices) {
      logError(`${state} has no available choices but is not an end state`);
    } else {
      unvalidated.add(state);
      for (const {next} of choices) {
        if (!next) continue;
        if (!ancestors[next]) ancestors[state] = new Set();
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
    } else if (state !== dialogue.startAt) {
      logWarning(`${state} is unreachable`);
    }
  }

  for (const bad of unvalidated) {
    let log;
    if (bad !== dialogue.startAt && !ancestors[bad]) {
      // Unreachable states do not cause infinite loops, but we still want to be aware of them
      logWarning(`${bad} is unreachable`);
      log = logWarning;
    } else {
      log = logError;
    }
    log(`${bad} does not have any path to the end of the dialogue`);
  }
}

export function validateDialogue(dialogue: BlabberDialogue, logWarning: (msg: string) => void, logError: (msg: string) => void) {
  let warnings: string[] = [];
  let errors: string[] = [];
  try {
    validateStructure(dialogue, w => warnings.push(w), e => errors.push(e));
  } catch (e: any) {
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
