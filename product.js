/* ============================================================
   ReTrO StItChEs — product detail page logic
   ============================================================ */

let currentProduct = null;
let selectedSize = null;
let selectedImgIdx = 0;
let selectedColor = null;
let customText = '';
let customLogoDataUrl = null;

function getIdFromUrl() {
  return new URLSearchParams(window.location.search).get('id');
}

function currentGallery(p) {
  if (!p.photoFixed && p.imagesByColor && p.imagesByColor[selectedColor]) {
    return p.imagesByColor[selectedColor];
  }
  return p.images;
}

function renderPDP() {
  const id = getIdFromUrl();
  currentProduct = getProductById(id) || PRODUCTS[0];
  const p = currentProduct;
  selectedSize = p.sizes[0];
  selectedImgIdx = 0;
  selectedColor = (p.colorOptions && p.colorOptions[0] && p.colorOptions[0].name) || p.color;
  customText = '';
  customLogoDataUrl = null;

  document.title = `${p.name} — ${BRAND_NAME}`;
  document.getElementById('page-title').textContent = `${p.name} — ${BRAND_NAME}`;

  const wished = STORE.isWishlisted(p.id);
  const gallery = currentGallery(p);

  document.getElementById('pdp-root').innerHTML = `
    <nav class="breadcrumb">
      <a href="index.html">Home</a><span class="sep">/</span>
      <a href="catalog.html?cat=${p.category}">${p.categoryLabel}</a><span class="sep">/</span>
      <span>${p.name}</span>
    </nav>

    <div class="pdp-layout">
      <div class="pdp-thumbs" id="pdp-thumbs">
        ${gallery.map((img, i) => `<img src="${img}" class="${i === 0 ? 'active' : ''}" data-i="${i}" onclick="selectImage(${i})" alt="thumbnail ${i+1}">`).join('')}
      </div>
      <div class="pdp-main-image">
        <img src="${gallery[0]}" id="pdp-main-img" alt="${p.name}">
      </div>
      <div class="pdp-info">
        <span class="pdp-brand">${p.collection}</span>
        <h1>${p.name}</h1>
        <div class="pdp-rating">
          <span class="product-rating">${starIconSVG()} ${p.rating}</span>
          <span style="color:var(--text-muted); font-size:13px;">${p.reviews.toLocaleString('en-IN')} ratings</span>
          ${p.isBestseller ? '<span class="tag tag-best">Bestseller</span>' : ''}
          ${p.isNew ? '<span class="tag tag-new">New</span>' : ''}
        </div>

        <div class="pdp-price-row">
          <span class="price-now">${formatINR(p.price)}</span>
          <span class="price-mrp">${formatINR(p.mrp)}</span>
          <span class="price-off">${p.discountPct}% OFF</span>
        </div>
        <div class="pdp-tax-note">Inclusive of all taxes</div>

        <div class="option-group">
          <div class="label-row"><span>Select Size</span><a href="#">Size Guide</a></div>
          <div class="size-pills" id="size-pills">
            ${p.sizes.map(s => `<div class="size-pill ${s === selectedSize ? 'active' : ''}" data-size="${s}" onclick="selectSize('${s}')">${s}</div>`).join('')}
          </div>
        </div>

        <div class="option-group">
          <div class="label-row"><span>Color: <strong id="pdp-color-label">${selectedColor}</strong></span></div>
          <div class="color-swatches" id="color-swatches">
            ${(p.colorOptions || [{ name: p.color, hex: colorHexPDP(p.color) }]).map(c => `
              <span class="swatch ${c.name === selectedColor ? 'active' : ''}" data-color="${c.name}" style="background:${c.hex}" title="${c.name}" onclick="selectColor('${c.name.replace(/'/g, "\\'")}')"></span>
            `).join('')}
          </div>
          ${p.photoFixed ? '<div class="pdp-tax-note" style="margin-top:6px;">Product photo shown is representative; actual shade may vary slightly by color.</div>' : ''}
        </div>

        ${p.customizable ? `
        <div class="option-group">
          <div class="label-row"><span>Customize This Piece <span style="color:var(--text-muted); font-weight:400;">(optional)</span></span></div>
          <input type="text" id="custom-text-input" maxlength="20" placeholder="Add initials, a name, or short text to print" value="${customText}" oninput="setCustomText(this.value)" style="width:100%; padding:10px 12px; border:1px solid var(--border); border-radius:8px; font-size:14px; margin-bottom:10px;">
          <label class="btn btn-outline-dark btn-sm" style="display:inline-flex; cursor:pointer; align-items:center; gap:8px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload a logo / design
            <input type="file" accept="image/*" onchange="handleLogoUpload(event)" style="display:none;">
          </label>
          <span id="custom-logo-name" style="margin-left:10px; font-size:12px; color:var(--text-muted);"></span>
          <div id="custom-logo-preview" style="margin-top:10px;"></div>
        </div>` : ''}

        <div class="pdp-actions">
          <button class="btn btn-accent" onclick="addToBag()">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Add to Bag
          </button>
          <button class="wish-btn ${wished ? 'active' : ''}" id="pdp-wish-btn" onclick="togglePdpWish()" aria-label="Wishlist">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="${wished ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
          </button>
        </div>

        <div class="trust-row">
          <div class="trust-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> 100% Authentic</div>
          <div class="trust-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> 7-Day Easy Returns</div>
          <div class="trust-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> Cash on Delivery</div>
        </div>

        <div class="pdp-desc">
          <h3>Product Details</h3>
          <p>${p.description}</p>
          <table class="spec-table">
            <tr><td>Brand</td><td>${p.brand}</td></tr>
            <tr><td>Collection</td><td>${p.collection}</td></tr>
            <tr><td>Category</td><td>${p.categoryLabel}</td></tr>
            <tr><td>Color</td><td id="pdp-spec-color">${selectedColor}</td></tr>
            <tr><td>Material</td><td>Premium Cotton Blend</td></tr>
            <tr><td>Care</td><td>Machine wash cold, do not bleach</td></tr>
          </table>
        </div>
      </div>
    </div>
  `;

  renderRelated(p);
}

function colorHexPDP(c) {
  const map = { Black: '#111113', White: '#ffffff', Navy: '#1b2a4a', Grey: '#8a8a92', Olive: '#5c6b30', Maroon: '#6b1e2b', Beige: '#d8c7a1', Blue: '#2f5fa8' };
  return map[c] || '#ccc';
}

function selectImage(i) {
  selectedImgIdx = i;
  const gallery = currentGallery(currentProduct);
  document.getElementById('pdp-main-img').src = gallery[i];
  document.querySelectorAll('#pdp-thumbs img').forEach(img => img.classList.toggle('active', +img.dataset.i === i));
}

function selectSize(s) {
  selectedSize = s;
  document.querySelectorAll('#size-pills .size-pill').forEach(el => el.classList.toggle('active', el.dataset.size === s));
}

function selectColor(name) {
  selectedColor = name;
  document.querySelectorAll('#color-swatches .swatch').forEach(el => el.classList.toggle('active', el.dataset.color === name));
  const label = document.getElementById('pdp-color-label');
  if (label) label.textContent = name;
  const specColor = document.getElementById('pdp-spec-color');
  if (specColor) specColor.textContent = name;

  // Swap gallery images for placeholder-image products
  if (!currentProduct.photoFixed) {
    selectedImgIdx = 0;
    const gallery = currentGallery(currentProduct);
    document.getElementById('pdp-main-img').src = gallery[0];
    const thumbsEl = document.getElementById('pdp-thumbs');
    if (thumbsEl) {
      thumbsEl.innerHTML = gallery.map((img, i) => `<img src="${img}" class="${i === 0 ? 'active' : ''}" data-i="${i}" onclick="selectImage(${i})" alt="thumbnail ${i+1}">`).join('');
    }
  }
}

function setCustomText(val) {
  customText = val;
}

function handleLogoUpload(evt) {
  const file = evt.target.files && evt.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('Please choose an image file');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    customLogoDataUrl = reader.result;
    document.getElementById('custom-logo-name').textContent = file.name;
    document.getElementById('custom-logo-preview').innerHTML =
      `<img src="${customLogoDataUrl}" alt="Uploaded design preview" style="max-width:90px; max-height:90px; border-radius:8px; border:1px solid var(--border);">`;
  };
  reader.readAsDataURL(file);
}

function addToBag() {
  STORE.addToCart(currentProduct.id, selectedSize, 1, {
    color: selectedColor,
    customText: customText ? customText.trim() : '',
    customLogo: customLogoDataUrl,
  });
  const extras = [];
  if (customText && customText.trim()) extras.push('custom text');
  if (customLogoDataUrl) extras.push('custom logo');
  showToast(`Added to bag — Size ${selectedSize}, ${selectedColor}${extras.length ? ' + ' + extras.join(' & ') : ''}`);
}

function togglePdpWish() {
  const active = STORE.toggleWishlist(currentProduct.id);
  const btn = document.getElementById('pdp-wish-btn');
  btn.classList.toggle('active', active);
  btn.querySelector('svg').setAttribute('fill', active ? 'currentColor' : 'none');
  showToast(active ? 'Added to wishlist' : 'Removed from wishlist');
}

function renderRelated(p) {
  const related = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
  if (!related.length) return;
  document.getElementById('related-section').style.display = 'block';
  document.getElementById('related-grid').innerHTML = related.map(productCardHTML).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader('');
  renderFooter();
  renderPDP();
});
