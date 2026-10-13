/* ============================================================
   ReTrO StItChEs — order history page logic
   ============================================================ */

function renderOrders() {
  const user = STORE.currentUser();
  const root = document.getElementById('orders-content');

  if (!user) {
    root.innerHTML = `
      <div class="empty-cart">
        <h3 style="font-size:18px; margin-bottom:8px;">Login to see your orders</h3>
        <p style="color:var(--text-muted); font-size:14px; margin-bottom:20px;">Order history is tied to your account.</p>
        <a href="login.html?next=orders.html" class="btn btn-accent">Login / Sign Up</a>
      </div>`;
    return;
  }

  const orders = STORE.ordersForCurrentUser();
  if (!orders.length) {
    root.innerHTML = `
      <div class="empty-cart">
        <h3 style="font-size:18px; margin-bottom:8px;">No orders yet</h3>
        <p style="color:var(--text-muted); font-size:14px; margin-bottom:20px;">When you place an order, it'll show up here.</p>
        <a href="catalog.html" class="btn btn-accent">Start Shopping</a>
      </div>`;
    return;
  }

  const methodLabel = { upi: 'UPI', netbanking: 'Net Banking', cod: 'Cash on Delivery' };

  root.innerHTML = orders.map(o => {
    const tl = getOrderTimeline(o);
    return `
    <div class="order-card">
      <div class="order-card-head">
        <div>
          <div style="font-weight:700; font-size:15px;">Order #${o.orderId}</div>
          <div style="font-size:12.5px; color:var(--text-muted);">Placed on ${new Date(o.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · Paid via ${methodLabel[o.paymentMethod] || o.paymentMethod}</div>
        </div>
        <span class="order-status ${tl.isFinal ? 'delivered' : ''}">${tl.currentStage.label}</span>
      </div>
      <div class="order-card-items">
        ${o.items.map(i => `
          <div class="order-card-item">
            <img src="${i.image}" alt="${i.name}">
            <div>
              <div style="font-size:13px; font-weight:600;">${i.name}</div>
              <div style="font-size:11.5px; color:var(--text-muted);">Size ${i.size} · ${i.color}${i.customText ? ` · "${i.customText}"` : ''} · Qty ${i.qty}</div>
            </div>
            <span style="margin-left:auto; font-size:13px; font-weight:700;">${formatINR(i.price * i.qty)}</span>
          </div>`).join('')}
      </div>
      <div class="order-card-foot">
        <span style="font-size:13px; color:var(--text-muted);">${o.address ? `Delivering to ${o.address.city}, ${o.address.state} — ${o.address.pincode}` : ''}</span>
        <span style="font-weight:800; font-size:15px;">${formatINR(o.total)}</span>
      </div>
      <a href="track.html?order=${o.orderId}" class="btn btn-outline-dark btn-sm" style="margin-top:14px; display:inline-flex;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        Track Order
      </a>
    </div>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader('');
  renderFooter();
  renderOrders();
});
