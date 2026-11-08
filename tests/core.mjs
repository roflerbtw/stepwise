import { readFileSync } from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");
function boot(data = {}) {
  const nodes = new Map();
  const node = () => ({
    value: "",
    checked: false,
    hidden: false,
    textContent: "",
    classList: { toggle() {}, add() {}, remove() {} },
    setCustomValidity(v) {
      this.error = v;
    },
    reportValidity() {},
    focus() {},
    setAttribute() {},
    addEventListener() {},
    append() {},
    replaceChildren() {},
    style: { setProperty() {} },
    firstChild: {},
    querySelectorAll() {
      return [];
    },
  });
  const get = (s) => {
    if (!nodes.has(s)) nodes.set(s, node());
    return nodes.get(s);
  };
  const storage = new Map(Object.entries(data));
  const context = vm.createContext({
    document: {
      querySelector: get,
      documentElement: { ...node(), lang: "", dataset: {} },
      body: node(),
      addEventListener() {},
      createElement: node,
      createElementNS: node,
    },
    localStorage: {
      getItem: (k) => storage.get(k) ?? null,
      setItem: (k, v) => storage.set(k, v),
    },
    crypto: { randomUUID: () => String(Math.random()) },
    Date,
    Intl,
    Set,
    Math,
    JSON,
    Array,
    String,
    Number,
    Promise,
    setTimeout: () => 0,
    clearTimeout() {},
    setInterval() {},
    matchMedia: () => ({ matches: true }),
  });
  vm.runInContext(
    readFileSync(new URL("../ui.js", import.meta.url), "utf8"),
    context,
  );
  vm.runInContext(
    source.replace(/render\(\);\s*$/, "render=()=>{};renderList=()=>{};"),
    context,
  );
  return { get, run: (s) => vm.runInContext(s, context), storage };
}
const app = boot();
const submit = () => app.get("#add-form").onsubmit({ preventDefault() {} });
app.get("#new-task").value = "  Первый шаг  ";
app.get("#new-date").value = "2026-11-08";
submit();
assert.equal(app.run("tasks.length"), 1);
assert.equal(app.run("tasks[0].title"), "Первый шаг");
assert.equal(app.get("#new-task").value, "");
assert.equal(app.run("tasks[0].due"), "2026-11-08");
app.get("#new-task").value = "   ";
submit();
assert.equal(app.run("tasks.length"), 1);
app.get("#new-task").value = "x".repeat(181);
submit();
assert.equal(app.run("tasks.length"), 1);
app.run("tasks[0].done=true; tasks[0].star=true; save()");
const restored = boot(Object.fromEntries(app.storage));
assert.equal(restored.run("tasks[0].done"), true);
assert.equal(restored.run("tasks[0].star"), true);
app.get("#clear").onclick();
assert.equal(app.run("tasks.length"), 0);
app.get("#toast button").onclick();
assert.equal(app.run("tasks.length"), 1);
assert.equal(boot({ "stepwise-tasks": "broken" }).run("tasks.length"), 0);
assert.equal(boot({ "stepwise-tasks": "{}" }).run("tasks.length"), 0);
assert.equal(
  boot({
    "stepwise-tasks": JSON.stringify([
      { id: "a", title: "ok" },
      { id: "a", title: "duplicate" },
      { id: 7, title: "bad" },
    ]),
  }).run("tasks.length"),
  1,
);
assert.equal(boot({ "stepwise-language": '"unknown"' }).run("lang"), "ru");
assert.equal(
  app.run(
    "Object.keys(dictionary.ru).sort().join()===Object.keys(dictionary.en).sort().join()",
  ),
  true,
);
console.log(
  "Passed: creation, trimming, empty/length validation, deadline storage, completion/favorite persistence, clear + undo, corrupted storage, duplicate IDs, language fallback, translation parity.",
);
const markup = readFileSync(new URL("../index.html", import.meta.url), "utf8");
assert.ok(markup.includes('id="language-ru"'));
assert.ok(markup.includes('id="language-en"'));
assert.ok(markup.includes('class="theme-thumb"'));
assert.ok(!markup.includes('class="avatar"'));
assert.ok(!markup.includes('type="module"'));
app.run("lang='en';theme='light';syncControls()");
app.run("lang='ru';theme='dark';syncControls()");
console.log(
  "Passed: explicit language controls, theme structure, removed avatar, direct-file script loading, control synchronization.",
);
app.run("lang='ru';theme='dark';syncControls()");
assert.equal(app.get("#settings-theme").textContent, "Светлая тема");
assert.equal(app.get("#settings-language").textContent, "English");
app.run("lang='en';theme='light';syncControls()");
assert.equal(app.get("#settings-theme").textContent, "Dark theme");
assert.equal(app.get("#settings-language").textContent, "Русский");
app.run("lang='ru';theme='light';syncControls()");
assert.equal(app.get("#settings-theme").textContent, "Тёмная тема");
app.get("#compact").onchange({ target: { checked: true } });
assert.equal(JSON.parse(app.storage.get("stepwise-compact")), true);
app.get("#compact").onchange({ target: { checked: false } });
assert.equal(JSON.parse(app.storage.get("stepwise-compact")), false);
console.log(
  "Passed: settings show target theme/language, compact preference toggles and persists.",
);
app.get("#nav").querySelector = () => null;
app.run("changeView('today')");
assert.equal(app.get("#new-date").value, app.run("today()"));
app.get("#new-task").value = "Задача на сегодня";
submit();
assert.equal(app.run("tasks[tasks.length-1].due"), app.run("today()"));
assert.equal(app.get("#new-date").value, app.run("today()"));
app.run("changeView('tasks')");
assert.equal(app.get("#new-date").value, "");
console.log(
  "Passed: Today defaults new tasks to today, retains date after adding, All tasks resets optional date.",
);

app.run("lang='ru'");
assert.equal(app.run("relativeDue('2026-11-08','2026-11-08')"), "Сегодня");
assert.equal(app.run("relativeDue('2026-11-09','2026-11-08')"), "Завтра");
assert.equal(
  app.run("relativeDue('2026-11-13','2026-11-08')"),
  "Осталось: 5 дней",
);
assert.equal(
  app.run("relativeDue('2026-11-07','2026-11-08')"),
  "Просрочено на 1 день",
);
assert.equal(
  app.run("relativeDue('2027-01-02','2026-12-31')"),
  "Осталось: 2 дня",
);
app.run("lang='en'");
assert.equal(app.run("relativeDue('2026-11-13','2026-11-08')"), "5 days left");
app.run("filter='completed';query='hidden';changeView('today')");
assert.equal(app.run("filter"), "all");
assert.equal(app.run("query"), "");
assert.ok(app.run("tasks.some(task=>task.title==='Задача на сегодня')"));
console.log(
  "Passed: relative deadlines, overdue, year rollover, navigation resets filters, today task retained in shared list.",
);
app.run("layout='calendar';calendarDate='2026-11-20';changeView('tasks')");
app.get("#new-task").value = "Из календаря";
app.get("#new-date").value = "2026-11-20";
submit();
assert.equal(
  app.run("tasks.find(task=>task.title==='Из календаря').due"),
  "2026-11-20",
);
assert.equal(app.get("#new-date").value, "2026-11-20");
app.run("layout='list';changeView('today');changeView('tasks')");
assert.equal(
  app.run("tasks.filter(task=>task.title==='Из календаря').length"),
  1,
);
console.log(
  "Passed: calendar task persists in shared list and selected due date stays after adding.",
);
assert.equal(
  boot({
    "stepwise-tasks": JSON.stringify([
      { id: "a", title: "" },
      { id: "a", title: "Valid" },
    ]),
  }).run("tasks.length"),
  1,
);
assert.equal(app.run("validDate('2026-02-30')"), false);
assert.equal(app.run("validDate('2028-02-29')"), true);
assert.equal(app.run("addTask('   ')"), null);
console.log(
  "Passed: invalid dates, leap day, recovery after invalid duplicate ID, shared creation validation.",
);
