import { useEffect, useState } from "react";

type PersistedState = {
  language: string;
  fontSize: number;
  saved: number[];
  japaCount: number;
  highContrast: boolean;
  dyslexiaFriendly: boolean;
  festivalMode: boolean;
};

const key = "hanuman-chalisa-preferences";
const defaults: PersistedState = {
  language: "hi",
  fontSize: 1,
  saved: [],
  japaCount: 0,
  highContrast: false,
  dyslexiaFriendly: false,
  festivalMode: false,
};

function read(): PersistedState {
  if (typeof window === "undefined") return defaults;
  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? "null") as Partial<PersistedState> | null;
    return { ...defaults, ...(value ?? {}) };
  } catch {
    return defaults;
  }
}

export function usePersistence() {
  const [state, setState] = useState<PersistedState>(read);
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [state]);
  return [state, setState] as const;
}

export type { PersistedState };
