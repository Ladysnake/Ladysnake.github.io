import {writable} from "svelte/store";

function createDarkMode() {
  const darkModeSetting = localStorage.getItem("dark-mode");
  const { subscribe, set, update } = writable(darkModeSetting === null ? undefined : darkModeSetting === 'true');
  const toggle = () => update((v) => !v);
  subscribe((value) => {
    if (value) {
      localStorage.setItem('dark-mode', '' + value);
    } else {
      localStorage.removeItem('dark-mode');
    }
  });
  return { subscribe, set, update, toggle } as const;
}

export const darkModeEnabled = createDarkMode();
