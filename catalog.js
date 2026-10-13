/* ============================================================
   ReTrO StItChEs — catalog / listing page logic
   ============================================================ */

const priceBuckets = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹1000', min: 500, max: 1000 },
  { label: '₹1000 – ₹2000', min: 1000, max: 2000 },
  { label: '₹2000 – ₹3500', min: 2000, max: 3500 },
  { label: 'Above ₹3500', min: 3500, max: Infinity },
];

const state = {
  cat: null,
  q: null,
  sort: 'relevance',
  collections: new Set(),
  priceIdx: new Set(),
  sizes: new Set(),
  colors: new Set(),
};

function readParamsToState() {
  const params = new URLSearchParams(window.location.search);
  state.cat = params.get('cat');
  state.q = params.get('q');
  state.sort = params.get('sort') || 'relevance';
  const collectionParam = params.get('collection');
  if (collectionParam) state.collections.add(collectionParam);
}

function activeColors() {
  const set = new Set();
  const pool = state.cat ? PRODUCTS.filter(p => p.category === state.cat) : PRODUCTS;
  pool.forEach(p => set.add(p.color));
  return [...set];
}
function activeCollections() {
  const set = new Set();
  const pool = state.cat ? PRODUCTS.filter(p => p.category === state.cat) : PRODUCTS;
  pool.forEach(p => set.add(p.collection));
  return [...set].sort();
}
function activeSizes() {
  const set = new Set();
  const pool = state.cat ? PRODUCTS.filter(p => p.category === state.cat) : PRODUCTS;
  pool.forEach(p => p.sizes.forEach(s => set.add(s)));
  return [...set];
}

const colorHex = {
  Black: '#111113', White: '#ffffff', Navy: '#1b2a4a', Grey: '#8a8a92',
  Olive: '#5c6b30', Maroon: '#6b1e2b', Beige: '#d8c7a1', Blue: '#2f5fa8'
};

function renderSubnav() {
  const el = document.getElementById('subnav-inner');
  el.innerHTML = `<a href="catalog.html" class="${!state.cat ? 'active' : ''}">All</a>` +
    CATEGORIES.map(c => `<a href="catalog.html?cat=${c.key}" class="${state.cat === c.key ? 'active' : ''}">${c.label}</a>`).join('');
}

function renderFilterPanels() {
  document.getElementById('filter-category').innerHTML = CATEGORIES.map(c => {
    const count = PRODUCTS.filter(p => p.category === c.key).length;
    return `<div class="filter-option">
      <input type="checkbox" id="fc-${c.key}" ${state.cat === c.key ? 'checked' : ''} onchange="setCategory('${c.key}', this.checked)">
      <label for="fc-${c.key}">${c.label}</label><span class="count">${count}</span>
    </div>`;
  }).join('');

  document.getElementById('filter-price').innerHTML = priceBuckets.map((b, i) => `
    <div class="filter-option">
      <input type="checkbox" id="fp-${i}" ${state.priceIdx.has(i) ? 'checked' : ''} onchange="toggleSetFilter(state.priceIdx, ${i}, this.checked)">
      <label for="fp-${i}">${b.label}</label>
    </div>`).join('');

  document.getElementById('filter-collection').innerHTML = activeCollections().map(c => `
    <div class="filter-option">
      <input type="checkbox" id="fb-${c.replace(/\s+/g,'')}" ${state.collections.has(c) ? 'checked' : ''} onchange="toggleSetFilter(state.collections, '${c}', this.checked)">
      <label for="fb-${c.replace(/\s+/g,'')}">${c}</label>
    </div>`).join('');

  document.getElementById('filter-size').innerHTML = activeSizes().map(s => `
    <div class="size-pill ${state.sizes.has(s) ? 'active' : ''}" onclick="toggleSetFilter(state.sizes, '${s}', ${!state.sizes.has(s)}); this.classList.toggle('active')">${s}</div>`).join('');

  document.getElementById('filter-color').innerHTML = activeColors().map(c => `
    <div class="swatch ${state.colors.has(c) ? 'active' : ''}" title="${c}" style="background:${colorHex[c] || '#ccc'}" onclick="toggleSetFilter(state.colors, '${c}', ${!state.colors.has(c)}); this.classList.toggle('active')"></div>`).join('');
}

function setCategory(key, checked) {
  state.cat = checked ? key : null;
  renderAll();
}
function toggleSetFilter(set, val, checked) {
  if (checked) set.add(val); else set.delete(val);
  renderProducts();
  renderChips();
}

function renderChips() {
  const chips = [];
  if (state.q) chips.push({ label: `"${state.q}"`, clear: () => { state.q = null; } });
  if (state.cat) {
    const c = CATEGORIES.find(c => c.key === state.cat);
    chips.push({ label: c.label, clear: () => { state.cat = null; } });
  }
  state.collections.forEach(c => chips.push({ label: c, clear: () => state.collections.delete(c) }));
  state.priceIdx.forEach(i => chips.push({ label: priceBuckets[i].label, clear: () => state.priceIdx.delete(i) }));
  state.sizes.forEach(s => chips.push({ label: 'Size ' + s, clear: () => state.sizes.delete(s) }));
  state.colors.forEach(c => chips.push({ label: c, clear: () => state.colors.delete(c) }));

  const el = document.getElementById('active-chips');
  if (!chips.length) { el.innerHTML = ''; return; }
  el.innerHTML = chips.map((chip, i) => `
    <span class="chip">${chip.label}
      <button onclick="clearChip(${i})">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </span>`).join('');
  el._chips = chips;
}
function clearChip(i) {
  const chips = document.getElementById('active-chips')._chips;
  chips[i].clear();
  renderAll();
}

function getFilteredSorted() {
  let list = [...PRODUCTS];
  if (state.cat) list = list.filter(p => p.category === state.cat);
  if (state.q) {
    const q = state.q.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.collection.toLowerCase().includes(q) || p.categoryLabel.toLowerCase().includes(q));
  }
  if (state.collections.size) list = list.filter(p => state.collections.has(p.collection));
  if (state.colors.size) list = list.filter(p => state.colors.has(p.color));
  if (state.sizes.size) list = list.filter(p => p.sizes.some(s => state.sizes.has(s)));
  if (state.priceIdx.size) {
    list = list.filter(p => [...state.priceIdx].some(i => p.price >= priceBuckets[i].min && p.price < priceBuckets[i].max));
  }

  switch (state.sort) {
    case 'new': list = list.filter(p => p.isNew).concat(list.filter(p => !p.isNew)); break;
    case 'bestseller': list = list.filter(p => p.isBestseller).concat(list.filter(p => !p.isBestseller)); break;
    case 'priceLow': list.sort((a, b) => a.price - b.price); break;
    case 'priceHigh': list.sort((a, b) => b.price - a.price); break;
    case 'discount': list.sort((a, b) => b.discountPct - a.discountPct); break;
    case 'rating': list.sort((a, b) => b.rating - a.rating); break;
    default: break;
  }
  return list;
}

function renderProducts() {
  const list = getFilteredSorted();
  const grid = document.getElementById('product-grid');
  const empty = document.getElementById('empty-state');
  document.getElementById('result-count').textContent = `${list.length} product${list.length !== 1 ? 's' : ''} found`;
  if (!list.length) {
    grid.innerHTML = '';
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    grid.innerHTML = list.map(productCardHTML).join('');
  }
}

function renderTitle() {
  const title = document.getElementById('page-title');
  const crumb = document.getElementById('crumb-current');
  if (state.q) { title.textContent = `Results for "${state.q}"`; crumb.textContent = 'Search'; }
  else if (state.cat) {
    const c = CATEGORIES.find(c => c.key === state.cat);
    title.textContent = c ? c.label : 'Shop';
    crumb.textContent = c ? c.label : 'Shop';
  } else { title.textContent = 'All Products'; crumb.textContent = 'Shop'; }
}

function renderAll() {
  renderSubnav();
  renderFilterPanels();
  renderTitle();
  renderProducts();
  renderChips();
}

document.addEventListener('DOMContentLoaded', () => {
  readParamsToState();
  renderHeader(state.cat || (window.location.search.includes('sort=discount') ? 'sale' : ''));
  renderFooter();
  document.getElementById('sort-select').value = state.sort in {relevance:1,new:1,bestseller:1,priceLow:1,priceHigh:1,discount:1,rating:1} ? state.sort : 'relevance';
  document.getElementById('sort-select').addEventListener('change', (e) => { state.sort = e.target.value; renderProducts(); });
  renderAll();
});
