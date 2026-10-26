import { PRODUCTS } from "./data/products.js";

const MAX_QUANTITY = 99;
const productById = new Map(PRODUCTS.map((product) => [product.id, product]));

export function createCart({ initialValue = {}, persist = () => {} } = {}) {
  const quantities = new Map();
  const subscribers = new Set();

  if (
    initialValue &&
    typeof initialValue === "object" &&
    !Array.isArray(initialValue)
  ) {
    for (const [id, quantity] of Object.entries(initialValue)) {
      if (
        productById.has(id) &&
        Number.isInteger(quantity) &&
        quantity > 0 &&
        quantity <= MAX_QUANTITY
      ) {
        quantities.set(id, quantity);
      }
    }
  }

  function getItems() {
    return PRODUCTS.filter((product) => quantities.has(product.id)).map(
      (product) => ({
        product,
        quantity: quantities.get(product.id),
      }),
    );
  }

  function getTotal() {
    const cents = getItems().reduce(
      (sum, { product, quantity }) =>
        sum + Math.round(product.price * 100) * quantity,
      0,
    );
    return cents / 100;
  }

  function changed() {
    persist(Object.fromEntries(quantities));
    subscribers.forEach((subscriber) => subscriber());
  }

  function add(id) {
    if (!productById.has(id)) return false;
    const quantity = quantities.get(id) ?? 0;
    if (quantity >= MAX_QUANTITY) return false;
    quantities.set(id, quantity + 1);
    changed();
    return true;
  }

  function changeQuantity(id, difference) {
    if (!quantities.has(id) || !Number.isInteger(difference)) return;
    const nextQuantity = Math.min(
      MAX_QUANTITY,
      quantities.get(id) + difference,
    );
    if (nextQuantity <= 0) quantities.delete(id);
    else quantities.set(id, nextQuantity);
    changed();
  }

  function remove(id) {
    if (quantities.delete(id)) changed();
  }

  function clear() {
    quantities.clear();
    changed();
  }

  return {
    add,
    remove,
    clear,
    changeQuantity,
    getItems,
    getTotal,
    getCount: () =>
      [...quantities.values()].reduce((sum, quantity) => sum + quantity, 0),
    subscribe: (subscriber) => {
      subscribers.add(subscriber);
      return () => subscribers.delete(subscriber);
    },
  };
}
