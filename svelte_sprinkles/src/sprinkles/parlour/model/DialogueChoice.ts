import type {Identifier, McText} from "../../../lib/McText";

export enum UnavailableDisplay {
  GRAYED_OUT = "grayed_out",
  HIDDEN = "hidden"
}

export interface UnavailableAction {
  readonly display?: UnavailableDisplay;
  readonly message?: McText;
}

export interface DialogueChoiceCondition {
  readonly predicate?: Identifier,
  readonly whenUnavailable?: UnavailableAction,
}

// Internal identifier to keep track of values when reordering
export const choiceIdKey = '_id';
// Initialize with a random number to avoid duplicating identifiers on page reload
let nextChoiceId = Math.random();

export function genChoiceId() {
  return nextChoiceId++;
}

export interface DialogueChoice {
  readonly text?: McText;
  readonly next?: string;
  readonly condition?: DialogueChoiceCondition;
  readonly [choiceIdKey]?: number;
}
