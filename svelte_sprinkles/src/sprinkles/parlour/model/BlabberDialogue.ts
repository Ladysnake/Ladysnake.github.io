import type {McText} from "../../../lib/McText";
import type {DialogueChoice} from "./DialogueChoice";

export interface DialogueAction {
  readonly type?: string;
  readonly value?: string;
}

export type ChoiceResult = 'default' | 'end_dialogue' | 'ask_confirmation';

export interface DialogueState {
  readonly type?: ChoiceResult;
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
    return this.withUpdatedState(newState, () => ({
      text: '',
      choices: [],
    }));
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

  saveToWindow() {
    const newState = {
      ...(window.history.state ?? {}),
      data: this.data,
      filename: this.filename,
    };
    window.history.replaceState(newState, '');
  }
}
