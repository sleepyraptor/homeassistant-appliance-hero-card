/**
 * Appliance Hero Card — a washer, dryer or dishwasher at a glance: its photo, the phase it is in, a progress ring,
 * when it finishes, the controls that make sense right now, the options that are set and what needs attention,
 * with the full programme one tap away.
 * https://github.com/sleepyraptor/homeassistant-appliance-hero-card
 */
const VERSION = "0.1.0";

const I18N = {
  en: {
    idle: "Idle", running: "Running", paused: "Paused", finished: "Finished", off: "Off",
    ends_at: "Ends at {time}", ends: "Ends", left: "Remaining", advanced: "Advanced",
    start: "Start", pause: "Pause", resume: "Resume", stop: "Stop",
    min: "{n} min", h: "{h} h {m} min",
    p_weightsensing: "Weighing the load", p_prewash: "Pre-wash", p_wash: "Washing", p_washing: "Washing", p_rinse: "Rinsing",
    p_rinsing: "Rinsing", p_spin: "Spinning", p_spinning: "Spinning", p_predrain: "Draining", p_drain: "Draining",
    p_drying: "Drying", p_dry: "Drying", p_dryingwithdooropen: "Drying", p_cooling: "Cooling down", p_cooldown: "Cooling down",
    p_steaming: "Steaming", p_steam: "Steaming", p_sanitizing: "Sanitising", p_airwashing: "Refreshing", p_delaywash: "Delayed start",
    p_delayedstart: "Delayed start", p_soak: "Soaking", p_heating: "Heating", p_anticrease: "Anti-crease", p_wrinkle_prevent: "Anti-crease",
    p_finish: "Finished", p_finished: "Finished", p_end: "Finished", p_idle: "Idle", p_none: "",
    // editor
    sec_machine: "Machine", sec_cycle: "Cycle", sec_controls: "Buttons", sec_states: "States", sec_actions: "Actions",
    f_entity: "Machine state", h_entity: "The entity that says whether it is running, paused or finished",
    f_name: "Name", f_icon: "Icon", f_image: "Image", h_image: "A picture of the machine: /local/… or https://… (a PNG with a transparent background looks best). Without one the icon is shown",
    f_color: "Colour", h_color: "A preset, \"r,g,b\" or #hex", f_layout: "Layout", f_phase_style: "Where the phase goes",
    f_animate: "Animations", f_phase_entity: "Phase", h_phase_entity: "Washing, rinsing, spinning…",
    f_progress_entity: "Progress (%)", f_remaining_entity: "Time remaining", h_remaining_entity: "Minutes, hours or seconds — or a timestamp",
    f_finish_entity: "Finish time", h_finish_entity: "A timestamp sensor",
    f_start: "Start / resume", f_pause: "Pause", f_stop: "Stop", h_start: "Buttons, scripts or scenes: shown only when they make sense",
    f_running_states: "States that mean running", f_paused_states: "States that mean paused", f_finished_states: "States that mean finished",
    h_states: "Leave empty for the defaults, which cover most integrations",
    f_tap_action: "Tap", f_hold_action: "Hold", f_advanced_open: "Advanced open by default",
    l_full: "Full", l_compact: "Compact (one line)",
    ps_tab: "Tab on the top edge", ps_inline: "After the state", ps_chip: "A chip", ps_photo: "On the photo", ps_ring: "Under the ring",
    options: "Options", h_options: "Chips under the controls: a select shows its value, a switch shows up only while on.",
    alerts: "Alerts", h_alerts: "Amber chips shown only while the entity is on: detergent low, filter to clean…",
    advanced_list: "Advanced", h_advanced: "Behind the chevron: every entity becomes a tile with the control that fits it.",
    item_n: "#{n}", add: "Add", up: "Move up", down: "Move down", remove: "Remove", card_yaml: "Card {type} — edit it in YAML"
  },
  it: {
    idle: "Ferma", running: "In funzione", paused: "In pausa", finished: "Finito", off: "Spenta",
    ends_at: "Finisce alle {time}", ends: "Fine", left: "Mancano", advanced: "Avanzate",
    start: "Avvia", pause: "Pausa", resume: "Riprendi", stop: "Stop",
    min: "{n} min", h: "{h} h {m} min",
    p_weightsensing: "Pesatura del carico", p_prewash: "Prelavaggio", p_wash: "Lavaggio", p_washing: "Lavaggio", p_rinse: "Risciacquo",
    p_rinsing: "Risciacquo", p_spin: "Centrifuga", p_spinning: "Centrifuga", p_predrain: "Scarico", p_drain: "Scarico",
    p_drying: "Asciugatura", p_dry: "Asciugatura", p_dryingwithdooropen: "Asciugatura", p_cooling: "Raffreddamento", p_cooldown: "Raffreddamento",
    p_steaming: "Vapore", p_steam: "Vapore", p_sanitizing: "Igienizzazione", p_airwashing: "Rinfrescante", p_delaywash: "Partenza ritardata",
    p_delayedstart: "Partenza ritardata", p_soak: "Ammollo", p_heating: "Riscaldamento", p_anticrease: "Antipiega", p_wrinkle_prevent: "Antipiega",
    p_finish: "Finito", p_finished: "Finito", p_end: "Finito", p_idle: "Ferma", p_none: "",
    sec_machine: "Elettrodomestico", sec_cycle: "Ciclo", sec_controls: "Pulsanti", sec_states: "Stati", sec_actions: "Azioni",
    f_entity: "Stato della macchina", h_entity: "L'entità che dice se è in funzione, in pausa o ha finito",
    f_name: "Nome", f_icon: "Icona", f_image: "Immagine", h_image: "Una foto della macchina: /local/… o https://… (meglio un PNG con lo sfondo trasparente). Senza, si vede l'icona",
    f_color: "Colore", h_color: "Un preset, \"r,g,b\" o #hex", f_layout: "Layout", f_phase_style: "Dove va la fase",
    f_animate: "Animazioni", f_phase_entity: "Fase", h_phase_entity: "Lavaggio, risciacquo, centrifuga…",
    f_progress_entity: "Avanzamento (%)", f_remaining_entity: "Tempo che manca", h_remaining_entity: "Minuti, ore o secondi — oppure un timestamp",
    f_finish_entity: "Ora di fine", h_finish_entity: "Un sensore timestamp",
    f_start: "Avvia / riprendi", f_pause: "Pausa", f_stop: "Stop", h_start: "Pulsanti, script o scene: compaiono solo quando servono",
    f_running_states: "Stati che vogliono dire in funzione", f_paused_states: "Stati che vogliono dire in pausa", f_finished_states: "Stati che vogliono dire finito",
    h_states: "Vuoto per i valori predefiniti, che vanno bene per quasi tutte le integrazioni",
    f_tap_action: "Tocco", f_hold_action: "Pressione lunga", f_advanced_open: "Avanzate aperte all'inizio",
    l_full: "Completo", l_compact: "Compatto (una riga)",
    ps_tab: "Linguetta sul bordo in alto", ps_inline: "Dopo lo stato", ps_chip: "Una chip", ps_photo: "Sulla foto", ps_ring: "Sotto il cerchio",
    options: "Opzioni", h_options: "Chip sotto i comandi: una select mostra il suo valore, un interruttore compare solo se acceso.",
    alerts: "Avvisi", h_alerts: "Chip ambra che compaiono solo quando l'entità è accesa: detersivo in esaurimento, filtro da pulire…",
    advanced_list: "Avanzate", h_advanced: "Dietro la freccia: ogni entità diventa una tile con il controllo adatto.",
    item_n: "#{n}", add: "Aggiungi", up: "Sposta su", down: "Sposta giù", remove: "Rimuovi", card_yaml: "Card {type} — si modifica in YAML"
  }
};

export const langOf = (hass) => {
  const l = String((hass && ((hass.locale && hass.locale.language) || hass.language)) || "en").toLowerCase();
  return l.startsWith("it") ? "it" : "en";
};
export const t = (L, k, v = {}) => String((I18N[L] || I18N.en)[k] ?? I18N.en[k] ?? k).replace(/\{(\w+)\}/g, (_, x) => v[x] ?? "");
const has = (L, k) => (I18N[L] || I18N.en)[k] !== undefined || I18N.en[k] !== undefined;
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const num = (v, d = null) => {
  const n = typeof v === "number" ? v : /^\s*-?\d+(\.\d+)?\s*$/.test(String(v)) ? parseFloat(v) : NaN;
  return Number.isFinite(n) ? n : d;
};
const lower = (v) => String(v ?? "").toLowerCase();
const list = (v) => (Array.isArray(v) ? v : v === undefined || v === null || v === "" ? [] : String(v).split(",")).map((x) => lower(x).trim()).filter(Boolean);

/** What most integrations call these states: Samsung SmartThings, Home Connect, Miele, LG ThinQ, a binary sensor… */
export const DEFAULT_STATES = {
  running: ["on", "run", "running", "active", "in_use", "inuse", "washing", "drying", "rinsing", "spinning", "programmed_running", "busy"],
  paused: ["pause", "paused", "interrupted", "suspended"],
  finished: ["finished", "finish", "end", "ended", "complete", "completed", "done", "program_ended", "end_programmed"]
};

export const DEFAULTS = { layout: "full", color: "blue", phase_style: "tab", animate: true, advanced_open: false };

export const COLORS = {
  blue: "59,130,246", orange: "249,115,22", green: "34,197,94", purple: "168,85,247", cyan: "6,182,212", red: "239,68,68",
  pink: "236,72,153", teal: "20,184,166", amber: "245,158,11", indigo: "99,102,241"
};

/** A preset name, "r,g,b", [r, g, b] or #hex → "r,g,b". */
export const rgbOf = (c) => {
  if (Array.isArray(c) && c.length === 3) return c.map((x) => Math.round(Number(x) || 0)).join(",");
  const s = String(c ?? "").trim();
  if (COLORS[s]) return COLORS[s];
  const hex = s.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].replace(/./g, "$&$&") : hex[1];
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(",");
  }
  const rgb = s.replace(/^rgb\(|\)$/g, "").split(",").map((x) => Number(x.trim()));
  if (rgb.length === 3 && rgb.every((x) => Number.isFinite(x))) return rgb.map((x) => Math.round(x)).join(",");
  return COLORS.blue;
};

/** running | paused | finished | off | idle — from the machine's state, or from a phase that says it has finished. */
export const modeOf = (config, state, phase) => {
  const s = lower(state);
  const of = (k) => (list(config[`${k}_states`]).length ? list(config[`${k}_states`]) : DEFAULT_STATES[k]);
  if (of("running").includes(s)) return "running";
  if (of("paused").includes(s)) return "paused";
  if (of("finished").includes(s)) return "finished";
  if (s === "off" || s === "unavailable") return "off";
  if (phase && of("finished").includes(lower(phase))) return "finished";
  return "idle";
};

/** The phase in words: your own name for it, the card's, the integration's translation, or the raw state tidied up. */
export const phaseLabel = (hass, L, config, st) => {
  if (!st || ["", "unknown", "unavailable", "none"].includes(lower(st.state))) return "";
  const raw = String(st.state);
  const mine = config.phases || {};
  if (mine[raw] !== undefined) return String(mine[raw]);
  const key = `p_${lower(raw).replace(/[\s-]+/g, "_")}`;
  if (has(L, key)) return t(L, key);
  const formatted = hass && hass.formatEntityState ? hass.formatEntityState(st) : raw;
  if (formatted && formatted !== raw) return formatted;
  const words = raw.replace(/[_-]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

/** Minutes left and the time it ends, from a duration, a timestamp, or both. */
export const timing = (hass, config, now = Date.now()) => {
  const st = (id) => (id && hass && hass.states[id]) || null;
  const date = (s) => {
    const d = s && /\d{4}-\d{2}-\d{2}/.test(s.state) ? new Date(s.state) : null;
    return d && !isNaN(d) ? d : null;
  };
  let mins = null;
  let finish = null;
  const r = st(config.remaining_entity);
  if (r) {
    const clock = String(r.state).match(/^(\d+):(\d{2})(?::(\d{2}))?$/);
    const v = num(r.state);
    const u = lower(r.attributes.unit_of_measurement);
    if (r.attributes.device_class === "timestamp" || date(r)) finish = date(r);
    else if (clock) mins = Number(clock[1]) * 60 + Number(clock[2]) + Number(clock[3] || 0) / 60;
    else if (v !== null) mins = u === "h" ? v * 60 : u === "s" ? v / 60 : u === "d" ? v * 1440 : v;
  }
  if (!finish) finish = date(st(config.finish_entity));
  if (finish && mins === null) mins = Math.max(0, Math.round((finish - now) / 60000));
  if (!finish && mins !== null) finish = new Date(now + mins * 60000);
  return { mins, finish };
};

/**
 * An advanced control as a native Home Assistant card: an entity id becomes a tile with the feature that fits
 * its domain (options for a select, a slider for a number, a toggle for a switch); a card config is used as is.
 * `_wide` asks for the full width of the grid and is removed before the card is created.
 */
export const advancedCard = (item) => {
  if (item && typeof item === "object" && item.type) return { ...item };
  const o = typeof item === "string" ? { entity: item } : { ...item };
  const domain = String(o.entity || "").split(".")[0];
  const tile = { type: "tile", entity: o.entity, ...(o.name ? { name: o.name } : {}), ...(o.icon ? { icon: o.icon } : {}) };
  if (domain === "select" || domain === "input_select") return { ...tile, features: [{ type: "select-options" }], features_position: "bottom", _wide: true };
  if (domain === "number" || domain === "input_number") return { ...tile, features: [{ type: "numeric-input", style: "slider" }], features_position: "inline", _wide: true };
  if (domain === "switch" || domain === "input_boolean") return { ...tile, features: [{ type: "toggle" }], features_position: "inline" };
  if (domain === "button" || domain === "input_button") return { ...tile, hide_state: true, vertical: true };
  return tile;
};

/** The action that runs a control: press a button, run a script or scene, turn anything else on. */
export const pressAction = (id) => {
  const d = String(id).split(".")[0];
  if (d === "button" || d === "input_button") return [d, "press"];
  if (d === "script" || d === "scene") return [d, "turn_on"];
  return ["homeassistant", "turn_on"];
};

const ON = ["on", "open", "detected", "problem", "true"];
const itemOf = (o) => (typeof o === "string" ? { entity: o } : { ...(o || {}) });

const CSS = `
:host{display:block}
ha-card{position:relative;overflow:hidden;padding:14px;border-radius:var(--ha-card-border-radius,16px);cursor:pointer;
  transition:box-shadow .6s,background .6s;-webkit-tap-highlight-color:transparent}
ha-card.running{background:rgba(var(--rgb),.10);box-shadow:inset 0 0 0 1.5px rgba(var(--rgb),.8),0 0 18px -4px rgba(var(--rgb),.7)}
ha-card.paused{background:rgba(245,158,11,.10);box-shadow:inset 0 0 0 1.5px rgba(245,158,11,.75)}
ha-card.finished{background:rgba(34,197,94,.06);box-shadow:inset 0 0 0 1.5px rgba(34,197,94,.75)}
/* At rest the card keeps the machine's colour, softly: recognisable at a glance, lit up when it starts. */
ha-card.idle,ha-card.off{background:rgba(var(--rgb),.06);box-shadow:inset 0 0 0 1px rgba(var(--rgb),.35)}
.top{display:flex;gap:14px;align-items:center}
.photo{position:relative;flex:0 0 auto;width:96px;height:120px;background-size:contain;background-repeat:no-repeat;background-position:center;
  filter:drop-shadow(0 10px 12px rgba(0,0,0,.35))}
.photo.icon{width:64px;height:64px;border-radius:50%;display:grid;place-items:center;filter:none;background:rgba(var(--rgb),.15);color:rgb(var(--rgb))}
.photo.icon ha-icon{--mdc-icon-size:36px}
.info{flex:1;min-width:0}
.name{font-size:18px;font-weight:700;color:var(--primary-text-color);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tabbed .name{padding-right:4px}
/* State, and the phase if it goes there, on one line under the name: it shortens with an ellipsis, it never wraps. */
.state{display:flex;align-items:center;gap:6px;margin-top:4px;font-size:15px;color:var(--primary-text-color);min-width:0}
.state .dot{flex:0 0 auto;width:8px;height:8px;border-radius:50%;background:var(--st)}
.state .st{flex:0 0 auto;font-weight:700;color:var(--st)}
.state .ph{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.state .ph::before{content:"·";margin-right:6px;color:var(--secondary-text-color)}
/* The tab hangs from the top edge above the ring, as wide as the ring column: it never pushes the content down. */
.tab{position:absolute;top:0;right:14px;min-width:78px;max-width:96px;padding:3px 10px 5px;border-radius:0 0 10px 10px;background:var(--st);
  color:#fff;font-size:12px;font-weight:700;letter-spacing:.02em;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  box-sizing:border-box;z-index:1}
.photo .on{position:absolute;left:50%;bottom:-4px;transform:translateX(-50%);max-width:120px;padding:2px 9px;border-radius:999px;background:var(--st);
  color:#fff;font-size:11px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-sizing:border-box;
  box-shadow:0 2px 8px rgba(0,0,0,.35)}
.ringwrap{flex:0 0 auto;display:flex;flex-direction:column;align-items:center;gap:4px;max-width:96px}
.ringwrap .cap{font-size:12px;font-weight:700;color:var(--st);max-width:96px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.chip.phase{background:var(--st);color:#fff;font-weight:700}
.times{display:grid;grid-template-columns:auto minmax(0,1fr);gap:1px 10px;margin-top:6px;font-size:13px;color:var(--secondary-text-color)}
.times b{color:var(--primary-text-color);font-weight:700}
.times>*{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ring{flex:0 0 auto;position:relative;width:78px;height:78px}
.ring svg{display:block;width:100%;height:100%;transform:rotate(-90deg)}
.ring .pct{position:absolute;inset:0;display:grid;place-items:center;font-size:17px;font-weight:700;color:var(--primary-text-color)}
.ring .arc{transition:stroke-dashoffset 1s ease-out,stroke .6s}
/* Paused: the arc breathes. Finished: the tick pops in. Running: a light runs along the arc (SMIL, in the markup). */
.paused .ring .arc{animation:breathe 2.4s ease-in-out infinite}
@keyframes breathe{0%,100%{opacity:1}50%{opacity:.35}}
.finished .ring .pct{animation:pop .5s cubic-bezier(.3,1.6,.5,1) both;color:#22c55e;font-size:26px}
@keyframes pop{from{transform:scale(.2);opacity:0}to{transform:scale(1);opacity:1}}
.still .ring .arc,.still .ring .pct{animation:none!important;transition:none}
@media (prefers-reduced-motion: reduce){.paused .ring .arc,.finished .ring .pct{animation:none}.ring .shine{display:none}.ring .arc{transition:none}}
.controls{display:flex;gap:8px;margin-top:12px}
.btn{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;height:40px;border-radius:12px;border:0;cursor:pointer;
  font:inherit;font-weight:600;background:var(--secondary-background-color);color:var(--primary-text-color)}
.btn.main{background:rgb(var(--rgb));color:#fff}
.btn ha-icon{--mdc-icon-size:20px}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.chip{display:flex;align-items:center;gap:4px;font-size:12px;padding:4px 10px;border-radius:999px;cursor:pointer;
  background:var(--secondary-background-color);color:var(--primary-text-color)}
.chip ha-icon{--mdc-icon-size:15px;opacity:.8}
.chip.warn{background:rgba(245,158,11,.15);color:#b45309}
.more{display:flex;align-items:center;justify-content:center;gap:4px;width:100%;margin:10px 0 0;padding:4px;border:0;
  background:none;color:var(--secondary-text-color);font:inherit;font-size:12px;cursor:pointer;border-radius:8px}
.more:hover{background:var(--secondary-background-color)}
.more ha-icon{--mdc-icon-size:20px;transition:transform .25s}
.more.open ha-icon{transform:rotate(180deg)}
.adv{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;cursor:default}
.adv[hidden]{display:none}
.adv>*{min-width:0}
.adv>.wide{grid-column:1/-1}
/* compact: one line, for an overview */
.compact .row{display:flex;align-items:center;gap:12px}
.compact .ic{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:rgba(var(--rgb),.15);color:rgb(var(--rgb))}
.compact .ic.paused{background:rgba(245,158,11,.15);color:#f59e0b}
.compact .txt{flex:1;min-width:0}
.compact .n{font-weight:700;color:var(--primary-text-color);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.compact .s{font-size:13px;color:var(--secondary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.compact .r{font-size:15px;font-weight:700;color:var(--primary-text-color);white-space:nowrap}
.bar{height:5px;border-radius:3px;background:var(--secondary-background-color);margin-top:10px;overflow:hidden}
.bar i{display:block;height:100%;background:var(--st);transition:width .8s}
/* On a phone the photo and the ring give way, so the times keep one line each. */
ha-card{container-type:inline-size}
@container (max-width: 400px){
  .top{gap:10px}
  .photo{width:72px;height:96px}
  .photo.icon{width:52px;height:52px}
  .ring{width:66px;height:66px}
  .ring .pct{font-size:15px}
  .finished .ring .pct{font-size:22px}
  .tab{min-width:66px;max-width:88px}
  .times{gap:1px 8px;font-size:12px}
  .name{font-size:17px}
}
`;

const R = 33;
const C = 2 * Math.PI * R;

class ApplianceHeroCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._adv = [];
  }

  static getConfigElement() {
    return document.createElement("appliance-hero-card-editor");
  }

  static getStubConfig(hass) {
    const ids = Object.keys((hass && hass.states) || {});
    const entity = ids.find((e) => /^sensor\..*(washer|washing|dryer|dishwasher).*(machine_state|operation_state|status|state)$/.test(e))
      || ids.find((e) => /^sensor\..*(washer|washing|dryer|dishwasher)/.test(e)) || "sensor.washer";
    return { entity, name: /dryer/.test(entity) ? "Dryer" : /dish/.test(entity) ? "Dishwasher" : "Washer", icon: /dryer/.test(entity) ? "mdi:tumble-dryer" : /dish/.test(entity) ? "mdi:dishwasher" : "mdi:washing-machine" };
  }

  setConfig(config) {
    if (!config || !config.entity) throw new Error("appliance-hero-card: set entity (the machine state)");
    this._c = { ...DEFAULTS, ...config };
    this._open = !!this._c.advanced_open;
    this._skeleton = false;
    this._adv = [];
    this._sig = null;
    this._ringMode = null;
    this._render();
  }

  set hass(h) {
    this._h = h;
    for (const el of this._adv) el.hass = h;
    this._render();
  }

  getCardSize() {
    return this._c && this._c.layout === "compact" ? 1 : 4;
  }

  getGridOptions() {
    return this._c && this._c.layout === "compact" ? { columns: 12, rows: "auto", min_columns: 4 } : { columns: 12, rows: "auto", min_columns: 6 };
  }

  _st(id) {
    return id && this._h ? this._h.states[id] : undefined;
  }

  _fire(config, action) {
    this.dispatchEvent(new CustomEvent("hass-action", { bubbles: true, composed: true, detail: { config, action } }));
  }

  /** The card frame, built once: the advanced controls are real Home Assistant cards and must survive updates. */
  _build() {
    const compact = this._c.layout === "compact";
    const adv = !compact && (this._c.advanced || []).length;
    this.shadowRoot.innerHTML = `<style>${CSS}</style><ha-card><div class="main"></div>
      ${adv ? `<button class="more" type="button"><span></span><ha-icon icon="mdi:chevron-down"></ha-icon></button><div class="adv" hidden></div>` : ""}</ha-card>`;
    this._card = this.shadowRoot.querySelector("ha-card");
    this._main = this.shadowRoot.querySelector(".main");
    const more = this.shadowRoot.querySelector(".more");
    if (more) {
      more.addEventListener("click", (e) => {
        e.stopPropagation();
        this._open = !this._open;
        this._toggle();
      });
      // The advanced controls and the chevron are not part of the card's tap and hold.
      for (const el of [more, this.shadowRoot.querySelector(".adv")]) {
        el.addEventListener("click", (e) => e.stopPropagation());
        el.addEventListener("pointerdown", (e) => e.stopPropagation());
      }
    }
    this._bindCard();
    this._skeleton = true;
    this._toggle();
  }

  /** Tap and hold on the card, with Home Assistant's own actions. */
  _bindCard() {
    const c = this._c;
    const cfg = { entity: c.entity, tap_action: c.tap_action || { action: "more-info" }, hold_action: c.hold_action || { action: "none" } };
    let timer = null;
    let held = false;
    this._card.addEventListener("pointerdown", (e) => {
      if (e.button) return;
      held = false;
      clearTimeout(timer);
      timer = setTimeout(() => { held = true; this._fire(cfg, "hold"); }, 500);
    });
    for (const ev of ["pointerup", "pointerleave", "pointercancel"]) this._card.addEventListener(ev, () => clearTimeout(timer));
    this._card.addEventListener("click", () => {
      if (held) return;
      this._fire(cfg, "tap");
    });
  }

  /** Opens or closes the advanced section; its cards are created the first time it opens. */
  async _toggle() {
    const more = this.shadowRoot.querySelector(".more");
    const box = this.shadowRoot.querySelector(".adv");
    if (!more || !box) return;
    more.classList.toggle("open", this._open);
    more.setAttribute("aria-expanded", String(this._open));
    more.querySelector("span").textContent = t(langOf(this._h), "advanced");
    box.hidden = !this._open;
    if (this._open && !this._adv.length && !this._loading) {
      this._loading = true;
      const helpers = window.loadCardHelpers ? await window.loadCardHelpers() : null;
      this._loading = false;
      if (!helpers) return;
      this._adv = (this._c.advanced || []).map((item) => {
        const { _wide, ...cfg } = advancedCard(item);
        const el = helpers.createCardElement(cfg);
        if (this._h) el.hass = this._h;
        if (_wide) el.classList.add("wide");
        box.appendChild(el);
        return el;
      });
    }
  }

  /** Everything the card shows; when none of it changed the card is left alone, so its animations keep running. */
  _signature() {
    const c = this._c;
    const ids = [c.entity, c.phase_entity, c.progress_entity, c.remaining_entity, c.finish_entity,
      ...(c.options || []).map((o) => itemOf(o).entity), ...(c.alerts || []).map((o) => itemOf(o).entity)].filter(Boolean);
    // The minute matters too: the time left is counted down from the finish time.
    return JSON.stringify([langOf(this._h), Math.floor(Date.now() / 60000), ids.map((id) => {
      const st = this._st(id);
      return st && [st.state, st.attributes.friendly_name];
    })]);
  }

  _dur(L, m) {
    if (m === null || m === undefined) return "";
    const n = Math.max(0, Math.round(m));
    return n >= 60 ? t(L, "h", { h: Math.floor(n / 60), m: n % 60 }) : t(L, "min", { n });
  }

  _render() {
    if (!this._c || !this._h) return;
    if (!this._skeleton) this._build();
    const sig = this._signature();
    if (sig === this._sig) return;
    this._sig = sig;
    const c = this._c;
    const L = langOf(this._h);
    const machine = this._st(c.entity);
    const phaseSt = this._st(c.phase_entity);
    const mode = modeOf(c, machine && machine.state, phaseSt && phaseSt.state);
    const active = mode === "running" || mode === "paused";
    const phase = active ? phaseLabel(this._h, L, c, phaseSt) : "";
    const pct = Math.max(0, Math.min(100, num((this._st(c.progress_entity) || {}).state, 0)));
    const { mins, finish } = timing(this._h, c);
    const rgb = rgbOf(c.color);
    const name = c.name || (machine && machine.attributes.friendly_name) || c.entity;
    const locale = (this._h.locale && this._h.locale.language) || L;
    const time = finish ? finish.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }) : "";
    const tone = { running: `rgb(${rgb})`, paused: "#f59e0b", finished: "#22c55e" }[mode] || "var(--secondary-text-color)";
    const where = c.phase_style || "tab";
    this._card.className = `${c.layout === "compact" ? "compact " : ""}${mode}${c.animate === false ? " still" : ""}${phase && where === "tab" ? " tabbed" : ""}`;
    this._card.style.setProperty("--rgb", rgb);
    this._card.style.setProperty("--st", tone);
    const more = this.shadowRoot.querySelector(".more span");
    if (more) more.textContent = t(L, "advanced");

    if (c.layout === "compact") {
      const sub = active ? [phase || t(L, mode), time && t(L, "ends_at", { time })].filter(Boolean).join(" · ") : t(L, mode);
      this._main.innerHTML = `<div class="row"><div class="ic ${mode}"><ha-icon icon="${esc(c.icon || "mdi:washing-machine")}"></ha-icon></div>
          <div class="txt"><div class="n">${esc(name)}</div><div class="s">${esc(sub)}</div></div>
          ${active && mins !== null ? `<div class="r">${esc(this._dur(L, mins))}</div>` : ""}</div>
        ${active ? `<div class="bar"><i style="width:${pct}%"></i></div>` : ""}`;
      return;
    }

    const state = `<div class="state"><i class="dot"></i><span class="st">${esc(t(L, mode))}</span>${phase && where === "inline" ? `<span class="ph">${esc(phase)}</span>` : ""}</div>`;
    const times = active && (finish || mins !== null)
      ? `<div class="times">${time ? `<b>${esc(t(L, "ends"))}</b><span>${esc(time)}</span>` : ""}${mins !== null ? `<b>${esc(t(L, "left"))}</b><span>${esc(this._dur(L, mins))}</span>` : ""}</div>`
      : "";
    const shown = mode === "finished" ? 100 : pct;
    const ring = active || mode === "finished" ? `<div class="ring"><svg viewBox="0 0 78 78" aria-hidden="true">
      <circle cx="39" cy="39" r="${R}" fill="none" stroke="var(--divider-color)" stroke-width="7"/>
      <circle class="arc" cx="39" cy="39" r="${R}" fill="none" stroke="${mode === "paused" ? "#f59e0b" : mode === "finished" ? "#22c55e" : `rgb(${rgb})`}" stroke-width="7" stroke-linecap="round"
        stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - shown / 100)}"/>
      ${mode === "running" && c.animate !== false ? shimmer(pct) : ""}</svg>
      <div class="pct">${mode === "finished" ? "✓" : `${Math.round(pct)}%`}</div></div>` : "";

    const ctl = c.controls || {};
    const buttons = [];
    if (mode === "running" && ctl.pause) buttons.push([ctl.pause, "mdi:pause", t(L, "pause"), ""]);
    if (mode === "paused" && (ctl.resume || ctl.start)) buttons.push([ctl.resume || ctl.start, "mdi:play", t(L, "resume"), "main"]);
    if (!active && mode !== "off" && ctl.start) buttons.push([ctl.start, "mdi:play", t(L, "start"), "main"]);
    if (active && ctl.stop) buttons.push([ctl.stop, "mdi:stop", t(L, "stop"), ""]);

    const chips = (c.options || []).map((o) => {
      const it = itemOf(o);
      const st = this._st(it.entity);
      if (!st) return "";
      const domain = it.entity.split(".")[0];
      const icon = it.icon || st.attributes.icon || "";
      let text;
      if (["switch", "input_boolean", "binary_sensor"].includes(domain)) {
        if (!ON.includes(lower(st.state))) return "";
        text = it.name || st.attributes.friendly_name;
      } else {
        const val = this._h.formatEntityState ? this._h.formatEntityState(st) : st.state;
        text = [it.name, val].filter(Boolean).join(" ");
      }
      return `<span class="chip" data-more="${esc(it.entity)}">${icon ? `<ha-icon icon="${esc(icon)}"></ha-icon>` : ""}${esc(text)}</span>`;
    }).join("");
    const alerts = (c.alerts || []).map((o) => {
      const it = itemOf(o);
      const st = this._st(it.entity);
      if (!st || !ON.includes(lower(st.state))) return "";
      return `<span class="chip warn" data-more="${esc(it.entity)}"><ha-icon icon="${esc(it.icon || "mdi:alert-outline")}"></ha-icon>${esc(it.name || st.attributes.friendly_name)}</span>`;
    }).join("");

    const tab = phase && where === "tab" ? `<div class="tab">${esc(phase)}</div>` : "";
    const onPhoto = phase && where === "photo" ? `<span class="on">${esc(phase)}</span>` : "";
    const picture = c.image
      ? `<div class="photo" style="background-image:url('${esc(c.image)}')">${onPhoto}</div>`
      : `<div class="photo icon"><ha-icon icon="${esc(c.icon || "mdi:washing-machine")}"></ha-icon>${onPhoto}</div>`;
    const ringBox = where === "ring" && ring ? `<div class="ringwrap">${ring}${phase ? `<div class="cap">${esc(phase)}</div>` : ""}</div>` : ring;
    const phaseChip = phase && where === "chip" ? `<span class="chip phase">${esc(phase)}</span>` : "";

    // While the machine stays in the same state the ring is kept: the light keeps running and the arc slides.
    const oldRing = this._ringMode === mode ? this._main.querySelector(".ring") : null;
    this._ringMode = mode;
    this._main.innerHTML = `${tab}<div class="top">${picture}
        <div class="info"><div class="name">${esc(name)}</div>${state}${times}</div>${ringBox}</div>
      ${buttons.length ? `<div class="controls">${buttons.map(([id, ic, lb, cls]) => `<button class="btn ${cls}" type="button" data-press="${esc(id)}"><ha-icon icon="${ic}"></ha-icon>${esc(lb)}</button>`).join("")}</div>` : ""}
      ${chips || alerts || phaseChip ? `<div class="chips">${phaseChip}${alerts}${chips}</div>` : ""}`;
    const fresh = this._main.querySelector(".ring");
    if (oldRing && fresh) {
      const arc = fresh.querySelector(".arc").getAttribute("stroke-dashoffset");
      const text = fresh.querySelector(".pct").textContent;
      // The light's path depends on how long the arc is: it restarts with the new length.
      const shine = fresh.querySelector(".shine");
      const oldShine = oldRing.querySelector(".shine");
      if (oldShine) oldShine.remove();
      if (shine) oldRing.querySelector(".arc").after(shine);
      fresh.replaceWith(oldRing);
      oldRing.querySelector(".arc").setAttribute("stroke-dashoffset", arc);
      oldRing.querySelector(".pct").textContent = text;
    }
    this._wire();
  }

  _wire() {
    this._main.querySelectorAll("[data-press]").forEach((b) => b.addEventListener("click", (e) => {
      e.stopPropagation();
      const [domain, service] = pressAction(b.dataset.press);
      this._h.callService(domain, service, { entity_id: b.dataset.press });
    }));
    this._main.querySelectorAll("[data-more]").forEach((b) => b.addEventListener("click", (e) => {
      e.stopPropagation();
      this._fire({ entity: b.dataset.more, tap_action: { action: "more-info" } }, "tap");
    }));
    for (const el of this._main.querySelectorAll("[data-press],[data-more]")) el.addEventListener("pointerdown", (e) => e.stopPropagation());
  }
}

/**
 * While the machine runs a light travels along the arc, from the start to where the cycle is, and starts over
 * (SMIL, so it needs no CSS variable for the arc's length). Too short an arc has no room for it.
 */
export const shimmer = (pct) => {
  const len = (C * Math.max(0, Math.min(100, pct))) / 100;
  if (len <= 30) return "";
  return `<circle class="shine" cx="39" cy="39" r="${R}" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="4" stroke-linecap="round"
    stroke-dasharray="14 ${C}" stroke-dashoffset="14" opacity="0">
    <animate attributeName="stroke-dashoffset" values="14;${-(len - 14)}" dur="2.4s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.8;1" dur="2.4s" repeatCount="indefinite"/></circle>`;
};

/* ------------------------------------------------------------------ editor */

const EDITOR_CSS = `
.list{margin-top:20px}
.list .head{font-weight:500;margin:0 0 4px}
.list .help{font-size:12px;color:var(--secondary-text-color);margin:0 0 10px}
.row{border:1px solid var(--divider-color);border-radius:12px;padding:10px 10px 4px;margin:0 0 10px}
.row .bar{display:flex;align-items:center;gap:4px;margin:0 0 6px;font-size:13px;color:var(--secondary-text-color)}
.row .bar span{flex:1}
.row .yaml{font-size:13px;color:var(--secondary-text-color);margin:0 0 8px}
.ed-btn{border:1px solid var(--divider-color);background:none;color:var(--primary-color);border-radius:18px;
  padding:6px 14px;font:inherit;font-weight:500;cursor:pointer}
.icon-btn{border:0;background:none;color:var(--secondary-text-color);width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer}
.icon-btn:hover{background:var(--secondary-background-color)}
.icon-btn:disabled{opacity:.3;cursor:default}
`;

const LISTS = [
  ["options", "h_options"],
  ["alerts", "h_alerts"],
  ["advanced", "h_advanced"]
];
const STATE_KEYS = ["running_states", "paused_states", "finished_states"];

class ApplianceHeroCardEditor extends HTMLElement {
  setConfig(config) {
    if (this._built && JSON.stringify(config) === this._sent) {
      this._config = { ...config };
      return;
    }
    const shape = (c) => JSON.stringify(LISTS.map(([k]) => ((c && c[k]) || []).length));
    const redraw = !this._built || shape(this._config) !== shape(config);
    this._config = { ...config };
    if (redraw) this._render();
    else if (this._main) this._main.data = this._mainData();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._built) this._render();
    else for (const f of this.querySelectorAll("ha-form")) f.hass = hass;
  }

  get _L() {
    return langOf(this._hass);
  }

  /** The form shows the defaults and flattens `controls` and the state lists; _emit puts them back. */
  _mainData() {
    const c = this._config;
    const d = { ...DEFAULTS, ...c, ...(c.controls || {}) };
    delete d.controls;
    for (const k of STATE_KEYS) if (c[k] !== undefined) d[k] = list(c[k]);
    for (const [k] of LISTS) delete d[k];
    return d;
  }

  _mainSchema(L) {
    const opts = (keys, pre) => keys.map((k) => ({ value: k, label: t(L, `${pre}${k}`) }));
    const ent = (name, domain) => ({ name, selector: { entity: domain ? { domain } : {} } });
    return [
      {
        type: "expandable", name: "", flatten: true, title: t(L, "sec_machine"), expanded: true, schema: [
          { name: "entity", required: true, selector: { entity: {} } },
          { type: "grid", name: "", schema: [{ name: "name", selector: { text: {} } }, { name: "icon", selector: { icon: {} } }] },
          { name: "image", selector: { text: {} } },
          {
            type: "grid", name: "", schema: [
              { name: "color", selector: { select: { mode: "dropdown", custom_value: true, options: Object.keys(COLORS) } } },
              { name: "layout", selector: { select: { mode: "dropdown", options: opts(["full", "compact"], "l_") } } }
            ]
          },
          {
            type: "grid", name: "", schema: [
              { name: "phase_style", selector: { select: { mode: "dropdown", options: opts(["tab", "inline", "chip", "photo", "ring"], "ps_") } } },
              { name: "animate", selector: { boolean: {} } }
            ]
          }
        ]
      },
      {
        type: "expandable", name: "", flatten: true, title: t(L, "sec_cycle"), schema: [
          ent("phase_entity"), ent("progress_entity", ["sensor", "number", "input_number"]),
          ent("remaining_entity", ["sensor", "number", "input_number", "input_datetime"]), ent("finish_entity", ["sensor", "input_datetime"])
        ]
      },
      {
        type: "expandable", name: "", flatten: true, title: t(L, "sec_controls"), schema: [
          ent("start", ["button", "input_button", "script", "scene", "switch"]),
          { type: "grid", name: "", schema: [ent("pause", ["button", "input_button", "script", "scene", "switch"]), ent("stop", ["button", "input_button", "script", "scene", "switch"])] }
        ]
      },
      {
        type: "expandable", name: "", flatten: true, title: t(L, "sec_states"), schema: STATE_KEYS.map((k) => ({ name: k, selector: { text: { multiple: true } } }))
      },
      {
        type: "expandable", name: "", flatten: true, title: t(L, "sec_actions"), schema: [
          { name: "tap_action", selector: { ui_action: {} } },
          { name: "hold_action", selector: { ui_action: {} } },
          { name: "advanced_open", selector: { boolean: {} } }
        ]
      }
    ];
  }

  _itemSchema(key) {
    const domain = key === "alerts" ? ["binary_sensor", "switch", "input_boolean"] : undefined;
    return [
      { name: "entity", required: true, selector: { entity: domain ? { domain } : {} } },
      { type: "grid", name: "", schema: [{ name: "name", selector: { text: {} } }, { name: "icon", selector: { icon: {} } }] }
    ];
  }

  _form(schema, data, onChange) {
    const L = this._L;
    const f = document.createElement("ha-form");
    f.hass = this._hass;
    f.schema = schema;
    f.data = data;
    f.computeLabel = (s) => (s.name ? t(L, `f_${s.name}`) : "");
    f.computeHelper = (s) => {
      const k = STATE_KEYS.includes(s.name) ? "h_states" : `h_${s.name}`;
      return has(L, k) ? t(L, k) : undefined;
    };
    f.addEventListener("value-changed", (ev) => {
      ev.stopPropagation();
      onChange(ev.detail.value);
    });
    return f;
  }

  _emit(config) {
    const out = { type: "custom:appliance-hero-card", ...config };
    const controls = {};
    for (const k of ["start", "pause", "stop", "resume"]) {
      if (out[k]) controls[k] = out[k];
      delete out[k];
    }
    if (Object.keys(controls).length) out.controls = controls;
    else delete out.controls;
    for (const [k, v] of Object.entries(DEFAULTS)) if (out[k] === v) delete out[k];
    for (const k of STATE_KEYS) if (Array.isArray(out[k])) out[k] = out[k].map((s) => String(s).trim()).filter(Boolean);
    for (const k of Object.keys(out)) {
      const v = out[k];
      if (v === "" || v === undefined || v === null || (Array.isArray(v) && !v.length)) delete out[k];
    }
    for (const [k] of LISTS) {
      if (Array.isArray(out[k])) {
        out[k] = out[k].map((x) => {
          if (typeof x === "string" || x.type) return x;
          const o = { ...x };
          for (const p of Object.keys(o)) if (o[p] === "" || o[p] === undefined) delete o[p];
          return o;
        });
      }
    }
    this._config = out;
    this._sent = JSON.stringify(out);
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: out }, bubbles: true, composed: true }));
  }

  _list(key, helpKey) {
    const L = this._L;
    const box = document.createElement("div");
    box.className = `list ${key}`;
    box.innerHTML = `<div class="head">${esc(t(L, key === "advanced" ? "advanced_list" : key))}</div><div class="help">${esc(t(L, helpKey))}</div><div class="rows"></div>
      <button class="ed-btn add" type="button">${esc(t(L, "add"))}</button>`;
    const items = () => (Array.isArray(this._config[key]) ? this._config[key] : []).map((x) => (typeof x === "string" ? { entity: x } : x));
    const set = (next, redraw = true) => {
      this._emit({ ...this._mainData(), ...this._configLists(), [key]: next });
      if (redraw) this._render();
    };
    const all = items();
    all.forEach((item, i) => {
      const row = document.createElement("div");
      row.className = "row";
      row.innerHTML = `<div class="bar"><span>${esc(t(L, "item_n", { n: i + 1 }))}</span>
        <button class="icon-btn up" type="button" aria-label="${esc(t(L, "up"))}" ${i === 0 ? "disabled" : ""}>↑</button>
        <button class="icon-btn down" type="button" aria-label="${esc(t(L, "down"))}" ${i === all.length - 1 ? "disabled" : ""}>↓</button>
        <button class="icon-btn remove" type="button" aria-label="${esc(t(L, "remove"))}">✕</button></div>`;
      if (item.type) {
        const note = document.createElement("div");
        note.className = "yaml";
        note.textContent = t(L, "card_yaml", { type: item.type });
        row.appendChild(note);
      } else {
        row.appendChild(this._form(this._itemSchema(key), item, (v) => {
          const next = items();
          next[i] = v;
          set(next, false);
        }));
      }
      const move = (d) => {
        const next = items();
        [next[i], next[i + d]] = [next[i + d], next[i]];
        set(next);
      };
      row.querySelector(".up").addEventListener("click", () => move(-1));
      row.querySelector(".down").addEventListener("click", () => move(1));
      row.querySelector(".remove").addEventListener("click", () => set(items().filter((_, k) => k !== i)));
      box.querySelector(".rows").appendChild(row);
    });
    box.querySelector(".add").addEventListener("click", () => set([...items(), { entity: "" }]));
    return box;
  }

  _configLists() {
    const out = {};
    for (const [k] of LISTS) if (this._config[k] !== undefined) out[k] = this._config[k];
    if (this._config.phases) out.phases = this._config.phases;
    return out;
  }

  _render() {
    if (!this._config || !this._hass) return;
    this._built = true;
    const L = this._L;
    this.innerHTML = `<style>${EDITOR_CSS}</style>`;
    this._main = this._form(this._mainSchema(L), this._mainData(), (v) => this._emit({ ...v, ...this._configLists() }));
    this.appendChild(this._main);
    for (const [k, h] of LISTS) this.appendChild(this._list(k, h));
  }
}

if (!customElements.get("appliance-hero-card")) {
  customElements.define("appliance-hero-card", ApplianceHeroCard);
  customElements.define("appliance-hero-card-editor", ApplianceHeroCardEditor);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: "appliance-hero-card",
    name: "Appliance Hero Card",
    description: "A washer, dryer or dishwasher at a glance: phase, progress ring, finish time, controls, options and alerts",
    preview: true,
    documentationURL: "https://github.com/sleepyraptor/homeassistant-appliance-hero-card"
  });
  console.info(`%c APPLIANCE-HERO-CARD %c ${VERSION} `, "color:#fff;background:#3b82f6;font-weight:700", "color:#3b82f6");
}
