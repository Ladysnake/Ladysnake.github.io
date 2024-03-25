import {writable} from "svelte/store";

function createDarkMode() {
  const darkModeToggle = (globalThis as any).ladysnakeDarkMode;
  const store = writable(!!darkModeToggle.enabled);
  darkModeToggle.addListener(store.set);
  return store;
}

export const darkModeEnabled = createDarkMode();