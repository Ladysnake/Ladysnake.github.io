import {writable, derived, type Writable} from 'svelte/store';
import BlabberDialogue from './BlabberDialogue';
import {McTextType} from "../../lib/McText";

function createDialogueData() {
  let store = writable(new BlabberDialogue());
  const { subscribe, set, update } = store;

  function unload(): void {
    set(new BlabberDialogue());
  }

  return {
    subscribe,
    set,
    update,
    unload,
  };
}

export const dialogueData = createDialogueData();
export const dialogueStart: Writable<string | undefined> = {
  ...(derived(dialogueData,(d) => d.startAt)),
  set: (startAt: string) => dialogueData.update((d) => d.withStartAt(startAt)),
  update: (fn: (startAt: string | undefined) => string) => dialogueData.update((d) => d.withStartAt(fn(d.startAt)))
}
export const dialogueStateKeys = derived(dialogueData,(d) => Object.keys(d.states));
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
export const dialogueFilename = writable<string | undefined>();
export const dialogueTextFormat = writable(McTextType.PLAIN);
