document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("[data-decade-filter]");
  const sections = document.querySelectorAll("[data-timeline-section]");

  if (!buttons.length || !sections.length) {
    return;
  }

  function matchesFilter(section, value) {
    if (value === "all") {
      return true;
    }

    if (value === "2021+") {
      return Number(section.getAttribute("data-year")) >= 2021;
    }

    return section.getAttribute("data-decade") === value;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-decade-filter");

      buttons.forEach((chip) => {
        const active = chip === button;
        chip.classList.toggle("is-active", active);
        chip.setAttribute("aria-pressed", String(active));
      });

      sections.forEach((section) => {
        section.hidden = !matchesFilter(section, filter);
      });
    });
  });
});
