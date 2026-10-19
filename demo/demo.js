/**
 * The card running outside Home Assistant, on drawn machines and made-up states.
 * Used to take the README screenshots; open it with `npm run demo`.
 *
 * Query string: theme=dark|light, lang=en|it, width=<px>, cols=<n>, scene=machines|styles|compact.
 */
import * as mdi from "/node_modules/@mdi/js/mdi.js";
import { dataUri, dryer, washer } from "./machines.js";

const q = new URLSearchParams(location.search);
const lang = q.get("lang") || "en";
document.documentElement.dataset.theme = q.get("theme") || "dark";
const stage = document.getElementById("stage");
stage.style.maxWidth = `${q.get("width") || 1040}px`;
stage.style.setProperty("--cols", q.get("cols") || 2);

/** Stand-ins for the two Home Assistant elements the card uses: mdi:foo-bar → mdiFooBar. */
const path = (name) => mdi[`mdi${String(name).replace(/^mdi:/, "").split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join("")}`] || "";
customElements.define("ha-icon", class extends HTMLElement {
  static get observedAttributes() { return ["icon"]; }
  attributeChangedCallback() { this.connectedCallback(); }
  connectedCallback() {
    this.style.cssText += "display:inline-flex;width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px)";
    this.innerHTML = `<svg viewBox="0 0 24 24" width="100%" height="100%"><path fill="currentColor" d="${path(this.getAttribute("icon"))}"/></svg>`;
  }
});
customElements.define("ha-card", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = "<style>:host{display:block;background:var(--ha-card-background)}</style><slot></slot>";
  }
});

await import("../dist/appliance-hero-card.js");

const it = lang === "it";
const s = (state, attributes = {}) => ({ state, attributes });
const min = (n) => s(String(n), { unit_of_measurement: "min" });
/** Four machines: a washer rinsing, a dryer paused, a washer that has just finished, a dryer at rest. */
const states = {
  "sensor.w1_state": s("run"), "sensor.w1_phase": s("rinse"), "sensor.w1_progress": s("62"), "sensor.w1_left": min(38),
  "sensor.d1_state": s("pause"), "sensor.d1_phase": s("drying"), "sensor.d1_progress": s("41"), "sensor.d1_left": min(74),
  "sensor.w2_state": s("idle"), "sensor.w2_phase": s("finish"), "sensor.w2_progress": s("100"), "sensor.w2_left": min(0),
  "sensor.d2_state": s("idle"), "sensor.d2_phase": s("idle"), "sensor.d2_progress": s("0"), "sensor.d2_left": min(0),
  "select.w_temp": s("40 °C"), "select.w_spin": s("1200 rpm"), "select.d_level": s(it ? "Normale" : "Normal"),
  "switch.w_prewash": s("on", { friendly_name: it ? "Prelavaggio" : "Pre-wash" }),
  "switch.d_wrinkle": s("on", { friendly_name: it ? "Antipiega" : "Wrinkle prevent" }),
  "binary_sensor.w_detergent": s("on", { friendly_name: it ? "Detersivo in esaurimento" : "Detergent low" }),
  "binary_sensor.d_filter": s("on", { friendly_name: it ? "Pulisci il filtro" : "Clean the filter" })
};
const hass = { states, language: lang, locale: { language: lang }, callService: () => {}, formatEntityState: (st) => st.state };

const machine = (id, name, image, color, extra = {}) => ({
  entity: `sensor.${id}_state`, name, image: dataUri(image), color,
  phase_entity: `sensor.${id}_phase`, progress_entity: `sensor.${id}_progress`, remaining_entity: `sensor.${id}_left`,
  controls: { start: `button.${id}_start`, pause: `button.${id}_pause`, stop: `button.${id}_stop` },
  advanced: ["select.cycle"],
  ...extra
});
const washerOpts = { options: [{ entity: "select.w_temp", icon: "mdi:thermometer-water" }, { entity: "select.w_spin", icon: "mdi:rotate-right" }, { entity: "switch.w_prewash", icon: "mdi:water-plus-outline" }],
  alerts: [{ entity: "binary_sensor.w_detergent", icon: "mdi:bottle-tonic-outline" }] };
const dryerOpts = { icon: "mdi:tumble-dryer", options: [{ entity: "select.d_level", icon: "mdi:water-off-outline" }, { entity: "switch.d_wrinkle", icon: "mdi:tshirt-crew-outline" }] };

const MACHINES = [
  machine("w1", it ? "Lavatrice" : "Washer", washer(), "blue", washerOpts),
  machine("d1", it ? "Asciugatrice" : "Dryer", dryer(), "orange", dryerOpts),
  machine("w2", it ? "Lavatrice" : "Washer", washer(), "blue", { options: washerOpts.options }),
  machine("d2", it ? "Asciugatrice" : "Dryer", dryer(), "orange", { ...dryerOpts, alerts: [{ entity: "binary_sensor.d_filter", icon: "mdi:air-filter" }] })
];
const STYLES = ["tab", "inline", "chip"].map((p) => ({ ...MACHINES[0], name: p, phase_style: p, options: [], alerts: [], advanced: [] }));
const COMPACT = MACHINES.slice(0, 2).map((m) => ({ ...m, layout: "compact", icon: m.icon || "mdi:washing-machine" }))
  .concat([{ ...MACHINES[3], layout: "compact" }]);

const scene = q.get("scene") || "machines";
const cards = ({ styles: STYLES, compact: COMPACT }[scene] || MACHINES).map((cfg) => {
  const c = document.createElement("appliance-hero-card");
  c.setConfig(cfg);
  c.hass = hass;
  stage.appendChild(c);
  return c;
});
window.__cards = cards;
