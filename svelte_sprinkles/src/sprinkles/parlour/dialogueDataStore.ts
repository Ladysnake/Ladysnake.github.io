import {derived, type Readable, writable, type Writable} from 'svelte/store';
import BlabberDialogue from './model/BlabberDialogue';
import {McTextType} from "../../lib/McText";
import {loadChosenTextFormat, tryCastTextFormat} from "./localStorageKeys";

function createDialogueData() {
  const store = writable(new BlabberDialogue());
  let initialized = false;

  store.subscribe((value) => {
    if (initialized) {
      value.saveToWindow();
    }
  });

  initialized = true;
  return store;
}

export const dialogueData = createDialogueData();
export const dialogueStart: Writable<string | undefined> = {
  ...(derived(dialogueData,(d) => d.startAt)),
  set: (startAt: string) => dialogueData.update((d) => d.withStartAt(startAt)),
  update: (fn: (startAt: string | undefined) => string) => dialogueData.update((d) => d.withStartAt(fn(d.startAt)))
}
export const dialogueStateKeys: Readable<string[]> = derived(dialogueData,(d) => Object.keys(d.states));
export const dialogueUnskippable: Writable<boolean> = {
  ...(derived(dialogueData,(d) => d.unskippable)),
  set: (unskippable: boolean) => dialogueData.update((d) => d.withUnskippability(unskippable)),
  update: (fn: (unskippable: boolean) => boolean) => dialogueData.update((d) => d.withUnskippability(fn(d.unskippable)))
}
export const dialogueLayout: Writable<string | undefined> = {
  ...(derived(dialogueData,(d) => d.layout)),
  set: (layout: string) => dialogueData.update((d) => d.withLayout(layout)),
  update: (fn: (layout: string | undefined) => string) => dialogueData.update((d) => d.withLayout(fn(d.layout)))
}
export const dialogueFilename: Writable<string | undefined> = {
  ...(derived(dialogueData,(d) => d.filename)),
  set: (filename: string | undefined) => dialogueData.update((d) => d.withFilename(filename)),
  update: (fn: (filename: string | undefined) => string | undefined) => dialogueData.update((d) => d.withFilename(fn(d.filename))),
};

function createDialogueTextFormat() {
  const store = writable(tryCastTextFormat(window.history.state?.textFormat) ?? loadChosenTextFormat() ?? McTextType.PLAIN);
  let initialized = false;

  store.subscribe((value) => {
    if (initialized) {
      console.log('New value', value);
      window.history.replaceState({
        ...(window.history.state ?? {}),
        textFormat: value,
      }, '');
    }
  });

  initialized = true;
  return store;
}

export const dialogueTextFormat: Writable<McTextType> = createDialogueTextFormat();
