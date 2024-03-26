import {derived, writable} from "svelte/store";

function createDarkMode() {
  const darkModeSetting = localStorage.getItem("dark-mode");
  const {
    subscribe,
    set,
    update
  } = writable<boolean | undefined>(darkModeSetting === null ? undefined : darkModeSetting === 'true');
  subscribe((value) => {
    if (value !== undefined) {
      localStorage.setItem('dark-mode', '' + value);
    } else {
      localStorage.removeItem('dark-mode');
    }
  });
  subscribe((value) => {
    if (value === undefined) {
      document.body.classList.remove("light-mode");
      document.body.classList.remove("dark-mode");
    } else if (value) {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
    }
  });
  document.body.classList.remove("uninitialized-dark-mode");
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
