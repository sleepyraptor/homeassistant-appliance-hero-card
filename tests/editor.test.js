import test from "node:test";
import assert from "node:assert/strict";
import { boot } from "./helpers.js";

async function makeEditor(config, language = "en") {
  await boot();
  const ed = globalThis.document.createElement("appliance-hero-card-editor");
  ed.hass = { states: {}, locale: { language }, language };
  ed.setConfig({ type: "custom:appliance-hero-card", ...config });
  ed.addEventListener("config-changed", (e) => { ed.last = e.detail.config; });
  return ed;
}
const main = (ed) => ed.querySelector("ha-form");
const rows = (ed, key) => Array.from(ed.querySelectorAll(`.list.${key} .row`));
const change = (form, value) => form.dispatchEvent(new globalThis.CustomEvent("value-changed", { detail: { value } }));

test("the card offers its editor", async () => {
  await boot();
  assert.equal(globalThis.customElements.get("appliance-hero-card").getConfigElement().tagName.toLowerCase(), "appliance-hero-card-editor");
});

test("every option is in the form, grouped in sections", async () => {
  const ed = await makeEditor({ entity: "sensor.w" });
  const s = JSON.stringify(main(ed).schema);
  for (const k of ["entity", "name", "icon", "image", "color", "layout", "phase_style", "animate", "phase_entity", "progress_entity",
    "remaining_entity", "finish_entity", "start", "pause", "stop", "running_states", "paused_states", "finished_states",
    "tap_action", "hold_action", "advanced_open"]) {
    assert.match(s, new RegExp(`"name":"${k}"`), k);
  }
  assert.equal((s.match(/"type":"expandable"/g) || []).length, 5);
});

test("defaults are shown but never written back; buttons go back under controls", async () => {
  const ed = await makeEditor({ entity: "sensor.w", controls: { start: "button.s" }, phases: { rinse: "Sciacquo" } });
  assert.equal(main(ed).data.phase_style, "tab");
  assert.equal(main(ed).data.start, "button.s");
  change(main(ed), { ...main(ed).data, name: "Washer", stop: "button.x" });
  assert.deepEqual(ed.last, {
    type: "custom:appliance-hero-card", entity: "sensor.w", name: "Washer",
    controls: { start: "button.s", stop: "button.x" }, phases: { rinse: "Sciacquo" }
  });
});

test("state lists are cleaned and dropped when empty", async () => {
  const ed = await makeEditor({ entity: "sensor.w" });
  change(main(ed), { ...main(ed).data, running_states: ["go ", ""], paused_states: [] });
  assert.deepEqual(ed.last.running_states, ["go"]);
  assert.equal(ed.last.paused_states, undefined);
});

test("options, alerts and advanced: add, edit, move, remove; cards written in YAML are kept", async () => {
  const ed = await makeEditor({ entity: "sensor.w", options: ["select.t"], advanced: [{ type: "entities", entities: ["sensor.x"] }] });
  assert.equal(rows(ed, "options").length, 1);
  ed.querySelector(".list.options .add").click();
  change(rows(ed, "options")[1].querySelector("ha-form"), { entity: "switch.p", name: "Pre-wash", icon: "" });
  rows(ed, "options")[1].querySelector(".up").click();
  assert.deepEqual(ed.last.options, [{ entity: "switch.p", name: "Pre-wash" }, { entity: "select.t" }]);
  assert.match(rows(ed, "advanced")[0].textContent, /entities/);
  assert.deepEqual(ed.last.advanced, [{ type: "entities", entities: ["sensor.x"] }]);
  ed.querySelector(".list.alerts .add").click();
  assert.equal(rows(ed, "alerts").length, 1);
  rows(ed, "alerts")[0].querySelector(".remove").click();
  assert.equal(ed.last.alerts, undefined);
});

test("labels in Italian", async () => {
  const ed = await makeEditor({ entity: "sensor.w" }, "it");
  assert.equal(main(ed).computeLabel({ name: "entity" }), "Stato della macchina");
  assert.match(ed.querySelector(".list.advanced .head").textContent, /Avanzate/);
});

test("consumption counters in the editor, with decimals", async () => {
  const ed = await makeEditor({ entity: "sensor.w" });
  ed.querySelector(".list.consumption .add").click();
  const form = rows(ed, "consumption")[0].querySelector("ha-form");
  assert.match(JSON.stringify(form.schema), /"name":"decimals"/);
  change(form, { entity: "sensor.energy", decimals: 1 });
  assert.deepEqual(ed.last.consumption, [{ entity: "sensor.energy", decimals: 1 }]);
});
