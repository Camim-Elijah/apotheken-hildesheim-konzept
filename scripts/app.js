import { createCart } from "./cart.js";
import { initializeCartView } from "./cart-view.js";
import { initializeDialogs } from "./dialogs.js";
import { initializeLocations } from "./locations.js";
import { initializeShop } from "./shop.js";
import { notify, readPreference, writePreference } from "./utils.js";

const CART_STORAGE_KEY = "hildesheim-demo-cart";
const READING_STORAGE_KEY = "hildesheim-large-text";

const cart = createCart({
  initialValue: readPreference(CART_STORAGE_KEY, {}),
  persist: (items) => writePreference(CART_STORAGE_KEY, items),
});
const locations = initializeLocations();

function addProduct(id) {
  notify(
    cart.add(id)
      ? "Zum Demo-Warenkorb hinzugefügt."
      : "Maximal 99 Stück je Demo-Artikel.",
  );
}

const dialogs = initializeDialogs({ onAdd: addProduct, cart });
initializeShop({ onAdd: addProduct, onDetails: dialogs.showProduct });
initializeCartView({ cart, getSelectedLocation: locations.getSelectedId });

const readingButton = document.querySelector("#reading-toggle");

function setLargeText(enabled) {
  document.body.classList.toggle("large-text", enabled);
  readingButton.setAttribute("aria-pressed", String(enabled));
  readingButton.setAttribute(
    "aria-label",
    enabled
      ? "Normale Schriftgröße einschalten"
      : "Größere Schrift einschalten",
  );
  writePreference(READING_STORAGE_KEY, enabled);
}

setLargeText(readPreference(READING_STORAGE_KEY, false) === true);
readingButton.addEventListener("click", () => {
  setLargeText(!document.body.classList.contains("large-text"));
});

const navigation = document.querySelector("#navigation");
const menuButton = document.querySelector(".menu-toggle");

function setMenuOpen(open) {
  navigation.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute(
    "aria-label",
    open ? "Menü schließen" : "Menü öffnen",
  );
  menuButton.textContent = open ? "Zu" : "Menü";
}

menuButton.addEventListener("click", () =>
  setMenuOpen(!navigation.classList.contains("open")),
);
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenuOpen(false);
});
menuButton.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});
navigation.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuOpen(false);
    menuButton.focus();
  }
});
