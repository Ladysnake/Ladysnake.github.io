import type BlabberDialogue from "../model/BlabberDialogue";
import {
  ConditionalSoftLock,
  NoChoiceError,
  NoTextError, SoftLockError,
  StrandedWarning,
  UnreachableWarning,
  ValidationError,
  ValidationWarning
} from "./ValidationResult";

enum Reachability {
  NONE,
  CONDITIONAL,
  PROVEN,
}

function validateStructure(dialogue: BlabberDialogue, warnings: ValidationWarning[], errors: ValidationError[]) {
  const parents: Record<string, Record<string, Reachability>> = {};
  const waitList: Set<string> = new Set();
  const unvalidated: Record<string, Reachability> = {};

  for (const [state, { type, choices }] of Object.entries(dialogue.states)) {
    if (type === 'end_dialogue') {
      waitList.add(state);
    } else if (!choices?.length) {
      errors.push(new NoChoiceError(state));
    } else {
      unvalidated[state] = Reachability.NONE;
      let missingText = [];

      for (let i = 0; i < choices.length; i++){
        const { next, text, condition } = choices[i];
        if (!text || (typeof text === "string" && !text.length)) missingText.push(i);
        if (!next) continue;
        if (!parents[next]) parents[next] = {};
        parents[next][state] = condition?.predicate ? Reachability.CONDITIONAL : Reachability.PROVEN;
      }

      if (missingText.length) {
        errors.push(new NoTextError(state, missingText));
      }
    }
  }

  while (waitList.size) {
    const [state] = waitList;
    waitList.delete(state);
    const stateParents = parents[state];

    if (stateParents) {
      for (const [parent, parentReachability] of Object.entries(stateParents)) {
        const reachability = unvalidated[parent];

        if (reachability != null) {
          if (reachability === Reachability.NONE) {
            waitList.add(parent);
          }

          switch (parentReachability) {
            case Reachability.PROVEN: delete unvalidated[parent]; break;
            case Reachability.CONDITIONAL: unvalidated[parent] = Reachability.CONDITIONAL; break;
            default: throw Error(`Unexpected parent-child reachability ${parentReachability}`);
          }
        }
      }
    } else if (state !== dialogue.startAt) {
      warnings.push(new UnreachableWarning(state));
    }
  }

  for (const [bad, badReachability] of Object.entries(unvalidated)) {
    if (bad !== dialogue.startAt && !parents[bad]) {
      // Unreachable states do not cause infinite loops, but we still want to be aware of them
      warnings.push(new StrandedWarning(bad));
    } else if (badReachability === Reachability.CONDITIONAL) {
      warnings.push(new ConditionalSoftLock(bad));
    } else {
      errors.push(new SoftLockError(bad));
    }
  }
}

export function validateDialogue(dialogue: BlabberDialogue, logWarning: (msg: string) => void, logError: (msg: string) => void) {
  let warnings: ValidationWarning[] = [];
  let errors: ValidationError[] = [];
  try {
    validateStructure(dialogue, warnings, errors);
  } catch (e: any) {
    console.error(e);
    errors.push(e.message);
  }
  if (warnings.length) logWarning(`There ${warnings.length > 1 ? `were ${warnings.length} warnings` : 'was a warning'}: ${warnings.map((w) => w.message()).join('; ')}`);
  if (errors.length) {
    logError(`There ${errors.length > 1 ? `were ${errors.length} errors` : 'was an error'}: ${errors.map((e) => e.message()).join('; ')}`);
    return false;
  }
  return true;
}
