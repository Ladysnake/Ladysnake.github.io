import {type Updater, type Writable, writable} from "svelte/store";

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

function createDarkModeEnabled(): Writable<boolean> {
  const mediaDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
  const { set: _set, subscribe } = writable(false);
  let currentSetting: boolean | undefined;
  mediaDarkMode.addEventListener('change', (e) => {
    if (currentSetting === undefined) {
      _set(e.matches);
    }
  });
  darkModeSetting.subscribe((value) => {
    currentSetting = value;
    _set(value ?? mediaDarkMode.matches);
  });
  const set = (enabled: boolean) => {
    darkModeSetting.set(enabled === mediaDarkMode.matches ? undefined : enabled);
  };
  const update = (updater: Updater<boolean>) => set(updater(currentSetting ?? mediaDarkMode.matches));
  return {
    set,
    update,
    subscribe,
  };
}
export const darkModeEnabled = createDarkModeEnabled();
