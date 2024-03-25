import {derived, type Writable, writable} from "svelte/store";

function createDarkMode() {
  const darkModeSetting = localStorage.getItem("dark-mode");
  const {
    subscribe,
    set,
    update
  } = writable<boolean | undefined>(darkModeSetting === null ? undefined : darkModeSetting === 'true');
  subscribe((value) => {
    if (value) {
      localStorage.setItem('dark-mode', '' + value);
    } else {
      localStorage.removeItem('dark-mode');
    }
  });
  return { subscribe, set, update } as const;
}

export const darkModeSetting = createDarkMode();

const mediaDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
export const darkModeEnabled = {
  ...derived(darkModeSetting, (d) => d ?? mediaDarkMode.matches),
  set: (enabled: boolean) => darkModeSetting.set(enabled === mediaDarkMode.matches ? undefined : enabled),
  update: (fn: (enabled: boolean) => boolean) => darkModeSetting.update((e) => {
    const newValue = fn(e ?? mediaDarkMode.matches);
    return newValue === mediaDarkMode.matches ? undefined : newValue;
  }),
};
