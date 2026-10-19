import { Window } from "happy-dom";

/** Boots a DOM, loads the card module once and returns its exports. */
let loaded = null;

export async function boot() {
  if (!loaded) {
    const win = new Window({ url: "http://localhost:8123" });
    for (const k of ["window", "document", "HTMLElement", "customElements", "CustomEvent", "Event"]) {
      globalThis[k] = k === "window" ? win : win[k];
    }
    loaded = await import("../dist/appliance-hero-card.js");
  }
  return loaded;
}

export const st = (state, attributes = {}) => ({ state, attributes });

export const fakeHass = (states = {}, language = "en") => {
  const calls = [];
  return {
    states,
    language,
    locale: { language },
    calls,
    callService: (domain, service, data) => calls.push([domain, service, data])
  };
};

export async function makeCard(config, hass) {
  await boot();
  const el = globalThis.document.createElement("appliance-hero-card");
  el.setConfig(config);
  if (hass) el.hass = hass;
  return el;
}

export const $ = (el, sel) => el.shadowRoot.querySelector(sel);
export const $$ = (el, sel) => Array.from(el.shadowRoot.querySelectorAll(sel));
export const wait = (ms) => new Promise((r) => setTimeout(r, ms));
