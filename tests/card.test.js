import test from "node:test";
import assert from "node:assert/strict";
import { boot, fakeHass, makeCard, st, $, $$ } from "./helpers.js";

const W = "sensor.washer_state";
const BASE = {
  entity: W,
  name: "Washer",
  phase_entity: "sensor.washer_phase",
  progress_entity: "sensor.washer_progress",
  remaining_entity: "sensor.washer_remaining",
  controls: { start: "button.washer_start", pause: "button.washer_pause", stop: "button.washer_stop" }
};
const states = (state, phase = "rinse", progress = "62", remaining = "38", extra = {}) => ({
  [W]: st(state, { friendly_name: "Washer state" }),
  "sensor.washer_phase": st(phase),
  "sensor.washer_progress": st(progress, { unit_of_measurement: "%" }),
  "sensor.washer_remaining": st(remaining, { unit_of_measurement: "min" }),
  ...extra
});

test("the mode comes from the state, from your own lists, or from a phase that says it has finished", async () => {
  const { modeOf } = await boot();
  assert.equal(modeOf({}, "active"), "running");
  assert.equal(modeOf({}, "run"), "running");
  assert.equal(modeOf({}, "on"), "running");
  assert.equal(modeOf({}, "pause"), "paused");
  assert.equal(modeOf({}, "program_ended"), "finished");
  assert.equal(modeOf({}, "off"), "off");
  assert.equal(modeOf({}, "unavailable"), "off");
  assert.equal(modeOf({}, "idle"), "idle");
  assert.equal(modeOf({}, "idle", "finish"), "finished");
  assert.equal(modeOf({ running_states: ["Spinning up"] }, "spinning up"), "running");
  assert.equal(modeOf({ running_states: "go, going" }, "going"), "running");
  assert.equal(modeOf({ running_states: ["go"] }, "active"), "idle", "your list replaces the default one");
});

test("the phase in words: your name, the card's translation, the integration's, or the raw state tidied up", async () => {
  const { phaseLabel } = await boot();
  const hass = { formatEntityState: (s) => (s.state === "eco_wash" ? "Eco wash" : s.state) };
  assert.equal(phaseLabel(hass, "en", {}, st("rinse")), "Rinsing");
  assert.equal(phaseLabel(hass, "it", {}, st("rinse")), "Risciacquo");
  assert.equal(phaseLabel(hass, "it", { phases: { rinse: "Sciacquo" } }, st("rinse")), "Sciacquo");
  assert.equal(phaseLabel(hass, "en", {}, st("eco_wash")), "Eco wash");
  assert.equal(phaseLabel(hass, "en", {}, st("main_wash-hot")), "Main wash hot");
  assert.equal(phaseLabel(hass, "en", {}, st("unknown")), "");
  assert.equal(phaseLabel(hass, "en", {}, undefined), "");
});

test("time left from minutes, hours, seconds, H:MM or a timestamp — and the finish time from it", async () => {
  const { timing } = await boot();
  const now = Date.parse("2026-10-19T10:00:00Z");
  const h = (r, f) => ({ states: { "sensor.r": r, ...(f ? { "sensor.f": f } : {}) } });
  const cfg = { remaining_entity: "sensor.r", finish_entity: "sensor.f" };
  assert.equal(timing(h(st("38", { unit_of_measurement: "min" })), cfg, now).mins, 38);
  assert.equal(timing(h(st("1.5", { unit_of_measurement: "h" })), cfg, now).mins, 90);
  assert.equal(timing(h(st("600", { unit_of_measurement: "s" })), cfg, now).mins, 10);
  assert.equal(timing(h(st("1:25:00")), cfg, now).mins, 85);
  const ts = timing(h(st("2026-10-19T10:45:00Z", { device_class: "timestamp" })), cfg, now);
  assert.equal(ts.mins, 45);
  assert.equal(ts.finish.toISOString(), "2026-10-19T10:45:00.000Z");
  assert.equal(timing(h(st("38", { unit_of_measurement: "min" })), cfg, now).finish.toISOString(), "2026-10-19T10:38:00.000Z");
  const both = timing(h(st("40", { unit_of_measurement: "min" }), st("2026-10-19T10:50:00Z")), cfg, now);
  assert.equal(both.mins, 40, "the duration wins for the time left");
  assert.equal(both.finish.toISOString(), "2026-10-19T10:50:00.000Z", "the finish sensor wins for the end time");
  assert.deepEqual(timing(h(st("unknown")), cfg, now), { mins: null, finish: null });
  assert.equal(timing(h(st("2 h 34 min")), cfg, now).mins, null, "text is not read as a number");
});

test("colours: presets, r,g,b, #hex, arrays, and blue for anything else", async () => {
  const { rgbOf } = await boot();
  assert.equal(rgbOf("orange"), "249,115,22");
  assert.equal(rgbOf("10, 20, 30"), "10,20,30");
  assert.equal(rgbOf("#ff8000"), "255,128,0");
  assert.equal(rgbOf("#f80"), "255,136,0");
  assert.equal(rgbOf([1, 2, 3]), "1,2,3");
  assert.equal(rgbOf("rgb(4,5,6)"), "4,5,6");
  assert.equal(rgbOf("nonsense"), "59,130,246");
});

test("advanced entities become tiles with the control that fits them", async () => {
  const { advancedCard } = await boot();
  assert.deepEqual(advancedCard("select.cycle").features, [{ type: "select-options" }]);
  assert.equal(advancedCard("select.cycle")._wide, true);
  assert.equal(advancedCard({ entity: "number.delay", name: "Delay" }).features[0].style, "slider");
  assert.equal(advancedCard("switch.prewash").features[0].type, "toggle");
  assert.equal(advancedCard("switch.prewash")._wide, undefined);
  assert.equal(advancedCard("sensor.water").features, undefined);
  assert.deepEqual(advancedCard({ type: "entities", entities: ["sensor.x"] }), { type: "entities", entities: ["sensor.x"], _wide: true },
    "a whole card is used as is, across the full width");
});

test("running: tab with the phase, ring, time left, pause and stop, a light on the arc", async () => {
  const el = await makeCard({ ...BASE, color: "blue" }, fakeHass(states("active")));
  assert.match($(el, "ha-card").className, /running/);
  assert.equal($(el, ".tab").textContent, "Rinsing");
  assert.equal($(el, ".pct").textContent, "62%");
  assert.match($(el, ".times").textContent, /Remaining\s*38 min/);
  assert.match($(el, ".times").textContent, /Ends/);
  assert.deepEqual($$(el, ".btn").map((b) => b.textContent.trim()), ["Pause", "Stop"]);
  assert.ok($(el, ".shine"), "the light runs along the arc");
  assert.equal($(el, ".name").textContent, "Washer");
});

test("paused: amber, resume and stop, no light on the arc", async () => {
  const el = await makeCard(BASE, fakeHass(states("pause")));
  assert.match($(el, "ha-card").className, /paused/);
  assert.deepEqual($$(el, ".btn").map((b) => b.textContent.trim()), ["Resume", "Stop"]);
  assert.equal($(el, ".shine"), null);
  assert.equal($(el, ".arc").getAttribute("stroke"), "#f59e0b");
});

test("idle: tinted, no ring, no phase, a start button; finished: a full ring with a tick", async () => {
  const idle = await makeCard(BASE, fakeHass(states("idle", "idle", "0")));
  assert.match($(idle, "ha-card").className, /idle/);
  assert.equal($(idle, ".ring"), null);
  assert.equal($(idle, ".tab"), null);
  assert.deepEqual($$(idle, ".btn").map((b) => b.textContent.trim()), ["Start"]);
  const done = await makeCard(BASE, fakeHass(states("idle", "finish", "100")));
  assert.match($(done, "ha-card").className, /finished/);
  assert.equal($(done, ".pct").textContent, "✓");
  assert.equal(Number($(done, ".arc").getAttribute("stroke-dashoffset")), 0);
  const off = await makeCard(BASE, fakeHass(states("off")));
  assert.equal($$(off, ".btn").length, 0, "no start button while it is switched off");
});

test("the phase can go after the state, in a chip, on the photo or under the ring", async () => {
  const hass = fakeHass(states("active"));
  const inline = await makeCard({ ...BASE, phase_style: "inline" }, hass);
  assert.equal($(inline, ".state .ph").textContent, "Rinsing");
  assert.equal($(inline, ".tab"), null);
  assert.equal($(await makeCard({ ...BASE, phase_style: "chip" }, hass), ".chip.phase").textContent, "Rinsing");
  assert.equal($(await makeCard({ ...BASE, phase_style: "photo", image: "/local/w.png" }, hass), ".photo .on").textContent, "Rinsing");
  assert.equal($(await makeCard({ ...BASE, phase_style: "ring" }, hass), ".ringwrap .cap").textContent, "Rinsing");
});

test("an image, or the icon when there is none", async () => {
  const hass = fakeHass(states("idle"));
  assert.match($(await makeCard({ ...BASE, image: "/local/washer.png" }, hass), ".photo").getAttribute("style"), /washer\.png/);
  assert.equal($(await makeCard({ ...BASE, icon: "mdi:dishwasher" }, hass), ".photo.icon ha-icon").getAttribute("icon"), "mdi:dishwasher");
});

test("options show their value or appear while on; alerts only while on", async () => {
  const hass = fakeHass(states("active", "wash", "20", "50", {
    "select.temp": st("40"),
    "switch.prewash": st("on", { friendly_name: "Pre-wash" }),
    "switch.extra": st("off", { friendly_name: "Extra rinse" }),
    "binary_sensor.detergent": st("on", { friendly_name: "Detergent low" }),
    "binary_sensor.softener": st("off", { friendly_name: "Softener low" })
  }));
  hass.formatEntityState = (s) => (s.state === "40" ? "40 °C" : s.state);
  const el = await makeCard({ ...BASE, options: ["select.temp", "switch.prewash", "switch.extra"], alerts: ["binary_sensor.detergent", "binary_sensor.softener"] }, hass);
  assert.deepEqual($$(el, ".chip").map((c) => c.textContent), ["Detergent low", "40 °C", "Pre-wash"]);
  assert.equal($$(el, ".chip.warn").length, 1);
});

test("buttons press, run or turn on what they point at; chips open more-info", async () => {
  const hass = fakeHass(states("active"));
  const el = await makeCard({ ...BASE, controls: { pause: "script.washer_pause", stop: "button.washer_stop" }, options: ["sensor.washer_phase"] }, hass);
  const fired = [];
  el.addEventListener("hass-action", (e) => fired.push(e.detail));
  $$(el, ".btn")[0].click();
  $$(el, ".btn")[1].click();
  assert.deepEqual(hass.calls, [["script", "turn_on", { entity_id: "script.washer_pause" }], ["button", "press", { entity_id: "button.washer_stop" }]]);
  assert.equal(fired.length, 0, "a button is not a tap on the card");
  $(el, ".chip").click();
  assert.deepEqual(fired, [{ config: { entity: "sensor.washer_phase", tap_action: { action: "more-info" } }, action: "tap" }]);
});

test("a tap on the card runs tap_action, more-info by default", async () => {
  const el = await makeCard(BASE, fakeHass(states("idle")));
  const fired = [];
  el.addEventListener("hass-action", (e) => fired.push(e.detail));
  $(el, "ha-card").click();
  assert.equal(fired[0].action, "tap");
  assert.deepEqual(fired[0].config.tap_action, { action: "more-info" });
  assert.equal(fired[0].config.entity, W);
});

test("Italian, and the finish time in the user's locale", async () => {
  const el = await makeCard(BASE, fakeHass(states("pause", "drying", "41", "74"), "it"));
  assert.equal($(el, ".st").textContent, "In pausa");
  assert.equal($(el, ".tab").textContent, "Asciugatura");
  assert.match($(el, ".times").textContent, /Mancano\s*1 h 14 min/);
  assert.deepEqual($$(el, ".btn").map((b) => b.textContent.trim()), ["Riprendi", "Stop"]);
});

test("compact: one line with phase, finish time, time left and a bar", async () => {
  const el = await makeCard({ ...BASE, layout: "compact" }, fakeHass(states("active")));
  assert.match($(el, ".s").textContent, /^Rinsing · Ends at /);
  assert.equal($(el, ".r").textContent, "38 min");
  assert.equal($(el, ".bar i").style.width, "62%");
  assert.equal($(el, ".ring"), null);
});

test("redraws only when something it shows changes; the ring survives progress", async () => {
  const hass = fakeHass(states("active", "rinse", "40"));
  const el = await makeCard(BASE, hass);
  const ring = $(el, ".ring");
  el.hass = { ...hass, states: { ...hass.states, "light.other": st("on") } };
  assert.equal($(el, ".ring"), ring);
  el.hass = { ...hass, states: { ...hass.states, "sensor.washer_progress": st("55") } };
  assert.equal($(el, ".ring"), ring, "same ring, so the light keeps running");
  assert.equal($(el, ".pct").textContent, "55%");
  assert.equal($$(el, ".shine").length, 1);
  el.hass = { ...hass, states: { ...hass.states, [W]: st("pause") } };
  assert.notEqual($(el, ".ring"), ring, "a new state draws a new ring");
});

test("animate: false keeps the ring still", async () => {
  const el = await makeCard({ ...BASE, animate: false }, fakeHass(states("active")));
  assert.equal($(el, ".shine"), null);
  assert.match($(el, "ha-card").className, /still/);
});

test("the advanced section opens behind the chevron and builds its tiles once", async () => {
  const made = [];
  globalThis.window.loadCardHelpers = async () => ({
    createCardElement: (cfg) => {
      made.push(cfg);
      return globalThis.document.createElement("div");
    }
  });
  const el = await makeCard({ ...BASE, advanced: ["select.cycle", "switch.prewash"] }, fakeHass(states("idle")));
  assert.equal($(el, ".adv").hidden, true);
  $(el, ".more").click();
  await new Promise((r) => setTimeout(r, 10));
  assert.equal($(el, ".adv").hidden, false);
  assert.equal(made.length, 2);
  assert.equal(made[0]._wide, undefined, "the layout hint never reaches the tile");
  assert.ok($(el, ".adv").children[0].classList.contains("wide"));
  $(el, ".more").click();
  $(el, ".more").click();
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(made.length, 2);
  delete globalThis.window.loadCardHelpers;
});

test("a config without entity is refused; a stub config is offered", async () => {
  await boot();
  const Card = globalThis.customElements.get("appliance-hero-card");
  assert.throws(() => new Card().setConfig({}), /entity/);
  const stub = Card.getStubConfig({ states: { "sensor.living_temp": st("20"), "sensor.dryer_machine_state": st("idle") } });
  assert.deepEqual(stub, { entity: "sensor.dryer_machine_state", name: "Dryer", icon: "mdi:tumble-dryer" });
});

/* ------------------------------------------------------------- consumption */

const T0 = Date.parse("2026-10-19T08:00:00Z") / 1000;
const HISTORY = {
  [W]: [{ s: "idle", lu: T0 }, { s: "active", lu: T0 + 3600 }, { s: "pause", lu: T0 + 4000 }, { s: "active", lu: T0 + 4300 }],
  "sensor.washer_energy": [{ s: "12.1", lu: T0 }, { s: "12.3", lu: T0 + 3000 }, { s: "12.6", lu: T0 + 5000 }],
  "sensor.washer_water": [{ s: "unavailable", lu: T0 }, { s: "900", lu: T0 + 3700 }]
};

test("the cycle starts where the machine last left rest, pauses included; counters read at that moment", async () => {
  const { cycleBase } = await boot();
  const c = cycleBase(HISTORY, { entity: W }, ["sensor.washer_energy", "sensor.washer_water"]);
  assert.equal(c.start, (T0 + 3600) * 1000);
  assert.equal(c.base["sensor.washer_energy"], 12.3, "the last reading before the start");
  assert.equal(c.base["sensor.washer_water"], 900, "no reading before: the first one after");
  const done = cycleBase({ [W]: [...HISTORY[W], { s: "idle", lu: T0 + 9000 }] }, { entity: W }, []);
  assert.equal(done.start, (T0 + 3600) * 1000, "a finished cycle is still found");
  assert.equal(cycleBase({ [W]: [{ s: "idle", lu: T0 }] }, { entity: W }, []), null);
  assert.equal(cycleBase({}, { entity: W }, []), null);
  const custom = cycleBase({ [W]: [{ s: "Ready", lu: T0 }, { s: "Go", lu: T0 + 60 }] }, { entity: W, running_states: ["go"] }, []);
  assert.equal(custom.start, (T0 + 60) * 1000, "your own state lists count");
});

test("used: the difference, or the new value when the counter was reset", async () => {
  const { used } = await boot();
  assert.ok(Math.abs(used("12.9", 12.3) - 0.6) < 1e-9);
  assert.equal(used("0.4", 12.3), 0.4);
  assert.equal(used("unknown", 12.3), null);
  assert.equal(used("12", undefined), null);
});

const consumptionHass = (state, phase = "rinse") => {
  const hass = fakeHass(states(state, phase, "60", "30", {
    "sensor.washer_energy": st("12.9", { unit_of_measurement: "kWh", device_class: "energy" }),
    "sensor.washer_water": st("938", { unit_of_measurement: "L", device_class: "water" })
  }));
  hass.ws = [];
  hass.callWS = async (msg) => { hass.ws.push(msg); return HISTORY; };
  return hass;
};
const CONS = { ...BASE, consumption: ["sensor.washer_energy", { entity: "sensor.washer_water", decimals: 0 }] };

test("consumption: one history request per cycle, then this cycle's use under the times", async () => {
  const hass = consumptionHass("active");
  const el = await makeCard(CONS, hass);
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(hass.ws.length, 1);
  assert.equal(hass.ws[0].type, "history/history_during_period");
  assert.deepEqual(hass.ws[0].entity_ids, [W, "sensor.washer_energy", "sensor.washer_water"]);
  assert.match($(el, ".times").textContent, /Used\s*0\.6\s*kWh\s*38\s*L/);
  assert.deepEqual($$(el, ".use ha-icon").map((i) => i.getAttribute("icon")), ["mdi:lightning-bolt", "mdi:water"]);
  // Pausing and finishing are the same cycle: no new request.
  el.hass = { ...hass, states: { ...hass.states, [W]: st("pause") } };
  el.hass = { ...hass, states: { ...hass.states, [W]: st("idle"), "sensor.washer_phase": st("finish") } };
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(hass.ws.length, 1);
  assert.match($(el, ".times").textContent, /Used/, "still shown when it has finished");
  // At rest it goes away; the next cycle asks again.
  el.hass = { ...hass, states: { ...hass.states, [W]: st("idle"), "sensor.washer_phase": st("idle") } };
  assert.equal($(el, ".times"), null);
  el.hass = { ...hass, states: { ...hass.states, [W]: st("active") } };
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(hass.ws.length, 2);
  // Straight from finished to a new cycle also asks again.
  el.hass = { ...hass, states: { ...hass.states, [W]: st("idle"), "sensor.washer_phase": st("finish") } };
  el.hass = { ...hass, states: { ...hass.states, [W]: st("active") } };
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(hass.ws.length, 3);
});

test("consumption: nothing is asked without counters, and a failed request just hides the row", async () => {
  const quiet = consumptionHass("active");
  await makeCard(BASE, quiet);
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(quiet.ws.length, 0);
  const broken = consumptionHass("active");
  let asked = 0;
  broken.callWS = async () => { asked++; throw new Error("no recorder"); };
  const el = await makeCard(CONS, broken);
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(asked, 1, "one try per cycle, never a loop");
  assert.doesNotMatch($(el, ".times").textContent, /Used/);
  assert.match($(el, ".times").textContent, /Remaining/);
});

test("consumption in Italian, with the user's decimal separator", async () => {
  const hass = consumptionHass("active");
  hass.language = "it";
  hass.locale = { language: "it" };
  const el = await makeCard(CONS, hass);
  await new Promise((r) => setTimeout(r, 10));
  assert.match($(el, ".times").textContent, /Consumo\s*0,6\s*kWh/);
});
