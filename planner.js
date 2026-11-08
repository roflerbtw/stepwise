(() => {
  const panel = document.querySelector("#planner");
  let month = new Date();
  month.setDate(1);
  let draft = "";
  let composerOpen = false,
    closing = false;
  let opening = false;
  const make = UI.element;
  const iso = UI.dateValue;
  const ru = () => document.documentElement.lang === "ru";
  function arrow(left) {
    const b = make("button", "calendar-arrow");
    b.type = "button";
    b.setAttribute(
      "aria-label",
      ru()
        ? left
          ? "Предыдущий месяц"
          : "Следующий месяц"
        : left
          ? "Previous month"
          : "Next month",
    );
    b.append(UI.icon(left ? "m14 6-6 6 6 6" : "m10 6 6 6-6 6"));
    return b;
  }
  function composer(locale) {
    const box = make("div", "planner-composer");
    const title = make(
      "strong",
      "",
      new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" }).format(
        new Date(calendarDate + "T12:00:00"),
      ),
    );
    const hint = make(
      "p",
      "",
      ru() ? "Добавь задачу на выбранный день." : "Add a task for this day.",
    );
    const form = make("form", "planner-add"),
      input = make("input", "");
    input.placeholder = ru() ? "Название задачи" : "Task title";
    input.setAttribute("aria-label", input.placeholder);
    input.maxLength = 180;
    input.required = true;
    input.value = draft;
    input.oninput = () => {
      draft = input.value;
      input.setCustomValidity("");
    };
    const add = make(
      "button",
      "primary",
      ru() ? "Добавить задачу" : "Add task",
    );
    add.type = "submit";
    form.append(input, add);
    form.onsubmit = (e) => {
      e.preventDefault();
      const title = input.value.trim();
      if (!title || title.length > 180) {
        input.setCustomValidity(t("invalid"));
        input.reportValidity();
        return;
      }
      addTask(title, calendarDate);
      draft = "";
      filter = "all";
      query = "";
      document.querySelector("#search").value = "";
      render();
      panel.querySelector(".planner-add input")?.focus({ preventScroll: true });
    };
    box.append(title, hint, form);
    if (opening) {
      box.classList.add("is-opening");
      opening = false;
    }
    return box;
  }
  function draw() {
    document
      .querySelector("#layout-list")
      .setAttribute("aria-pressed", layout === "list");
    document
      .querySelector("#layout-calendar")
      .setAttribute("aria-pressed", layout === "calendar");
    panel.replaceChildren();
    if (view !== "tasks" || layout !== "calendar") return;
    const locale = ru() ? "ru-RU" : "en-GB",
      head = make("div", "planner-head"),
      prev = arrow(true),
      next = arrow(false);
    prev.onclick = () => {
      month.setMonth(month.getMonth() - 1);
      draw();
      panel.querySelector(".calendar-arrow").focus();
    };
    next.onclick = () => {
      month.setMonth(month.getMonth() + 1);
      draw();
      panel.querySelectorAll(".calendar-arrow")[1].focus();
    };
    head.append(
      prev,
      make(
        "h3",
        "",
        new Intl.DateTimeFormat(locale, {
          month: "long",
          year: "numeric",
        }).format(month),
      ),
      next,
    );
    const grid = make("div", "planner-grid");
    for (const d of ru()
      ? ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
      : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])
      grid.append(make("span", "planner-weekday", d));
    const offset = (month.getDay() + 6) % 7,
      count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    let selectedWeek = false;
    for (let cell = 0; cell < Math.ceil((offset + count) / 7) * 7; cell++) {
      const day = cell - offset + 1;
      if (day < 1 || day > count) grid.append(make("span", ""));
      else {
        const date = new Date(month.getFullYear(), month.getMonth(), day),
          value = iso(date),
          items = tasks.filter((task) => task.due === value),
          b = make("button", "planner-day");
        b.type = "button";
        b.classList.toggle("selected", calendarDate === value);
        b.classList.toggle("current", value === today());
        b.setAttribute("aria-pressed", calendarDate === value);
        b.setAttribute(
          "aria-label",
          new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(date) +
            ": " +
            items.length,
        );
        b.append(make("span", "", day));
        if (items.length)
          b.append(make("small", "planner-count", String(items.length)));
        if (calendarDate === value && composerOpen) selectedWeek = true;
        b.onclick = async () => {
          if (closing || languageBusy) return;
          if (calendarDate === value && composerOpen) {
            const box = panel.querySelector(".planner-composer");
            closing = true;
            try {
              if (
                box?.animate &&
                !matchMedia("(prefers-reduced-motion: reduce)").matches
              ) {
                await box.animate(
                  [
                    {
                      opacity: 1,
                      transform: "translateY(0)",
                      maxHeight: box.scrollHeight + "px",
                      marginTop: "6px",
                      marginBottom: "12px",
                    },
                    {
                      opacity: 0,
                      transform: "translateY(-8px)",
                      maxHeight: "0px",
                      paddingTop: "0px",
                      paddingBottom: "0px",
                      marginTop: "0px",
                      marginBottom: "0px",
                    },
                  ],
                  {
                    duration: 480,
                    easing: "cubic-bezier(.4,0,.2,1)",
                    fill: "forwards",
                  },
                ).finished;
              }
              composerOpen = false;
              render();
              panel
                .querySelector(".planner-day.selected")
                ?.focus({ preventScroll: true });
            } finally {
              closing = false;
            }
            return;
          }
          calendarDate = value;
          composerOpen = true;
          opening = true;
          query = "";
          filter = "all";
          document.querySelector("#search").value = "";
          document.querySelector("#new-date").value = value;
          render();
          panel.querySelector(".planner-composer")?.scrollIntoView({
            block: "nearest",
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "instant"
              : "smooth",
          });
        };
        grid.append(b);
      }
      if (cell % 7 === 6 && selectedWeek) {
        grid.append(composer(locale));
        selectedWeek = false;
      }
    }
    panel.append(head, grid);
  }
  document.querySelector("#layout-list").onclick = () => {
    composerOpen = false;
    layout = "list";
    query = "";
    filter = "all";
    document.querySelector("#search").value = "";
    document.querySelector("#new-date").value = "";
    render();
  };
  document.querySelector("#layout-calendar").onclick = () => {
    composerOpen = false;
    layout = "calendar";
    month = new Date(calendarDate + "T12:00:00");
    month.setDate(1);
    document.querySelector("#new-date").value = calendarDate;
    render();
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
      panel.animate?.(
        [
          { opacity: 0, transform: "translateY(-12px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 320, easing: "ease-out" },
      );
  };
  document.addEventListener("stepwise-render", draw);
  draw();
})();
