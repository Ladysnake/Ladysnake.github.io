import type BlabberDialogue from "./BlabberDialogue";

function toOrdinal(n: number) {
  if (n % 10 == 1 && n % 100 != 11) {
    return n + 'st';
  } else if (n % 10 == 2 && n % 100 != 12) {
    return n + 'nd';
  } else if (n % 10 == 3 && n % 100 != 13) {
    return n + 'rd';
  } else {
    return n + 'th';
  }
}

function validateStructure(dialogue: BlabberDialogue, logWarning: (msg: string) => void, logError: (msg: string) => void) {
  const ancestors: Record<string, Set<string>> = {};
  const waitList: Set<string> = new Set();
  const unvalidated: Set<string> = new Set();

  for (const [state, { type, choices }] of Object.entries(dialogue.states)) {
    if (type === 'end_dialogue') {
      waitList.add(state);
    } else if (!choices) {
      logError(`State "${state}" has no available choices but is not an end state`);
    } else {
      unvalidated.add(state);
      let missingText = [];
      for (let i = 0; i < choices.length; i++){
        const { next, text } = choices[i];
        if (!text || (typeof text === "string" && !text.length)) missingText.push(i);
        if (!next) continue;
        if (!ancestors[next]) ancestors[next] = new Set();
        ancestors[next].add(state);
      }
      if (missingText.length) {
        const invalidChoices = missingText.map(toOrdinal);
        if (missingText.length > 1) {
          logError(`${invalidChoices.join(', ')} choices in state "${state}" have no text`);
        } else {
          logError(`${invalidChoices[0]} choice in state "${state}" has no text`);
        }
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
      logWarning(`State "${state}" is unreachable`);
    }
  }

  for (const bad of unvalidated) {
    let log;
    if (bad !== dialogue.startAt && !ancestors[bad]) {
      // Unreachable states do not cause infinite loops, but we still want to be aware of them
      logWarning(`State "${bad}" is unreachable`);
      log = logWarning;
    } else {
      log = logError;
    }
    log(`State "${bad}" does not have any path to the end of the dialogue`);
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
