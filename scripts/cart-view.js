import { LOCATIONS } from "./data/locations.js";
import { escapeHtml, formatCurrency } from "./utils.js";

export function initializeCartView({ cart, getSelectedLocation }) {
  const dialog = document.querySelector("#cart-dialog");
  const content = document.querySelector("#cart-body");
  const countBadge = document.querySelector("#cart-count");
  let phase = "cart";

  function renderItem({ product, quantity }) {
    return `<div class="cart-item">
      <div>
        <h3>${escapeHtml(product.brand)} ${escapeHtml(product.name)}</h3>
        <p>${formatCurrency(product.price)} je Beispielpackung</p>
        <div class="quantity">
          <button data-change="${product.id}" data-delta="-1" aria-label="Ein ${escapeHtml(product.name)} weniger">-</button>
          <span>${quantity}</span>
          <button data-change="${product.id}" data-delta="1" aria-label="Ein ${escapeHtml(product.name)} mehr">+</button>
        </div>
        <button class="remove" data-remove="${product.id}">Entfernen</button>
      </div>
      <strong>${formatCurrency(product.price * quantity)}</strong>
    </div>`;
  }

  function renderCart() {
    phase = "cart";
    const items = cart.getItems();
    if (!items.length) {
      content.innerHTML = `<div class="empty-cart">
        <h3>Ihr Warenkorb ist noch leer.</h3>
        <p>Entdecken Sie die Nährstoffwelt und legen Sie einen Demo-Artikel in Ihren Warenkorb.</p>
        <button data-continue-shopping class="button">Zur Nährstoffwelt</button>
      </div>`;
      return;
    }
    content.innerHTML = `<p class="demo-badge">Simulation · keine Zahlung</p>
      ${items.map(renderItem).join("")}
      <div class="total"><span>Beispielsumme</span><strong>${formatCurrency(cart.getTotal())}</strong></div>
      <p class="cart-disclaimer">Demoshop mit frei gewählten Beispielpreisen. Ihre Auswahl wird an keine Apotheke übermittelt. Es entstehen keine Kosten.</p>
      <button data-checkout class="button wide">Demo-Bestellung ausprobieren</button>`;
  }

  function showCheckout() {
    phase = "checkout";
    const locationOptions = Object.entries(LOCATIONS)
      .map(
        ([id, location]) =>
          `<option value="${id}" ${id === getSelectedLocation() ? "selected" : ""}>${escapeHtml(location.name)}</option>`,
      )
      .join("");
    content.innerHTML = `<form id="checkout-form" class="checkout-form">
      <button type="button" class="back" data-back-to-cart>Zurück zum Warenkorb</button>
      <h3>Abholung simulieren</h3>
      <p>Verwenden Sie einen frei gewählten Testnamen. Es werden keine Daten versendet.</p>
      <label>Vorname oder Testname
        <input name="demoName" placeholder="Zum Beispiel: Alex" maxlength="50" autocomplete="off" required>
      </label>
      <label>Ihre Demo-Abholapotheke<select name="location">${locationOptions}</select></label>
      <label class="check">
        <input type="checkbox" required>
        <span>Ich verstehe: Dies ist eine Simulation. Es wird keine echte Bestellung oder Reservierung ausgelöst.</span>
      </label>
      <div class="total"><span>Beispielsumme</span><strong>${formatCurrency(cart.getTotal())}</strong></div>
      <p class="cart-disclaimer">Keine Zahlungsdaten. Keine Kosten. Keine tatsächliche Abholung.</p>
      <button type="submit" class="button wide">Demo kostenlos abschließen</button>
    </form>`;
    content.querySelector('[name="demoName"]').focus();
  }

  function completeCheckout(form) {
    const data = new FormData(form);
    const name = String(data.get("demoName") ?? "").trim();
    if (!name) {
      form.elements.demoName.setCustomValidity(
        "Bitte einen Testnamen eingeben.",
      );
      form.reportValidity();
      return;
    }
    const location = LOCATIONS[data.get("location")] ?? LOCATIONS.einhorn;
    const amount = cart.getTotal();
    const itemCount = cart.getCount();
    phase = "complete";
    cart.clear();
    content.innerHTML = `<div class="success">
      <p class="eyebrow">Simulation erfolgreich</p>
      <h2 tabindex="-1">Demo abgeschlossen.</h2>
      <p id="thanks-name"></p>
      <dl>
        <dt>Demo-Auswahl</dt><dd>${itemCount} Artikel · ${formatCurrency(amount)}</dd>
        <dt>Gewählte Apotheke</dt><dd>${escapeHtml(location.name)}<br>${escapeHtml(location.street)}</dd>
      </dl>
      <p class="cart-disclaimer">Es wurde keine echte Bestellung aufgegeben. Die Apotheke erhält keine Nachricht, es ist nichts reserviert und es fallen keine Kosten an.</p>
      <button data-continue-shopping class="button wide">Weiter entdecken</button>
    </div>`;
    content.querySelector("#thanks-name").textContent =
      `Danke, ${name}! Sie haben den Demo-Bestellablauf abgeschlossen.`;
    content.querySelector("h2").focus();
  }

  content.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.change) {
      const { change: id, delta } = button.dataset;
      cart.changeQuantity(id, Number(delta));
      content
        .querySelector(`[data-change="${id}"][data-delta="${delta}"]`)
        ?.focus();
    }
    if (button.dataset.remove) {
      cart.remove(button.dataset.remove);
      content.querySelector("button")?.focus();
    }
    if (button.hasAttribute("data-checkout")) showCheckout();
    if (button.hasAttribute("data-back-to-cart")) {
      renderCart();
      content.querySelector("[data-checkout]")?.focus();
    }
    if (button.hasAttribute("data-continue-shopping")) {
      dialog.close();
      document.querySelector("#shop").scrollIntoView();
    }
  });

  content.addEventListener("submit", (event) => {
    if (event.target.id !== "checkout-form") return;
    event.preventDefault();
    completeCheckout(event.target);
  });
  content.addEventListener("input", (event) => {
    if (event.target.name === "demoName") event.target.setCustomValidity("");
  });
  document.querySelector(".cart-trigger").addEventListener("click", () => {
    renderCart();
    dialog.showModal();
  });

  function update() {
    countBadge.textContent = String(cart.getCount());
    if (dialog.open && phase === "cart") renderCart();
  }
  cart.subscribe(update);
  update();
}
