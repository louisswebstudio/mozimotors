"use client";

/** Saved cars (« Enregistrer » hearts), kept in this browser only. Shared across tabs/components. */
import { useSyncExternalStore } from "react";

const KEY = "mozi-v2-favorites";
const EVENT = "mozi:v2-favorites";

function read(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

let cache: string[] | null = null;
const snapshot = () => (cache ??= read());
const EMPTY: string[] = [];

function subscribe(cb: () => void) {
  const on = () => {
    cache = null;
    cb();
  };
  window.addEventListener(EVENT, on);
  window.addEventListener("storage", on);
  return () => {
    window.removeEventListener(EVENT, on);
    window.removeEventListener("storage", on);
  };
}

export function useFavorites() {
  const ids = useSyncExternalStore(subscribe, snapshot, () => EMPTY);
  const toggle = (id: string) => {
    const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    cache = next;
    window.dispatchEvent(new Event(EVENT));
  };
  return { ids, has: (id: string) => ids.includes(id), toggle };
}
