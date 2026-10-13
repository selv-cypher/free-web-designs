/* ============================================================
   ReTrO StItChEs — live order tracking page
   Demo only: there's no real courier API behind this. The timeline
   is simulated on a compressed clock (see ORDER_STAGES in main.js)
   so you can watch status update live, right here, without reloading.
   ============================================================ */

let trackOrder = null;
let trackPrevIndex = -1;
let trackTimer = null;

function findTrackOrder() {
  const params = new URLSearchParams(window.location.search);
  const wantedId = params.get('order');
  const all = STORE.getOrders();
  const user = STORE.currentUser();
  const mine = user ? all.filter(o => o.customerEmail === user.email) : all.filter(o => o.customerEmail === 'guest');

  if (wantedId) {
    const found = mine.find(o => o.orderId === wantedId);
    if (found) return found;
    // Order exists but doesn't belong to this session/account
    if (all.find(o => o.orderId === wantedId)) return 'forbidden';
    return null;
  }
  return mine[0] || null;
}

function renderTrack() {
  const root = document.getElementById('track-content');
  trackOrder = findTrackOrder();

  if (trackOrder === 'forbidden') {
    root.innerHTML = `
      <div class="empty-cart">
        <h3 style="font-size:18px; margin-bottom:8px;">Can't show this order</h3>
        <p style="color:var(--text-muted); font-size:14px; margin-bottom:20px;">This order isn't linked to your current account. Log in with the account that placed it.</p>
        <a href="login.html" class="btn btn-accent">Login</a>
      </div>`;
    return;
  }
  if (!trackOrder) {
    root.innerHTML = `
      <div class="empty-cart">
        <h3 style="font-size:18px; margin-bottom:8px;">No order to track yet</h3>
        <p style="color:var(--text-muted); font-size:14px; margin-bottom:20px;">Place an order and it'll show up here with live status updates.</p>
        <a href="catalog.html" class="btn btn-accent">Start Shopping</a>
      </div>`;
    return;
  }

  const o = trackOrder;
  const tl = getOrderTimeline(o);
  trackPrevIndex = tl.currentIndex;

  root.innerHTML = `
    <div class="checkout-banner" style="background:#eef4ff; border-color:#cfe0ff; color:#1b4fa8;">
      Demo mode: this timeline is sped up so you can watch it update live (about 4 minutes end-to-end) instead of the real multi-day delivery window.
    </div>

    <div class="track-panel">
      <div class="track-head">
        <div>
          <div style="font-weight:700; font-size:16px;">Order #${o.orderId}</div>
          <div style="font-size:12.5px; color:var(--text-muted);">Placed on ${new Date(o.date).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</div>
        </div>
        <a href="orders.html" class="btn btn-outline-dark btn-sm">All Orders</a>
      </div>

      <div id="track-live-status" class="track-live-status"></div>

      <div class="tracker-wrap">
        <div class="tracker" id="tracker">
          ${tl.stages.map((s, i) => `
            <div class="tracker-step" data-step="${i}">
              <div class="tracker-icon">${trackIconFor(i)}</div>
              <div class="tracker-label">${s.label}</div>
              <div class="tracker-time" data-step-time="${i}"></div>
            </div>`).join('')}
          <div class="tracker-line-bg"></div>
          <div class="tracker-line-fill" id="tracker-line-fill"></div>
        </div>
      </div>

      ${o.address ? `
      <div class="track-address">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        Delivering to ${o.address.name} — ${o.address.line}, ${o.address.city}, ${o.address.state} ${o.address.pincode}
      </div>` : ''}
    </div>

    <div class="track-panel" style="margin-top:18px;">
      <h3 style="margin-bottom:14px;">Items in this order</h3>
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
        <span style="font-size:13px; color:var(--text-muted);">Paid via ${{ upi: 'UPI', netbanking: 'Net Banking', cod: 'Cash on Delivery' }[o.paymentMethod] || o.paymentMethod}</span>
        <span style="font-weight:800; font-size:15px;">${formatINR(o.total)}</span>
      </div>
    </div>`;

  tickTrack(); // paint immediately, then keep ticking
  if (trackTimer) clearInterval(trackTimer);
  trackTimer = setInterval(tickTrack, 1000);
}

function trackIconFor(i) {
  const icons = [
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8V21H3V8M1 3h22v5H1z"/><path d="M10 12h4"/></svg>',
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12l6-9 6 9-6 9-6-9z"/><path d="M9 3v18"/></svg>',
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-6 9 6-9 6-9-6z"/><path d="M3 9v9l9 6 9-6V9"/></svg>',
  ];
  return icons[i] || icons[0];
}

function tickTrack() {
  if (!trackOrder) return;
  const tl = getOrderTimeline(trackOrder);

  document.getElementById('tracker-line-fill').style.width = tl.progressPct + '%';

  document.querySelectorAll('#tracker .tracker-step').forEach((el, i) => {
    el.classList.toggle('done', i < tl.currentIndex || (i === tl.currentIndex && tl.isFinal));
    el.classList.toggle('current', i === tl.currentIndex && !tl.isFinal);
    const timeEl = el.querySelector(`[data-step-time="${i}"]`);
    if (timeEl) {
      timeEl.textContent = i <= tl.currentIndex
        ? new Date(tl.stages[i].at).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', second: '2-digit' })
        : '';
    }
  });

  const liveEl = document.getElementById('track-live-status');
  if (liveEl) {
    if (tl.isFinal) {
      liveEl.innerHTML = `
        <div class="track-status-icon delivered"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg></div>
        <div>
          <div class="track-status-headline" style="color:var(--success);">Delivered</div>
          <div class="track-status-sub">${tl.currentStage.desc}</div>
        </div>`;
    } else {
      const mins = Math.floor(tl.secToNext / 60);
      const secs = Math.floor(tl.secToNext % 60);
      liveEl.innerHTML = `
        <div class="track-status-icon pulsing"></div>
        <div>
          <div class="track-status-headline">${tl.currentStage.label}</div>
          <div class="track-status-sub">${tl.currentStage.desc} · next update in ${mins}m ${secs.toString().padStart(2, '0')}s</div>
        </div>`;
    }
  }

  if (tl.currentIndex !== trackPrevIndex) {
    if (tl.currentIndex > trackPrevIndex) {
      showToast(`Order status updated: ${tl.currentStage.label}`);
    }
    trackPrevIndex = tl.currentIndex;
  }

  if (tl.isFinal && trackTimer) {
    clearInterval(trackTimer);
    trackTimer = null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader('');
  renderFooter();
  renderTrack();
});
