(() => {
  const dialog = document.createElement("dialog");
  dialog.className = "calendar-dialog";
  document.body.append(dialog);
  let target = null,
    month = new Date(),
    returnFocus = null;
  const words = () =>
    document.documentElement.lang === "en"
      ? {
          today: "Today",
          clear: "No due date",
          close: "Close",
          prev: "Previous month",
          next: "Next month",
          title: "Choose due date",
          days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        }
      : {
          today: "Сегодня",
          clear: "Без срока",
          close: "Закрыть",
          prev: "Предыдущий месяц",
          next: "Следующий месяц",
          title: "Выбрать срок",
          days: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
        };
  const iso = UI.dateValue;
  const make = UI.element;
  function btn(text, label, fn, cls = "") {
    const b = make("button", cls, text);
    if (text === "‹" || text === "›") {
      b.textContent = "";
      b.classList.add("calendar-arrow");
      b.append(UI.icon(text === "‹" ? "m14 6-6 6 6 6" : "m10 6 6 6-6 6"));
    }
    if (text === "×") {
      b.textContent = "";
      const cross = make("span", "calendar-close-icon", "×");
      cross.setAttribute("aria-hidden", "true");
      b.append(cross);
    }
    b.type = "button";
    b.setAttribute("aria-label", label);
    b.title = label;
    b.onclick = fn;
    return b;
  }
  function select(value) {
    target.value = value;
    target.dispatchEvent(new Event("input", { bubbles: true }));
    target.dispatchEvent(new Event("change", { bubbles: true }));
    dialog.close();
  }
  function draw(focusDay) {
    const w = words(),
      locale = document.documentElement.lang === "en" ? "en-GB" : "ru-RU";
    dialog.replaceChildren();
    dialog.setAttribute("aria-label", w.title);
    const head = make("div", "calendar-header");
    head.append(
      btn("‹", w.prev, () => {
        month.setMonth(month.getMonth() - 1);
        draw();
        dialog.querySelector("button").focus();
      }),
      make(
        "strong",
        "",
        new Intl.DateTimeFormat(locale, {
          month: "long",
          year: "numeric",
        }).format(month),
      ),
      btn("›", w.next, () => {
        month.setMonth(month.getMonth() + 1);
        draw();
        dialog.querySelectorAll("button")[1].focus();
      }),
    );
    const week = make("div", "calendar-week");
    w.days.forEach((d) => week.append(make("span", "", d)));
    const grid = make("div", "calendar-grid");
    const count = new Date(
        month.getFullYear(),
        month.getMonth() + 1,
        0,
      ).getDate(),
      offset = (month.getDay() + 6) % 7;
    for (let i = 0; i < offset; i++)
      grid.append(make("span", "calendar-blank"));
    for (let day = 1; day <= count; day++) {
      const date = new Date(month.getFullYear(), month.getMonth(), day),
        value = iso(date);
      const b = btn(
        String(day),
        new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(date),
        () => select(value),
        "calendar-day",
      );
      b.dataset.date = value;
      b.classList.toggle("is-today", value === iso(new Date()));
      b.classList.toggle("is-selected", value === target.value);
      b.setAttribute("aria-pressed", String(value === target.value));
      b.tabIndex =
        day ===
        (focusDay ||
          (target.value.startsWith(iso(month).slice(0, 7))
            ? Number(target.value.slice(-2))
            : 1))
          ? 0
          : -1;
      grid.append(b);
    }
    const actions = make("div", "calendar-actions");
    actions.append(
      btn(w.today, w.today, () => select(iso(new Date()))),
      btn(w.clear, w.clear, () => select("")),
      btn("×", w.close, () => dialog.close()),
    );
    dialog.append(head, week, grid, actions);
    if (focusDay)
      grid
        .querySelector(
          `[data-date="${iso(new Date(month.getFullYear(), month.getMonth(), focusDay))}"]`,
        )
        ?.focus();
  }
  function open(input) {
    target = input;
    returnFocus = input;
    const d = input.value ? new Date(input.value + "T12:00:00") : new Date();
    month = new Date(d.getFullYear(), d.getMonth(), 1);
    draw();
    dialog.showModal();
    const r = input.getBoundingClientRect();
    dialog.style.margin = "0";
    dialog.style.left = Math.max(12, Math.min(r.left, innerWidth - 332)) + "px";
    dialog.style.top =
      Math.max(
        12,
        Math.min(r.bottom + 10, innerHeight - dialog.offsetHeight - 12),
      ) + "px";
    dialog.querySelector('.calendar-day[tabindex="0"]')?.focus();
  }
  function prepare(input) {
    input.readOnly = true;
    input.classList.add("custom-date-input");
    input.setAttribute("aria-haspopup", "dialog");
    input.setAttribute(
      "aria-label",
      document.documentElement.lang === "en"
        ? "Choose due date"
        : "Выбрать срок",
    );
  }
  document.querySelectorAll('input[type="date"]').forEach(prepare);
  new MutationObserver((records) => {
    for (const record of records)
      for (const node of record.addedNodes)
        if (node.nodeType === 1) {
          if (node.matches('input[type="date"]')) prepare(node);
          node.querySelectorAll('input[type="date"]').forEach(prepare);
        }
  }).observe(document.body, { childList: true, subtree: true });
  document.addEventListener("click", (e) => {
    const input = e.target.closest('input[type="date"]');
    if (input) {
      e.preventDefault();
      open(input);
    }
  });
  document.addEventListener(
    "keydown",
    (e) => {
      if (
        e.target.matches('input[type="date"]') &&
        ["Enter", " ", "ArrowDown"].includes(e.key)
      ) {
        e.preventDefault();
        e.stopPropagation();
        open(e.target);
      }
    },
    true,
  );
  dialog.addEventListener("keydown", (e) => {
    const b = e.target.closest(".calendar-day");
    if (!b) return;
    const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[
      e.key
    ];
    if (delta) {
      e.preventDefault();
      const d = new Date(b.dataset.date + "T12:00:00");
      d.setDate(d.getDate() + delta);
      month = new Date(d.getFullYear(), d.getMonth(), 1);
      draw(d.getDate());
    }
  });
  dialog.addEventListener("click", (e) => {
    if (UI.outsideDialog(e, dialog)) dialog.close();
  });
  dialog.addEventListener(
    "close",
    () => returnFocus?.isConnected && returnFocus.focus(),
  );
})();
