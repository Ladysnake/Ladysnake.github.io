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
