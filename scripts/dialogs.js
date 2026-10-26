import { PRODUCTS } from "./data/products.js";
import { escapeHtml, formatCurrency, productImage, notify } from "./utils.js";

const PROJECT_INFORMATION = `
  <p class="eyebrow">Über diesen Entwurf</p>
  <h2>Ein neues digitales Zuhause.</h2>
  <p>Unabhängiges Website-Designkonzept für die Apothekenfamilie in Hildesheim. Diese Website ist keine offizielle Website der Apotheken. Alle Bestellfunktionen sind Simulationen.</p>
  <p>Original-Logos und Apothekenfotos stammen von den öffentlich zugänglichen Apotheken-Websites. Die Produktabbildungen stammen von den jeweiligen Marken-Websites. Die Rechte verbleiben bei den jeweiligen Rechteinhabern. Es besteht keine behauptete Markenpartnerschaft.</p>
  <p>Die Auswahl zeigt ein mögliches Sortiment. Preise sind frei gewählte Beispiele. Produktinformationen und Bildquellen sind bei den einzelnen Artikeln verlinkt.</p>
  <h3>Recherchequellen vom 26.10.2026</h3>
  <ul class="legal-sources">
    <li><a href="https://www.apotheke-am-theater-hildesheim.de/einhorn-apotheke" target="_blank" rel="noopener">Einhorn-Apotheke</a></li>
    <li><a href="https://www.apotheke-am-theater-hildesheim.de/" target="_blank" rel="noopener">Apotheke am Theater</a></li>
    <li><a href="https://www.steinberg-apotheke.de/" target="_blank" rel="noopener">Steinberg-Apotheke</a></li>
    <li><a href="https://nomosan-ug.com/" target="_blank" rel="noopener">NomoSan</a></li>
  </ul>`;

const PRIVACY_INFORMATION = `
  <p class="eyebrow">Zu diesem Prototyp</p>
  <h2>Ihre Daten im Demoshop.</h2>
  <p>Artikelkennungen und Mengen werden ausschließlich lokal in Ihrem Browser gespeichert. Der Testname für die simulierte Bestellung bleibt vorübergehend im Arbeitsspeicher der Seite. Es werden keine Bestell-, Gesundheits- oder Zahlungsdaten versendet.</p>
  <p>Bilder und Schriften werden lokal bereitgestellt. Es sind keine Analyse- oder Marketingdienste eingebunden. GitHub Pages verarbeitet technische Zugriffsdaten für die Bereitstellung gemäß seinen eigenen Datenschutzbestimmungen. Bei externen Links gelten die Bestimmungen des jeweiligen Anbieters.</p>
  <button id="clear-storage" class="button">Demo-Warenkorb löschen</button>`;

export function initializeDialogs({ onAdd, cart }) {
  const dialog = document.querySelector("#info-dialog");
  const content = document.querySelector("#info-body");

  function showContent(html) {
    content.innerHTML = html;
    dialog.showModal();
  }

  function showProduct(id) {
    const product = PRODUCTS.find((item) => item.id === id);
    if (!product) return;
    showContent(`<div class="detail-art">${productImage(product)}</div>
      <p class="eyebrow">${escapeHtml(product.brand)} · Demoshop</p>
      <h2>${escapeHtml(product.name)}</h2>
      <p>${escapeHtml(product.pack)}</p>
      <p>Die Abbildung zeigt ein echtes Markenprodukt. Der Preis dient ausschließlich als Beispiel. Im Demoshop wird nichts tatsächlich bestellt oder reserviert.</p>
      <p>Ob eine Ergänzung zu Ihnen und Ihren Medikamenten passt, klären Sie bitte persönlich mit dem Apothekenteam. Zusammensetzung und Hinweise finden Sie bei der Original-Produktinformation.</p>
      <a class="text-link" href="${escapeHtml(product.source)}" target="_blank" rel="noopener">Original-Produktinformation öffnen</a>
      <p class="detail-price">${formatCurrency(product.price)} <small>Beispielpreis</small></p>
      <button class="button wide" data-detail-add="${product.id}">In den Demo-Warenkorb</button>`);
  }

  document.querySelectorAll("[data-legal]").forEach((button) => {
    button.addEventListener("click", () => {
      showContent(
        button.dataset.legal === "privacy"
          ? PRIVACY_INFORMATION
          : PROJECT_INFORMATION,
      );
    });
  });

  content.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-detail-add]");
    if (addButton) {
      onAdd(addButton.dataset.detailAdd);
      dialog.close();
    }
    if (event.target.closest("#clear-storage")) {
      cart.clear();
      dialog.close();
      notify("Demo-Warenkorb gelöscht.");
    }
  });

  document.querySelectorAll("dialog").forEach((item) => {
    item
      .querySelector(".close-dialog")
      .addEventListener("click", () => item.close());
    item.addEventListener("click", (event) => {
      if (event.target !== item) return;
      const bounds = item.getBoundingClientRect();
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      ) {
        item.close();
      }
    });
  });

  return { showProduct };
}
