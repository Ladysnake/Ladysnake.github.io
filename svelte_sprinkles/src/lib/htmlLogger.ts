import {type Readable, writable} from "svelte/store";

export interface Logs {
  readonly info: string;
  readonly warning: string;
  readonly error: string;
}

export interface HtmlLogger extends Readable<Logs> {
  logInfo: (text: string) => void;
  logWarning: (text: string) => void;
  logError: (text: string) => void;
  clearLogs: () => void;
}

export function createHtmlLogger(): HtmlLogger {
  const empty: Logs = {
    info: '',
    warning: '',
    error: '',
  };
  const { subscribe, set, update } = writable(empty);
  return {
    subscribe,
    logInfo(info) {
      update((oldLogs) => ({...oldLogs, info}));
    },
    logWarning(warning) {
      update((oldLogs) => ({...oldLogs, warning}));
    },
    logError(error) {
      update((oldLogs) => ({...oldLogs, error}));
    },
    clearLogs() {
      set(empty)
    }
  }
}
