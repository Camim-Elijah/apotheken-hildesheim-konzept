import { PRODUCTS } from "./data/products.js";
import { escapeHtml, formatCurrency, productImage } from "./utils.js";

const INITIAL_PRODUCT_COUNT = 8;

export function initializeShop({ onAdd, onDetails }) {
  const container = document.querySelector("#shop");
  const grid = document.querySelector("#products");
  const searchInput = document.querySelector("#product-search");
  const brandSelect = document.querySelector("#brand-filter");
  const countLabel = document.querySelector("#product-count");
  const showMoreButton = document.querySelector("#show-more-products");
  const filterButtons = [...container.querySelectorAll("[data-filter]")];
  const state = { category: "Alle", brand: "Alle", expanded: false };

  const brandOrder = ["Orthomol", "ratiopharm", "NomoSan", "Doppelherz"];
  const brands = brandOrder.filter((brand) =>
    PRODUCTS.some((product) => product.brand === brand),
  );

  brandSelect.innerHTML =
    '<option value="Alle">Alle Marken</option>' +
    brands
      .map(
        (brand) =>
          `<option value="${escapeHtml(brand)}">${escapeHtml(brand)}</option>`,
      )
      .join("");

  function renderProduct(product) {
    return `<article class="product-card">
      <button class="product-art" data-product="${product.id}"
        aria-label="Details zu ${escapeHtml(product.brand)} ${escapeHtml(product.name)}">
        ${productImage(product)}
      </button>
      <span class="product-brand">${escapeHtml(product.brand)}</span>
      <button class="product-title" data-product="${product.id}">${escapeHtml(product.name)}</button>
      <p class="product-meta">${escapeHtml(product.pack)}</p>
      <div class="product-bottom">
        <span class="price">${formatCurrency(product.price)}</span>
        <span class="price-label">Beispielpreis · Demo</span>
        <button class="add-button" data-add="${product.id}"
          aria-label="${escapeHtml(product.brand)} ${escapeHtml(product.name)} zum Demo-Warenkorb hinzufügen">
          In den Warenkorb
        </button>
      </div>
    </article>`;
  }

  function render() {
    const query = searchInput.value.trim().toLocaleLowerCase("de");
    const matching = PRODUCTS.filter(
      (product) =>
        (state.category === "Alle" || product.category === state.category) &&
        (state.brand === "Alle" || product.brand === state.brand) &&
        `${product.brand} ${product.name}`
          .toLocaleLowerCase("de")
          .includes(query),
    );
    const showOverview =
      !state.expanded &&
      state.category === "Alle" &&
      state.brand === "Alle" &&
      !query;
    const visible = showOverview
      ? matching.slice(0, INITIAL_PRODUCT_COUNT)
      : matching;
    const brandCount = new Set(matching.map((product) => product.brand)).size;
    countLabel.textContent = `${visible.length} von ${matching.length} Produkten · ${brandCount} ${brandCount === 1 ? "Marke" : "Marken"} · Demo-Auswahl`;
    showMoreButton.hidden = visible.length === matching.length;
    showMoreButton.textContent = `Alle ${matching.length} Produkte anzeigen`;
    grid.innerHTML =
      visible.map(renderProduct).join("") ||
      `<div class="no-results">
      <p>Keine passenden Produkte gefunden.</p>
      <button class="button outline" data-reset-products>Alle Produkte anzeigen</button>
    </div>`;
  }

  function setCategory(category) {
    state.category = category;
    for (const button of filterButtons) {
      const selected = button.dataset.filter === category;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    }
  }

  container.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.filter) {
      setCategory(button.dataset.filter);
      render();
    }
    if (button.dataset.add) onAdd(button.dataset.add);
    if (button.dataset.product) onDetails(button.dataset.product);
    if (button === showMoreButton) {
      state.expanded = true;
      render();
      grid
        .querySelector(
          `.product-card:nth-child(${INITIAL_PRODUCT_COUNT + 1}) button`,
        )
        ?.focus();
    }
    if (button.hasAttribute("data-reset-products")) {
      setCategory("Alle");
      state.brand = "Alle";
      state.expanded = false;
      searchInput.value = "";
      brandSelect.value = "Alle";
      render();
      searchInput.focus();
    }
  });

  searchInput.addEventListener("input", render);
  brandSelect.addEventListener("change", () => {
    state.brand = brandSelect.value;
    render();
  });

  render();
}
