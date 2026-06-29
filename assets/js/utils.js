export function formatPrice(price) {
  if (!price && price !== 0) return '';
  return Number(price).toLocaleString('en-PK');
}

export function getCurrentProductId() {
  const n = parseInt(new URLSearchParams(window.location.search).get('id'), 10);
  return Number.isNaN(n) ? null : n;
}

const DATA_URL = 'data/products.json';
let dataPromise = null;
export function getProductsData() {
  return dataPromise = dataPromise || fetch(DATA_URL)
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .catch(e => { console.error('Products load failed:', e.message); dataPromise = null; return null; });
}
