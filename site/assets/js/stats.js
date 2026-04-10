function parseJsonAttribute(node, attribute) {
  const value = node.getAttribute(attribute);
  return value ? JSON.parse(value) : null;
}

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("stats-page");

  if (!root) {
    return;
  }

  const stats = parseJsonAttribute(root, "data-stats");
  const entries = parseJsonAttribute(root, "data-entries");

  if (!stats || !entries) {
    return;
  }

  document.querySelectorAll("[data-chart-row]").forEach((row) => {
    const count = Number(row.getAttribute("data-count")) || 0;
    const max = Number(row.getAttribute("data-max")) || 1;
    const width = max === 0 ? 0 : (count / max) * 100;
    const fill = row.querySelector(".chart-fill");
    if (fill) {
      fill.style.setProperty("--bar-width", `${Math.max(width, count > 0 ? 4 : 0)}%`);
    }
  });

  const metricCards = document.querySelectorAll(".metric-card");
  metricCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 60}ms`;
    card.classList.add("is-ready");
  });
});
