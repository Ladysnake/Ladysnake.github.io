import type {McText} from "../../../lib/McText";
import type {DialogueChoice} from "./DialogueChoice";

export interface DialogueAction {
  readonly type?: string;
  readonly value?: string;
}

export enum StateType {
  DEFAULT = 'default',
  END_DIALOGUE = 'end_dialogue',
  ASK_CONFIRMATION = 'ask_confirmation',
}

export interface DialogueState {
  readonly type?: StateType;
  readonly text?: McText;
  readonly action?: DialogueAction;
  readonly choices?: DialogueChoice[];
}

export interface DialogueLayout {
  readonly type?: string;
}

export interface DialogueData {
  readonly states?: Record<string, DialogueState>;
  readonly start_at?: string;
  readonly unskippable?: boolean;
  readonly layout?: DialogueLayout;
}

export default class BlabberDialogue {
  readonly data: DialogueData;
  readonly filename: string | undefined;

  /**
   * Constructs a new dialogue with no data
   */
  constructor(data: DialogueData = {}, filename: string | undefined = undefined) {
    this.data = data;
    this.filename = filename;
  }

  get startAt(): string | undefined {
    return this.data.start_at;
  }

  get unskippable(): boolean {
    return !!this.data.unskippable;
  }

  get layout(): string | undefined {
    return this.data.layout?.type;
  }

  get states(): Record<string, DialogueState> {
    return this.data.states ?? {};
  }

  withFilename(filename: string | undefined) {
    return new BlabberDialogue(this.data, filename);
  }

  withStartAt(state?: string) {
    return new BlabberDialogue({ ...this.data, start_at: state }, this.filename);
  }

  withUnskippability(unskippable: boolean) {
    return new BlabberDialogue({ ...this.data, unskippable }, this.filename);
  }

  withLayout(layout: string) {
    return new BlabberDialogue({ ...this.data, layout: { type: layout } }, this.filename);
  }

  withAddedState(newState: string) {
    let updated = this.withUpdatedState(newState, () => ({
      text: '',
      choices: [],
    }));
    if (Object.keys(this.states).length === 0) {
      // We just added our only state
      return updated.withStartAt(newState);
    } else {
      return updated;
    }
  }

  withUpdatedState(key: string, updater: (state: DialogueState) => DialogueState) {
    return new BlabberDialogue({
      ...this.data,
      states: {
        ...(this.data.states ?? {}),
        [key]: updater(this.data?.states?.[key] ?? {}),
      }
    }, this.filename);
  }

  isLoaded(): boolean {
    return this.data.states !== null;
  }

  /**
   * Finds all states that have choices which reference a given state
   */
  findReferences(state: string) {
    const references = [];
    for (const [key, other] of Object.entries(this.states)) {
      if (key !== state) {
        for (let i = 0; i < (other?.choices ?? []).length; i++) {
          const { next } = (other?.choices ?? [])[i];
          if (next === state) {
            references.push({ state: key, choice: i });
          }
        }
      }
    }
    return references;
  }

  withoutState(stateToDelete: string) {
    const newStates: Record<string, DialogueState> = {};

    for (const [existingKey, { choices, ...existingState }] of Object.entries(this.states)) {
      if (existingKey === stateToDelete) continue;

      newStates[existingKey] = {
        ...existingState,
        choices: choices?.filter((c) => c.next !== stateToDelete)
      };
    }

    return new BlabberDialogue({
      ...this.data,
      states: newStates,
      start_at: stateToDelete === this.startAt ? undefined : this.startAt,
    }, this.filename);
  }

  saveToWindow() {
    const newState = {
      ...(window.history.state ?? {}),
      data: this.data,
      filename: this.filename,
    };
    window.history.replaceState(newState, '');
  }
}
