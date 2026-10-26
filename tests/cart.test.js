import assert from "node:assert/strict";
import test from "node:test";
import { createCart } from "../scripts/cart.js";
import { PRODUCTS } from "../scripts/data/products.js";

test("restores only valid known products and bounded integer quantities", () => {
  const cart = createCart({
    initialValue: {
      "nomosan-amd": 2,
      orthomol: -1,
      doppelherz: 1.5,
      pure: 100,
      unknown: 3,
    },
  });
  assert.equal(cart.getCount(), 2);
  assert.equal(cart.getItems()[0].product.id, "nomosan-amd");
  for (const value of [null, [], "invalid"]) {
    assert.equal(createCart({ initialValue: value }).getCount(), 0);
  }
});

test("calculates totals in integer cents and persists quantity changes", () => {
  let persisted;
  const cart = createCart({
    persist: (value) => {
      persisted = value;
    },
  });
  cart.add("nomosan-amd");
  cart.add("doppelherz");
  cart.changeQuantity("nomosan-amd", 2);
  assert.equal(cart.getTotal(), 147.35);
  assert.deepEqual(persisted, { "nomosan-amd": 3, doppelherz: 1 });
  cart.remove("doppelherz");
  assert.equal(cart.getTotal(), 140.4);
  cart.changeQuantity("nomosan-amd", -3);
  assert.equal(cart.getCount(), 0);
});

test("enforces the item limit and ignores unknown IDs", () => {
  const cart = createCart({ initialValue: { orthomol: 99 } });
  assert.equal(cart.add("orthomol"), false);
  assert.equal(cart.add("unknown"), false);
  assert.equal(cart.getCount(), 99);
  cart.clear();
  assert.equal(cart.getTotal(), 0);
});

test("notifies subscribers and supports removing subscriptions", () => {
  const cart = createCart();
  let updates = 0;
  const unsubscribe = cart.subscribe(() => updates++);
  cart.add("nomosan-amd");
  unsubscribe();
  cart.clear();
  assert.equal(updates, 1);
});

test("catalog keeps the requested brand order and two NomoSan products", () => {
  assert.deepEqual(
    PRODUCTS.slice(0, 3).map((product) => product.brand),
    ["Orthomol", "ratiopharm", "NomoSan"],
  );
  assert.equal(
    new Set(PRODUCTS.map((product) => product.id)).size,
    PRODUCTS.length,
  );
  assert.equal(
    PRODUCTS.filter((product) => product.brand === "NomoSan").length,
    2,
  );
  assert.equal(PRODUCTS.length, 12);
  assert.equal(new Set(PRODUCTS.map((product) => product.brand)).size, 4);
  assert.equal(
    PRODUCTS.slice(0, 8).filter((product) => product.brand === "NomoSan")
      .length,
    1,
  );
  assert.ok(
    PRODUCTS.every(
      (product) => product.image && product.source.startsWith("https://"),
    ),
  );
});
