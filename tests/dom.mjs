import { JSDOM, VirtualConsole } from "jsdom";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import axe from "axe-core";
const errors = [];
const consoleOutput = new VirtualConsole();
consoleOutput.on("jsdomError", (error) => errors.push(error.message));
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const dom = new JSDOM(html, {
  url: "https://stepwise.example/",
  runScripts: "dangerously",
  pretendToBeVisual: true,
  virtualConsole: consoleOutput,
});
const { window } = dom;
window.scrollTo = () => {};
window.HTMLCanvasElement.prototype.getContext = () => null;
window.matchMedia = () => ({ matches: false, addEventListener() {} });
window.Element.prototype.scrollIntoView = function () {};
window.Element.prototype.animate = function (frames, options) {
  return { finished: Promise.resolve(), cancel() {} };
};
window.HTMLDialogElement.prototype.showModal = function () {
  this.open = true;
};
window.HTMLDialogElement.prototype.close = function () {
  this.open = false;
  this.dispatchEvent(new window.Event("close"));
};
for (const file of [
  "ui.js",
  "app.js",
  "calendar.js",
  "support.js",
  "planner.js",
]) {
  const script = window.document.createElement("script");
  script.textContent = readFileSync(
    new URL("../" + file, import.meta.url),
    "utf8",
  );
  window.document.body.append(script);
}
const $ = (s) => window.document.querySelector(s);
const click = (s) => {
  assert.ok($(s), "Missing " + s);
  $(s).click();
};
const submit = (s) =>
  $(s).dispatchEvent(
    new window.Event("submit", { bubbles: true, cancelable: true }),
  );
const settle = async () => {
  for (let i = 0; i < 12; i++) await Promise.resolve();
};
try {
  assert.equal($("#heading").textContent, "Каждый шаг имеет значение.");
  assert.equal($("#nav").children.length, 4);
  $("#new-task").value = "Через общую форму";
  $("#new-date").value = "2026-12-20";
  submit("#add-form");
  assert.equal($(".task-title").textContent, "Через общую форму");
  click("#layout-calendar");
  assert.equal($("#planner").hidden, false);
  assert.equal($(".planner-composer"), null);
  click(".planner-day.selected");
  assert.ok($(".planner-composer.is-opening"));
  const date = $("#new-date").value;
  $(".planner-add input").value = "Через календарь";
  submit(".planner-add");
  assert.equal($(".planner-composer.is-opening"), null);
  assert.ok(
    [...window.document.querySelectorAll(".task-title")].some(
      (n) => n.textContent === "Через календарь",
    ),
  );
  click(".planner-day.selected");
  await settle();
  assert.equal($(".planner-composer"), null);
  click(".planner-day.selected");
  assert.ok($(".planner-composer"));
  click("#layout-list");
  assert.equal(window.document.querySelectorAll(".task").length, 2);
  click(".task-actions button:nth-child(2)");
  $(".edit-input").value = "Исправленное название";
  $(".edit-input").dispatchEvent(
    new window.KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
  );
  assert.ok(
    [...window.document.querySelectorAll(".task-title")].some(
      (n) => n.textContent === "Исправленное название",
    ),
  );
  $(".check").focus();
  click(".check");
  await new Promise(window.requestAnimationFrame);
  assert.ok(window.document.activeElement.matches(".check"));
  assert.equal($("#completed").textContent, "1");
  click("#clear");
  assert.equal(window.document.querySelectorAll(".task").length, 1);
  click("#toast button");
  assert.equal(window.document.querySelectorAll(".task").length, 2);
  click("#robot-help");
  assert.equal($(".support-dialog").open, true);
  assert.equal($(".telegram-link").href, "https://t.me/roflerbtw");
  click(".support-close");
  assert.equal($(".support-dialog").open, false);
  click("#new-date");
  assert.equal($(".calendar-dialog").open, true);
  click(".calendar-actions button:last-child");
  assert.equal($(".calendar-dialog").open, false);
  click("#language-en");
  await settle();
  assert.equal(window.document.documentElement.lang, "en");
  assert.equal($("#settings-language").textContent, "Русский");
  click("#nav button:last-child");
  assert.equal($("#settings-view").hidden, false);
  click("#theme");
  await settle();
  assert.equal(window.document.documentElement.dataset.theme, "light");
  const saved = JSON.parse(window.localStorage.getItem("stepwise-tasks"));
  assert.equal(saved.length, 2);
  assert.ok(saved.some((task) => task.due === date));
  for (const id of ["large-text", "high-contrast"]) {
    click("#" + id);
    assert.ok(window.document.documentElement.classList.contains(id));
    assert.equal(window.localStorage.getItem("stepwise-" + id), "true");
  }
  assert.ok(
    $("#settings-theme").getAttribute("aria-label").includes("Dark theme"),
  );
  assert.equal($(".skip-link").getAttribute("href"), "#main");
  const axeScript = window.document.createElement("script");
  axeScript.textContent = axe.source;
  window.document.body.append(axeScript);
  for (const target of ["settings", "tasks", "today", "statistics"]) {
    const index = ["tasks", "today", "statistics", "settings"].indexOf(target);
    click(`#nav button:nth-child(${index + 1})`);
    const report = await window.axe.run(window.document, {
      rules: { "color-contrast": { enabled: false } },
    });
    assert.deepEqual(
      Array.from(report.violations, (v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      [],
      `Accessibility: ${target}`,
    );
  }
  assert.deepEqual(errors, []);
  console.log(
    "DOM integration passed: real startup, shared task forms, calendar open/close, no animation replay, editing, completion, undo, dialogs, localization, navigation, theme, persistence.",
  );
} finally {
  window.close();
}
