export interface McText {
  readonly value: string | object;
  readonly translate?: string;
}

export interface DialogueAction {
  readonly type?: string;
  readonly value?: string;
}

export interface DialogueChoice {
  readonly text?: McText;
  readonly next?: string;
}

export interface DialogueState {
  readonly type?: string;
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

  /**
   * Constructs a new dialogue with no data
   */
  constructor(data: DialogueData = {}) {
    this.data = data;
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

  get states(): [string, DialogueState][] {
    return Object.entries(this.data.states ?? {});
  }

  stateData(key: string): DialogueState | undefined {
    return this.data.states?.[key];
  }

  withStartAt(state?: string) {
    return new BlabberDialogue({ ...this.data, start_at: state });
  }

  withUnskippability(unskippable: boolean) {
    return new BlabberDialogue({ ...this.data, unskippable });
  }

  withLayout(layout: string) {
    return new BlabberDialogue({ ...this.data, layout: { type: layout } });
  }

  isLoaded(): boolean {
    return this.data.states !== null;
  }

  saveToWindow() {
    const newState = {...(window.history.state ?? {}), data: this.data};
    window.history.replaceState(newState, '');
  }

  prune() {
    return new BlabberDialogue({
      ...this.data,
      states: Object.fromEntries(Object.entries(this.data.states ?? {}).map(([key, { action, ...state }]) => {
        return [key, action?.type === '' ? { ...state } : { action, ...state }];
      })),
    });
  }
}
