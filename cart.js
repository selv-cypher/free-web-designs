/* ============================================================
   ReTrO StItChEs — cart page logic
   ============================================================ */

function cartLineItems() {
  return STORE.getCart().map((item, index) => {
    const p = getProductById(item.id);
    return p ? { ...item, product: p, index } : null;
  }).filter(Boolean);
}

function renderCart() {
  const items = cartLineItems();
  document.getElementById('bag-count').textContent = items.length ? `(${STORE.cartCount()} item${STORE.cartCount() !== 1 ? 's' : ''})` : '';

  if (!items.length) {
    document.getElementById('cart-content').innerHTML = `
      <div class="empty-cart">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <h3 style="font-size:18px; margin-bottom:8px;">Your bag is empty</h3>
        <p style="color:var(--text-muted); font-size:14px; margin-bottom:20px;">Looks like you haven't added anything yet.</p>
        <a href="catalog.html" class="btn btn-accent">Start Shopping</a>
      </div>`;
    return;
  }

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const mrpTotal = items.reduce((sum, i) => sum + i.product.mrp * i.qty, 0);
  const discount = mrpTotal - subtotal;
  const shipping = subtotal >= 999 ? 0 : 79;
  const total = subtotal + shipping;

  document.getElementById('cart-content').innerHTML = `
    <div class="cart-layout">
      <div class="cart-items">
        ${items.map(i => {
          const color = i.color || i.product.color;
          const custom = [];
          if (i.customText) custom.push(`Text: "${i.customText}"`);
          if (i.customLogo) custom.push('Custom logo uploaded');
          const thumb = (!i.product.photoFixed && i.product.imagesByColor && i.product.imagesByColor[color])
            ? i.product.imagesByColor[color][0]
            : i.product.image;
          return `
          <div class="cart-item">
            <img src="${thumb}" alt="${i.product.name}">
            <div>
              <div class="product-collection">${i.product.collection}</div>
              <div class="cart-item-name">${i.product.name}</div>
              <div class="cart-item-meta">Size: ${i.size} &nbsp;•&nbsp; Color: ${color}</div>
              ${custom.length ? `<div class="cart-item-meta" style="color:var(--accent);">${custom.join(' • ')}</div>` : ''}
              ${i.customLogo ? `<img src="${i.customLogo}" alt="Custom logo" style="max-width:44px; max-height:44px; border-radius:6px; border:1px solid var(--border); margin-top:6px;">` : ''}
              <div class="cart-item-price">${formatINR(i.product.price * i.qty)}</div>
              <div class="qty-stepper">
                <button onclick="changeQty(${i.index}, ${i.qty - 1})">−</button>
                <span>${i.qty}</span>
                <button onclick="changeQty(${i.index}, ${i.qty + 1})">+</button>
              </div>
            </div>
            <button class="remove-btn" onclick="removeItem(${i.index})">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"/></svg>
              Remove
            </button>
          </div>`;
        }).join('')}
      </div>

      <div class="summary-card">
        <h3>Order Summary</h3>
        <div class="summary-row"><span>MRP Total</span><span>${formatINR(mrpTotal)}</span></div>
        <div class="summary-row"><span>Discount</span><span style="color:var(--success)">− ${formatINR(discount)}</span></div>
        <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : formatINR(shipping)}</span></div>
        <div class="promo-row">
          <input type="text" placeholder="Promo code">
          <button class="btn btn-outline-dark btn-sm" onclick="showToast('Invalid or expired code')">Apply</button>
        </div>
        <div class="summary-row total"><span>Total</span><span>${formatINR(total)}</span></div>
        <a href="checkout.html" class="btn btn-accent btn-block" style="margin-top:16px;">Proceed to Checkout</a>
        <a href="catalog.html" class="btn btn-outline-dark btn-block" style="margin-top:10px;">Continue Shopping</a>
      </div>
    </div>`;
}

function changeQty(index, qty) {
  STORE.updateQtyAt(index, qty);
  renderCart();
}
function removeItem(index) {
  STORE.removeAt(index);
  renderCart();
  showToast('Removed from bag');
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader('');
  renderFooter();
  renderCart();
});
