/* ============================================================
   ReTrO StItChEs — wishlist page logic
   ============================================================ */

function renderWishlist() {
  const ids = STORE.getWishlist();
  const items = ids.map(getProductById).filter(Boolean);
  document.getElementById('wish-count').textContent = items.length ? `(${items.length} item${items.length !== 1 ? 's' : ''})` : '';

  if (!items.length) {
    document.getElementById('wishlist-content').innerHTML = `
      <div class="empty-wishlist">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
        <h3 style="font-size:18px; margin-bottom:8px;">Your wishlist is empty</h3>
        <p style="color:var(--text-muted); font-size:14px; margin-bottom:20px;">Save items you love and find them here anytime.</p>
        <a href="catalog.html" class="btn btn-accent">Discover Products</a>
      </div>`;
    return;
  }

  document.getElementById('wishlist-content').innerHTML = `<div class="product-grid wishlist-grid">${items.map(productCardHTML).join('')}</div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader('');
  renderFooter();
  renderWishlist();

  // Re-render this page live when a heart is toggled from a card here
  const originalHandleWishClick = window.handleWishClick;
  window.handleWishClick = function (id, btnEl) {
    originalHandleWishClick(id, btnEl);
    renderWishlist();
  };
});
