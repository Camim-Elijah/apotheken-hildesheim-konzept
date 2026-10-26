import { LOCATIONS } from "./data/locations.js";
import { escapeHtml } from "./utils.js";

const DAYS = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export function initializeLocations() {
  const panel = document.querySelector("#location-panel");
  const tabList = document.querySelector(".location-tabs");
  const tabs = [...tabList.querySelectorAll("[data-location]")];
  let selectedId = "einhorn";

  function selectLocation(id) {
    const location = LOCATIONS[id];
    if (!location) return;
    selectedId = id;

    const dayName = new Intl.DateTimeFormat("de-DE", {
      timeZone: "Europe/Berlin",
      weekday: "long",
    }).format(new Date());
    const today = DAYS.indexOf(dayName);

    for (const tab of tabs) {
      const selected = tab.dataset.location === id;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    }
    panel.setAttribute("aria-labelledby", `tab-${id}`);

    const hours = DISPLAY_ORDER.map(
      (day) => `<div class="hours-row ${day === today ? "today" : ""}">
      <span>${DAYS[day]}</span>
      <span>${escapeHtml(location.hours[day]).replace(" / ", "<br>")}</span>
    </div>`,
    ).join("");
    const mapQuery = encodeURIComponent(
      `${location.name} ${location.street} ${location.city}`,
    );

    panel.innerHTML = `<div class="location-info">
      <div>
        <h3>${escapeHtml(location.name)}</h3>
        <address>${escapeHtml(location.street)}<br>${escapeHtml(location.city)}</address>
        <div class="contacts">
          <a href="tel:${location.tel}">${location.phone}</a>
          <a href="mailto:${location.email}">E-Mail schreiben</a>
        </div>
        <a class="text-link" href="https://www.google.com/maps/search/?api=1&query=${mapQuery}"
          target="_blank" rel="noopener">Route planen</a>
      </div>
      <div class="opening"><h4>Öffnungszeiten</h4>${hours}</div>
    </div>
`;
  }

  tabList.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-location]");
    if (tab) selectLocation(tab.dataset.location);
  });

  tabList.addEventListener("keydown", (event) => {
    const currentIndex = tabs.indexOf(document.activeElement);
    if (currentIndex < 0) return;
    const destinations = {
      ArrowRight: (currentIndex + 1) % tabs.length,
      ArrowLeft: (currentIndex + tabs.length - 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    const nextIndex = destinations[event.key];
    if (nextIndex === undefined) return;
    event.preventDefault();
    selectLocation(tabs[nextIndex].dataset.location);
    tabs[nextIndex].focus();
  });

  document.querySelectorAll("[data-visit]").forEach((link) => {
    link.addEventListener("click", () => selectLocation(link.dataset.visit));
  });

  selectLocation(selectedId);
  return { getSelectedId: () => selectedId };
}
