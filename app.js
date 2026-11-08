const $ = (s) => document.querySelector(s),
  root = document.documentElement;
const dictionary = {
  ru: {
    listLayout: "Список",
    calendarLayout: "Календарь",
    workspace: "Личное пространство",
    tasks: "Все задачи",
    today: "Сегодня",
    statistics: "Статистика",
    settings: "Настройки",
    smallSteps: "Большое начинается с малого",
    robotText: "Я рядом. Просто сделай следующий шаг.",
    heading: "Каждый шаг имеет значение.",
    subtitle:
      "Все твои задачи: со сроком и без. «Сегодня» показывает только задачи со сроком на сегодня.",
    yourProgress: "Твой прогресс",
    total: "Всего задач",
    active: "Активные",
    completed: "Выполненные",
    myTasks: "Мои задачи",
    newTask: "Какой следующий шаг?",
    add: "Добавить",
    all: "Все",
    search: "Найти задачу…",
    clearCompleted: "Удалить выполненные",
    theme: "Оформление",
    toggleTheme: "Сменить тему",
    lightTheme: "Светлая тема",
    darkTheme: "Тёмная тема",
    language: "Язык",
    themeHelp: "Меняет светлое и тёмное оформление приложения.",
    languageHelp: "Переводит интерфейс. Названия задач не меняются.",
    compactHelp:
      "Уменьшает отступы в карточках, чтобы на экране помещалось больше задач.",
    compact: "Компактный список",
    localNote: "Задачи хранятся только в этом браузере на этом устройстве.",
    undo: "Отменить",
    deleted: "Задача удалена",
    cleared: "Выполненные задачи удалены",
    empty: "Здесь начинается новый шаг",
    emptyText: "Добавь первую задачу - даже маленькую.",
    noResults: "Ничего не найдено",
    noResultsText: "Попробуй другой поиск или фильтр.",
    remaining: (n) => `Осталось задач: ${n}`,
    progress: (a, b) => `Выполнено ${a} из ${b} задач`,
    edit: "Редактировать",
    remove: "Удалить",
    star: "Избранное",
    complete: "Изменить статус",
    save: "Сохранить",
    cancel: "Отмена",
    deadline: "Срок выполнения",
    dueOptional: "Срок - необязательно",
    dueHelp:
      "Дата - срок выполнения задачи. Без даты задача останется только в общем списке.",
    todayHelp: "Новая задача появится в «Сегодня» и в общем списке.",
    todayEmpty: "На сегодня задач нет",
    todayEmptyText:
      "Здесь задачи со сроком на сегодня. Добавь задачу ниже или назначь сегодняшний срок в общем списке.",
    todayTitle: "Сфокусируйся на сегодня.",
    todaySubtitle:
      "Только задачи со сроком на сегодня. Задачи без срока ищи в разделе «Все задачи».",
    statsTitle: "Твой путь в цифрах.",
    statsSubtitle: "Каждая выполненная задача - движение вперёд.",
    settingsTitle: "В твоём ритме.",
    settingsSubtitle: "Настрой пространство под себя.",
    favorites: "Избранные",
    late: "Просроченные",
    invalid: "Введи название от 1 до 180 символов.",
    storageError: "Не удалось сохранить данные. Проверь доступность хранилища.",
    brand: "Шаг за шагом",
  },
  en: {
    listLayout: "List",
    calendarLayout: "Calendar",
    workspace: "Personal workspace",
    tasks: "All tasks",
    today: "Today",
    statistics: "Statistics",
    settings: "Settings",
    smallSteps: "Great things start small",
    robotText: "I’m here. Just take the next step.",
    heading: "Every step counts.",
    subtitle:
      "Every task, with or without a due date. Today shows only tasks due today.",
    yourProgress: "Your progress",
    total: "Total tasks",
    active: "Active",
    completed: "Completed",
    myTasks: "My tasks",
    newTask: "What’s your next step?",
    add: "Add task",
    all: "All",
    search: "Find a task…",
    clearCompleted: "Delete completed",
    theme: "Appearance",
    toggleTheme: "Switch theme",
    lightTheme: "Light theme",
    darkTheme: "Dark theme",
    language: "Language",
    themeHelp: "Switches the app between light and dark appearance.",
    languageHelp: "Changes the interface language. Task titles stay unchanged.",
    compactHelp: "Reduces spacing in task cards so more tasks fit on screen.",
    compact: "Compact list",
    localNote: "Tasks are stored only in this browser on this device.",
    undo: "Undo",
    deleted: "Task deleted",
    cleared: "Completed tasks removed",
    empty: "Your next step starts here",
    emptyText: "Add your first task. Small is a great start.",
    noResults: "No tasks found",
    noResultsText: "Try another search or filter.",
    remaining: (n) => `${n} tasks remaining`,
    progress: (a, b) => `${a} of ${b} tasks completed`,
    edit: "Edit task",
    remove: "Delete task",
    star: "Favorite",
    complete: "Toggle completion",
    save: "Save",
    cancel: "Cancel",
    deadline: "Due date",
    dueOptional: "Due date - optional",
    dueHelp:
      "The date is the task deadline. Tasks without a date appear only in All tasks.",
    todayHelp: "New tasks appear in Today and All tasks.",
    todayEmpty: "Nothing due today",
    todayEmptyText:
      "Tasks due today appear here. Add one below or set today’s date on an existing task.",
    todayTitle: "Make space for today.",
    todaySubtitle:
      "Only tasks due today. Find tasks without a due date in All tasks.",
    statsTitle: "Your journey in numbers.",
    statsSubtitle: "Every completed task is a step forward.",
    settingsTitle: "Find your rhythm.",
    settingsSubtitle: "Make this workspace your own.",
    favorites: "Favorites",
    late: "Overdue",
    invalid: "Enter a title between 1 and 180 characters.",
    storageError: "Could not save data. Check browser storage availability.",
    brand: "Stepwise",
  },
};
function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
let lang = read("stepwise-language", "ru");
if (!["ru", "en"].includes(lang)) lang = "ru";
let theme = read("stepwise-theme", "dark");
if (!["dark", "light"].includes(theme)) theme = "dark";
let tasks = read("stepwise-tasks", []);
const validDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const date = new Date(value + "T12:00:00Z");
  return !isNaN(date) && date.toISOString().slice(0, 10) === value;
};
const ids = new Set();
tasks = Array.isArray(tasks)
  ? tasks
      .filter(
        (t) =>
          t &&
          typeof t.id === "string" &&
          !ids.has(t.id) &&
          typeof t.title === "string" &&
          t.title.trim() &&
          t.title.length <= 180 &&
          ids.add(t.id),
      )
      .map((t) => ({
        id: t.id,
        title: t.title.trim(),
        done: t.done === true,
        star: t.star === true,
        due: validDate(t.due) ? t.due : "",
        created:
          typeof t.created === "string" && !isNaN(Date.parse(t.created))
            ? t.created
            : new Date().toISOString(),
      }))
  : [];
let layout = "list",
  calendarDate = today();
let view = "tasks",
  filter = "all",
  query = "",
  busy = false,
  languageBusy = false,
  undoAction = null,
  toastTimer,
  editing = null;
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const t = (k, ...a) =>
  typeof dictionary[lang][k] === "function"
    ? dictionary[lang][k](...a)
    : dictionary[lang][k] || k;
function persist(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    notify(t("storageError"));
  }
}
function save() {
  persist("stepwise-tasks", tasks);
}
function addTask(title, due = "") {
  const trimmed = title.trim();
  if (!trimmed || trimmed.length > 180) return null;
  const task = {
    id: crypto.randomUUID(),
    title: trimmed,
    done: false,
    star: false,
    due: validDate(due) ? due : "",
    created: new Date().toISOString(),
  };
  tasks.push(task);
  save();
  return task;
}
function today() {
  return UI.dateValue(new Date());
}
function late(task) {
  return !task.done && task.due && task.due < today();
}
function dateLabel(date) {
  return new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "en-GB", {
    day: "numeric",
    month: "short",
  }).format(new Date(date + "T12:00:00"));
}
const el = UI.element;
function button(text, label, action, cls = "") {
  const b = el("button", cls, text);
  if (["★", "☆", "✎", "×", "✓"].includes(text)) {
    b.replaceChildren(actionIcon(text));
  }
  b.type = "button";
  b.title = label;
  b.setAttribute("aria-label", label);
  b.addEventListener("click", action);
  return b;
}
function notify(message, action = null) {
  clearTimeout(toastTimer);
  undoAction = action;
  $("#toast span").textContent = message;
  $("#toast button").hidden = !action;
  $("#toast").hidden = false;
  toastTimer = setTimeout(() => {
    $("#toast").hidden = true;
    undoAction = null;
  }, 6000);
}
$("#toast button").onclick = () => {
  undoAction?.();
  $("#toast").hidden = true;
  undoAction = null;
};
function render() {
  root.lang = lang;
  root.dataset.theme = theme;
  document.title = `${t("brand")} · ${t("tasks")}`;
  $("#brand-name").textContent = t("brand");
  document
    .querySelectorAll("[data-t]")
    .forEach((n) => (n.textContent = t(n.dataset.t)));
  document
    .querySelectorAll("[data-placeholder]")
    .forEach((n) => (n.placeholder = t(n.dataset.placeholder)));
  $("#new-task").setAttribute("aria-label", t("newTask"));
  $("#new-date").setAttribute("aria-label", t("deadline"));
  $("#theme").setAttribute("aria-label", t("toggleTheme"));
  $("#theme").title = t("toggleTheme");
  $("#language").setAttribute("aria-label", t("language"));
  syncControls();
  $("#task-layout-tabs").hidden = view !== "tasks";
  $("#planner").hidden = view !== "tasks" || layout !== "calendar";
  $("#new-date")
    .closest?.(".date-add")
    ?.classList.toggle("today-date", view === "today");
  $("#due-help").textContent = t(view === "today" ? "todayHelp" : "dueHelp");
  $("#search").setAttribute("aria-label", t("search"));
  $("#date").textContent = new Intl.DateTimeFormat(
    lang === "ru" ? "ru-RU" : "en-GB",
    { weekday: "long", day: "numeric", month: "long" },
  ).format(new Date());
  $("#crumb").textContent = t(view);
  $("#heading").textContent = t(
    {
      tasks: "heading",
      today: "todayTitle",
      statistics: "statsTitle",
      settings: "settingsTitle",
    }[view],
  );
  $("#subtitle").textContent = t(
    {
      tasks: "subtitle",
      today: "todaySubtitle",
      statistics: "statsSubtitle",
      settings: "settingsSubtitle",
    }[view],
  );
  renderNavigation();
  const done = renderSummary();
  $("#tasks-view").hidden = !["tasks", "today"].includes(view);
  $("#settings-view").hidden = view !== "settings";
  $("#stats-view").hidden = view !== "statistics";
  $("#details").replaceChildren(
    ...[
      ["total", tasks.length],
      ["active", tasks.length - done],
      ["completed", done],
      ["favorites", tasks.filter((t) => t.star).length],
      ["late", tasks.filter(late).length],
    ].map(([key, n]) => el("div", "", `${t(key)}: ${n}`)),
  );
  $("#filters").replaceChildren(
    ...["all", "active", "completed"].map((key) => {
      let b = button(
        t(key),
        t(key),
        () => {
          filter = key;
          editing = null;
          renderList();
          renderFilters();
        },
        filter === key ? "selected" : "",
      );
      b.dataset.filter = key;
      b.setAttribute("aria-pressed", filter === key);
      return b;
    }),
  );
  renderList();
  document.dispatchEvent(new Event("stepwise-render"));
}
function renderSummary() {
  const done = tasks.filter((t) => t.done).length,
    pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  $("#total").textContent = tasks.length;
  $("#active").textContent = tasks.length - done;
  $("#completed").textContent = done;
  $("#percent").replaceChildren(
    document.createTextNode(String(pct)),
    el("span", "", "%"),
  );
  $("#arc").style.strokeDashoffset = 289.03 * (1 - pct / 100);
  $("#progress-text").textContent = t("progress", done, tasks.length);
  $("#remaining").textContent = t(
    "remaining",
    tasks.filter((task) => !task.done && inCurrentView(task)).length,
  );
  $("#clear").disabled = !done;
  $("#task-count").textContent = tasks.filter(inCurrentView).length;
  return done;
}

function renderNavigation() {
  $("#nav").style.setProperty(
    "--nav-index",
    ["tasks", "today", "statistics", "settings"].indexOf(view),
  );
  $("#nav").replaceChildren();
  [
    ["tasks", "▦"],
    ["today", "◷"],
    ["statistics", "◴"],
    ["settings", "⚙"],
  ].forEach(([key, icon]) => {
    let b = button(
      "",
      t(key),
      () => changeView(key),
      view === key ? "selected" : "",
    );
    b.append(el("span", "nav-icon", icon), el("span", "nav-label", t(key)));
    if (key === "tasks")
      b.append(
        el("span", "count", String(tasks.filter((t) => !t.done).length)),
      );
    b.setAttribute("aria-current", view === key ? "page" : "false");
    $("#nav").append(b);
  });
}

function renderFilters() {
  $("#filters")
    .querySelectorAll("button")
    .forEach((b) => {
      b.classList.toggle("selected", b.dataset.filter === filter);
      b.setAttribute("aria-pressed", b.dataset.filter === filter);
    });
}
function inCurrentView(task) {
  return (
    (view !== "today" || task.due === today()) &&
    (view !== "tasks" || layout !== "calendar" || task.due === calendarDate)
  );
}
function renderList() {
  const list = $("#list");
  list.replaceChildren();
  const visible = tasks
    .filter(
      (task) =>
        inCurrentView(task) &&
        (filter === "all" ||
          (filter === "completed" ? task.done : !task.done)) &&
        task.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
    )
    .sort(
      (a, b) =>
        Number(b.star) - Number(a.star) || b.created.localeCompare(a.created),
    );
  if (!visible.length) {
    const empty = el("div", "empty");
    empty.append(
      el("div", "empty-symbol", "✧"),
      el(
        "h3",
        "",
        t(
          view === "today" && !query && filter === "all"
            ? "todayEmpty"
            : tasks.length
              ? "noResults"
              : "empty",
        ),
      ),
      el(
        "p",
        "",
        t(
          view === "today" && !query && filter === "all"
            ? "todayEmptyText"
            : tasks.length
              ? "noResultsText"
              : "emptyText",
        ),
      ),
    );
    list.append(empty);
    return;
  }
  visible.forEach((task) => {
    const row = el(
      "div",
      `task${task.done ? " done" : ""}${editing === task.id ? " editing" : ""}`,
    );
    row.dataset.id = task.id;
    if (editing === task.id) {
      const input = el("input", "edit-input");
      input.value = task.title;
      input.maxLength = 180;
      input.setAttribute("aria-label", t("edit"));
      const date = el("input", "edit-date");
      date.type = "date";
      date.value = task.due;
      date.setAttribute("aria-label", t("deadline"));
      const commit = () => {
        const title = input.value.trim();
        if (!title || title.length > 180) {
          input.setCustomValidity(t("invalid"));
          input.reportValidity();
          return;
        }
        task.title = title;
        task.due = date.value;
        editing = null;
        save();
        render();
      };
      input.oninput = () => input.setCustomValidity("");
      row.onkeydown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          commit();
        }
        if (e.key === "Escape") {
          editing = null;
          renderList();
        }
      };
      row.append(
        input,
        date,
        button("✓", t("save"), commit, "quiet"),
        button(
          "×",
          t("cancel"),
          () => {
            editing = null;
            renderList();
          },
          "quiet",
        ),
      );
      list.append(row);
      requestAnimationFrame(() => input.focus());
      return;
    }
    const check = button(
      task.done ? "✓" : "",
      t("complete"),
      () => {
        task.done = !task.done;
        save();
        render();
      },
      "check",
    );
    check.setAttribute("role", "checkbox");
    check.setAttribute("aria-checked", task.done);
    check.setAttribute("aria-label", `${t("complete")}: ${task.title}`);
    const copy = el("div", "task-copy");
    const title = el("div", "task-title", task.title);
    title.ondblclick = () => {
      editing = task.id;
      renderList();
    };
    copy.append(title);
    if (task.due) {
      let meta = el("div", "task-meta");
      meta.append(
        el(
          "span",
          "due-date",
          view === "today"
            ? lang === "ru"
              ? "Срок: сегодня"
              : "Due: today"
            : `${t("deadline")}: ${dateLabel(task.due)}`,
        ),
        ...(view === "today"
          ? []
          : [
              el(
                "span",
                "due-countdown" + (late(task) ? " overdue" : ""),
                relativeDue(task.due),
              ),
            ]),
      );
      copy.append(meta);
    }
    const actions = el("div", "task-actions");
    const star = button(
      task.star ? "★" : "☆",
      t("star"),
      () => {
        task.star = !task.star;
        save();
        render();
      },
      task.star ? "starred" : "",
    );
    star.setAttribute("aria-pressed", task.star);
    actions.append(
      star,
      button("✎", t("edit"), () => {
        editing = task.id;
        renderList();
      }),
      button("×", t("remove"), () => {
        const index = tasks.indexOf(task);
        tasks.splice(index, 1);
        save();
        row.classList.add("removing");
        setTimeout(() => render(), reduced() ? 0 : 210);
        notify(t("deleted"), () => {
          if (!tasks.some((t) => t.id === task.id))
            tasks.splice(Math.min(index, tasks.length), 0, task);
          save();
          render();
        });
      }),
    );
    row.append(check, copy, actions);
    list.append(row);
  });
}
$("#add-form").onsubmit = (e) => {
  e.preventDefault();
  const input = $("#new-task"),
    title = input.value.trim();
  if (!title || title.length > 180) {
    input.setCustomValidity(t("invalid"));
    input.reportValidity();
    return;
  }
  addTask(title, $("#new-date").value);
  input.value = "";
  $("#new-date").value =
    view === "today" ? today() : layout === "calendar" ? calendarDate : "";
  filter = "all";
  query = "";
  $("#search").value = "";
  render();
  input.focus();
};
$("#new-task").oninput = (e) => e.target.setCustomValidity("");
$("#search").oninput = (e) => {
  query = e.target.value;
  renderList();
};
$("#clear").onclick = () => {
  const removed = tasks.filter((t) => t.done);
  tasks = tasks.filter((t) => !t.done);
  save();
  render();
  notify(t("cleared"), () => {
    tasks.push(...removed.filter((r) => !tasks.some((t) => t.id === r.id)));
    save();
    render();
  });
};
async function switchLanguage(requested) {
  const next = ["ru", "en"].includes(requested)
    ? requested
    : lang === "ru"
      ? "en"
      : "ru";
  if (languageBusy || editing || next === lang) return;
  languageBusy = true;

  const labels = () => [
    ...document.querySelectorAll(
      "[data-t],.planner-head h3,.planner-composer strong,.planner-composer p,.planner-composer button,.planner-weekday,#brand-name,#heading,#subtitle,#date,#crumb,#progress-text,#remaining,#due-help,#settings-theme,#settings-language,.nav-label,.due-date,.due-countdown,.filters button,.empty h3,.empty p,#details>div",
    ),
  ];
  const effects = [];
  const play = (nodes, enter) => {
    for (const n of nodes) {
      if (!n.animate || !n.textContent.trim()) continue;
      effects.push(
        n.animate(
          enter
            ? [
                {
                  clipPath: "inset(0 100% 0 0)",
                  opacity: 0.3,
                  filter: "blur(2px)",
                },
                { clipPath: "inset(0 0% 0 0)", opacity: 1, filter: "blur(0)" },
              ]
            : [
                { clipPath: "inset(0 0% 0 0)", opacity: 1 },
                { clipPath: "inset(0 100% 0 0)", opacity: 0.2 },
              ],
          {
            duration: enter ? 340 : 180,
            easing: enter ? "steps(16,end)" : "steps(10,end)",
            fill: "both",
          },
        ),
      );
    }
  };
  try {
    if (!reduced()) {
      play(labels(), false);
      await Promise.all(effects.map((a) => a.finished.catch(() => {})));
    }
    lang = next;
    persist("stepwise-language", lang);
    render();
    effects.forEach((a) => a.cancel());
    effects.length = 0;
    document.dispatchEvent(new Event("stepwise-language"));
    if (!reduced()) {
      play(labels(), true);
      await Promise.all(effects.map((a) => a.finished.catch(() => {})));
    }
  } finally {
    effects.forEach((a) => a.cancel());
    languageBusy = false;
  }
}
async function switchTheme(event) {
  if (busy) return;
  busy = true;
  const box = event.currentTarget.getBoundingClientRect(),
    x = box.x + box.width / 2,
    y = box.y + box.height / 2,
    r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  root.style.setProperty("--portal-x", x + "px");
  root.style.setProperty("--portal-y", y + "px");
  root.style.setProperty("--portal-r", r + "px");
  const apply = () => {
    theme = theme === "dark" ? "light" : "dark";
    persist("stepwise-theme", theme);
    root.dataset.theme = theme;
    syncControls();
  };
  try {
    if (document.startViewTransition && !reduced()) {
      await document.startViewTransition(apply).finished;
    } else {
      apply();
      if (!reduced()) {
        let overlay = el("div", "portal-fallback");
        Object.assign(overlay.style, {
          width: r * 2 + "px",
          height: r * 2 + "px",
          left: x - r + "px",
          top: y - r + "px",
        });
        document.body.append(overlay);
        await new Promise((r) => setTimeout(r, 750));
        overlay.remove();
      }
    }
    root.classList.add("theme-flash");
    setTimeout(() => root.classList.remove("theme-flash"), 300);
  } finally {
    busy = false;
  }
}
let sectionAnimations = [];
function changeView(next) {
  if (next === view) return;
  const order = ["tasks", "today", "statistics", "settings"];
  const direction = order.indexOf(next) > order.indexOf(view) ? 1 : -1;
  sectionAnimations.forEach((a) => a.cancel());
  sectionAnimations = [];
  editing = null;
  filter = "all";
  query = "";
  $("#search").value = "";
  view = next;
  $("#new-date").value =
    next === "today"
      ? today()
      : next === "tasks" && layout === "calendar"
        ? calendarDate
        : "";
  render();
  $("#nav")
    .querySelector('[aria-current="page"]')
    ?.focus({ preventScroll: true });
  if (reduced()) return;
  const groups = [
    [...document.querySelectorAll(".intro")],
    [...document.querySelectorAll(".overview>.glass")],
    [
      ...document.querySelectorAll(
        "#tasks-view:not([hidden])>.panel-title,#tasks-view:not([hidden])>#add-form,#tasks-view:not([hidden])>.due-help,#tasks-view:not([hidden])>.layout-tabs,#tasks-view:not([hidden])>.toolbar,#tasks-view:not([hidden])>#planner:not([hidden])",
      ),
    ],
    [
      ...document.querySelectorAll(
        "#tasks-view:not([hidden]) .task,#tasks-view:not([hidden]) .empty,#settings-view:not([hidden])>h2,#settings-view:not([hidden])>label,#settings-view:not([hidden])>p,#stats-view:not([hidden])>h2,#stats-view:not([hidden]) #details>div",
      ),
    ],
    [...document.querySelectorAll("#tasks-view:not([hidden])>.panel-footer")],
  ];
  groups.forEach((nodes, group) =>
    nodes.forEach((node, index) => {
      if (!node.animate) return;
      const delay = Math.min(group * 80 + index * 45, 400);
      const animation = node.animate(
        [
          { opacity: 0, transform: "translateY(" + direction * 20 + "px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 740,
          delay,
          easing: "cubic-bezier(.16,.65,.25,1)",
          fill: "backwards",
        },
      );
      sectionAnimations.push(animation);
    }),
  );
}

function actionIcon(kind) {
  const shapes = {
    "☆": "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z",
    "✎": "m15 4 5 5-10 10-6 1 1-6Z M13 6l5 5",
    "×": "M7 7l10 10 M17 7 7 17",
    "✓": "m5 12 4 4L19 6",
  };
  const svg = UI.icon(shapes[kind === "★" ? "☆" : kind]);
  if (kind === "★") svg.classList.add("filled-star");
  return svg;
}
function relativeDue(due, now = today()) {
  const day = (value) => {
    const [y, m, d] = value.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  const n = Math.round((day(due) - day(now)) / 86400000);
  if (n === 0) return lang === "ru" ? "Сегодня" : "Today";
  if (n === 1) return lang === "ru" ? "Завтра" : "Tomorrow";
  const count = Math.abs(n),
    unit =
      lang === "ru"
        ? count % 10 === 1 && count % 100 !== 11
          ? "день"
          : count % 10 >= 2 &&
              count % 10 <= 4 &&
              !(count % 100 >= 12 && count % 100 <= 14)
            ? "дня"
            : "дней"
        : count === 1
          ? "day"
          : "days";
  return lang === "ru"
    ? (n > 0 ? "Осталось: " : "Просрочено на ") + count + " " + unit
    : n > 0
      ? count + " " + unit + " left"
      : "Overdue by " + count + " " + unit;
}

function syncControls() {
  for (const key of ["ru", "en"])
    $("#language-" + key).setAttribute("aria-pressed", String(lang === key));
  $("#theme").setAttribute("aria-checked", String(theme === "dark"));
  $("#settings-theme").textContent = t(
    theme === "dark" ? "lightTheme" : "darkTheme",
  );
  $("#settings-language").textContent = lang === "ru" ? "English" : "Русский";
}
$("#language-ru").onclick = () => switchLanguage("ru");
$("#language-en").onclick = () => switchLanguage("en");
$("#settings-language").onclick = switchLanguage;
$("#theme").onclick = switchTheme;
$("#settings-theme").onclick = switchTheme;
$("#compact").checked = read("stepwise-compact", false) === true;
document.body.classList.toggle("compact", $("#compact").checked);
$("#compact").onchange = (e) => {
  document.body.classList.toggle("compact", e.target.checked);
  persist("stepwise-compact", e.target.checked);
};
let lastDay = today();
setInterval(() => {
  if (today() !== lastDay) {
    lastDay = today();
    if (view === "today" && $("#new-date").value)
      $("#new-date").value = today();
    if (!editing) render();
  }
}, 30000);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && !editing) render();
});
function goToAllTasks(event) {
  event.preventDefault();
  layout = "list";
  if (view !== "tasks") {
    changeView("tasks");
  } else {
    filter = "all";
    query = "";
    editing = null;
    $("#search").value = "";
    $("#new-date").value = "";
    render();
  }
  event.currentTarget.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: reduced() ? "instant" : "smooth" });
}
$(".brand").addEventListener("click", goToAllTasks);
$(".mobile-brand-group").addEventListener("click", goToAllTasks);

render();
