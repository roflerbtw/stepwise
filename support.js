(() => {
  const trigger = document.querySelector("#robot-help");
  if (!trigger) return;
  const modal = document.createElement("dialog");
  modal.className = "support-dialog";
  modal.setAttribute("aria-labelledby", "support-title");
  document.body.append(modal);
  const copy = () =>
    document.documentElement.lang === "en"
      ? {
          title: "Need a hand?",
          text: "Have a question about tasks or found a problem? Send us a message on Telegram.",
          button: "Contact support",
          close: "Close",
          hint: "Need help? I’m here.",
          caption: "Telegram · @roflerbtw",
        }
      : {
          title: "Нужна помощь?",
          text: "Есть вопрос о задачах или что-то работает не так? Напиши нам в Telegram.",
          button: "Написать в поддержку",
          close: "Закрыть",
          hint: "Нужна помощь? Я рядом.",
          caption: "Telegram · @roflerbtw",
        };
  const make = UI.element;
  function renderSupport() {
    const w = copy();
    trigger.setAttribute("aria-label", w.button);
    trigger.title = w.button;
    document.querySelector("#robot-hint").textContent = w.hint;
    const close = make("button", "support-close", "×");
    close.textContent = "";
    close.append(UI.icon("m6 6 12 12M18 6 6 18"));
    close.type = "button";
    close.setAttribute("aria-label", w.close);
    close.onclick = () => modal.close();
    const icon = make("div", "support-symbol", "✧"),
      title = make("h2", "", w.title);
    title.id = "support-title";
    const text = make("p", "", w.text),
      link = make("a", "telegram-link");
    link.href = "https://t.me/roflerbtw";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    const svg = UI.icon("m21 4-3 16-6-5-3 3 1-6 8-6-10 5-5-2Z");
    link.append(svg, make("span", "", w.button));
    modal.replaceChildren(
      close,
      icon,
      title,
      text,
      link,
      make("small", "", w.caption),
    );
  }
  renderSupport();
  trigger.onclick = () => {
    renderSupport();
    modal.showModal();
  };
  modal.addEventListener("click", (e) => {
    if (UI.outsideDialog(e, modal)) modal.close();
  });
  modal.addEventListener("close", () => trigger.focus());
  document.addEventListener("stepwise-language", renderSupport);
  let timer;
  const hint = document.querySelector("#robot-hint");
  function showHint() {
    if (
      document.hidden ||
      modal.open ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    hint.classList.add("visible");
    hint.setAttribute("aria-hidden", "false");
    hint.tabIndex = 0;
    clearTimeout(timer);
    timer = setTimeout(() => {
      hint.classList.remove("visible");
      hint.setAttribute("aria-hidden", "true");
      hint.tabIndex = -1;
    }, 4500);
  }
  setTimeout(showHint, 12000);
  setInterval(showHint, 90000);
})();
(() => {
  const robot = document.querySelector("#robot-help");
  if (!robot) return;
  const reset = () => {
    for (const key of ["--dodge-x", "--dodge-y", "--dodge-angle", "--shadow-x"])
      robot.style.removeProperty(key);
  };
  robot.addEventListener("pointermove", (event) => {
    if (
      event.pointerType === "touch" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const box = robot.getBoundingClientRect();
    const x = Math.max(
      -1,
      Math.min(1, (event.clientX - box.left - box.width / 2) / (box.width / 2)),
    );
    const y = Math.max(
      -1,
      Math.min(
        1,
        (event.clientY - box.top - box.height / 2) / (box.height / 2),
      ),
    );
    robot.style.setProperty("--dodge-x", (-x * 11).toFixed(1) + "px");
    robot.style.setProperty("--dodge-y", (-y * 6 - 3).toFixed(1) + "px");
    robot.style.setProperty("--dodge-angle", (-x * 8).toFixed(1) + "deg");
    robot.style.setProperty("--shadow-x", (-x * 5).toFixed(1) + "px");
  });
  robot.addEventListener("pointerleave", reset);
  robot.addEventListener("blur", reset);
})();
document
  .querySelector("#robot-hint")
  ?.addEventListener("click", () =>
    document.querySelector("#robot-help").click(),
  );
