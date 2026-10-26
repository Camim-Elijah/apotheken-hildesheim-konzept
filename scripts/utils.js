const currencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

export function formatCurrency(amount) {
  return currencyFormatter.format(amount);
}

export function escapeHtml(value) {
  const entities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return String(value).replace(/[&<>"']/g, (character) => entities[character]);
}

export function readPreference(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

export function writePreference(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The site remains usable when browser storage is unavailable.
  }
}

let notificationTimer;

export function notify(message) {
  const notification = document.querySelector("#toast");
  notification.textContent = message;
  notification.classList.add("show");
  clearTimeout(notificationTimer);
  notificationTimer = setTimeout(
    () => notification.classList.remove("show"),
    2800,
  );
}

export function productImage(product) {
  return `<img class="product-photo" src="${escapeHtml(product.image)}"
    alt="Produktabbildung ${escapeHtml(product.brand)} ${escapeHtml(product.name)}"
    loading="lazy" width="640" height="640">`;
}
