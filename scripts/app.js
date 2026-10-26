import { createCart } from "./cart.js";
import { initializeCartView } from "./cart-view.js";
import { initializeDialogs } from "./dialogs.js";
import { initializeLocations } from "./locations.js";
import { initializeShop } from "./shop.js";
import { notify, readPreference, writePreference } from "./utils.js";

const CART_STORAGE_KEY = "hildesheim-demo-cart";

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
