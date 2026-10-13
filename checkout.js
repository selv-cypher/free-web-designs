/* ============================================================
   ReTrO StItChEs — checkout page logic
   Demo only: no real payment gateway is connected here. UPI / Net
   Banking / COD all simulate a processing delay and then mark the
   order "Confirmed" locally — no money actually moves.
   ============================================================ */

let ckState = {
  step: 'address', // address -> payment -> processing -> success
  address: null,
  paymentMethod: 'upi',
  lastOrder: null,
};

const BANKS = [
  'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
  'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda', 'Yes Bank',
];

function ckCartTotals() {
  const items = STORE.getCart().map(i => ({ ...i, product: getProductById(i.id) })).filter(i => i.product);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const mrpTotal = items.reduce((sum, i) => sum + i.product.mrp * i.qty, 0);
  const discount = mrpTotal - subtotal;
  const shipping = subtotal >= 999 ? 0 : 79;
  const total = subtotal + shipping;
  return { items, subtotal, mrpTotal, discount, shipping, total };
}

function renderCheckout() {
  const { items } = ckCartTotals();
  const root = document.getElementById('checkout-content');

  if (!items.length && ckState.step !== 'success') {
    root.innerHTML = `
      <div class="empty-cart">
        <h3 style="font-size:18px; margin-bottom:8px;">Your bag is empty</h3>
        <p style="color:var(--text-muted); font-size:14px; margin-bottom:20px;">Add something to your bag before checking out.</p>
        <a href="catalog.html" class="btn btn-accent">Start Shopping</a>
      </div>`;
    return;
  }

  if (ckState.step === 'address') return renderAddressStep();
  if (ckState.step === 'payment') return renderPaymentStep();
  if (ckState.step === 'processing') return renderProcessingStep();
  if (ckState.step === 'success') return renderSuccessStep();
}

function ckStepper(active) {
  const steps = [['address', 'Address'], ['payment', 'Payment'], ['success', 'Confirmation']];
  return `<div class="checkout-steps">
    ${steps.map(([key, label], i) => `
      <div class="checkout-step ${key === active ? 'active' : ''} ${steps.findIndex(s => s[0] === active) > i ? 'done' : ''}">
        <span class="step-num">${i + 1}</span><span>${label}</span>
      </div>`).join('<span class="step-sep"></span>')}
  </div>`;
}

function ckSummaryCard() {
  const { items, subtotal, discount, shipping, total } = ckCartTotals();
  return `
    <div class="summary-card">
      <h3>Order Summary</h3>
      <div class="ck-summary-items">
        ${items.map(i => `
          <div class="ck-summary-item">
            <img src="${i.product.image}" alt="${i.product.name}">
            <div>
              <div style="font-size:13px; font-weight:600;">${i.product.name}</div>
              <div style="font-size:11.5px; color:var(--text-muted);">Size ${i.size} × ${i.qty}</div>
            </div>
            <span style="font-size:13px; font-weight:700; margin-left:auto;">${formatINR(i.product.price * i.qty)}</span>
          </div>`).join('')}
      </div>
      <div class="summary-row"><span>Subtotal</span><span>${formatINR(subtotal)}</span></div>
      <div class="summary-row"><span>Discount</span><span style="color:var(--success)">− ${formatINR(discount)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : formatINR(shipping)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${formatINR(total)}</span></div>
    </div>`;
}

function renderAddressStep() {
  const user = STORE.currentUser();
  const saved = STORE.getSavedAddress() || {};
  document.getElementById('checkout-content').innerHTML = `
    ${ckStepper('address')}
    ${!user ? `<div class="checkout-banner">Have an account? <a href="login.html?next=checkout.html">Login</a> for faster checkout and order tracking, or continue as a guest below.</div>` : ''}
    <div class="checkout-layout">
      <form class="checkout-panel" id="address-form" onsubmit="handleAddressSubmit(event)">
        <h3 style="margin-bottom:16px;">Delivery Address</h3>
        <label class="auth-label">Full Name
          <input type="text" name="name" required value="${saved.name || (user ? user.name : '')}">
        </label>
        <label class="auth-label">Phone Number
          <input type="tel" name="phone" required pattern="[0-9]{10}" placeholder="10-digit mobile number" value="${saved.phone || ''}">
        </label>
        <label class="auth-label">Address Line
          <input type="text" name="line" required placeholder="House no., street, area" value="${saved.line || ''}">
        </label>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
          <label class="auth-label">City
            <input type="text" name="city" required value="${saved.city || ''}">
          </label>
          <label class="auth-label">State
            <input type="text" name="state" required value="${saved.state || ''}">
          </label>
        </div>
        <label class="auth-label">Pincode
          <input type="text" name="pincode" required pattern="[0-9]{6}" placeholder="6-digit pincode" value="${saved.pincode || ''}">
        </label>
        <button type="submit" class="btn btn-accent btn-block">Continue to Payment</button>
      </form>
      ${ckSummaryCard()}
    </div>`;
}

function handleAddressSubmit(evt) {
  evt.preventDefault();
  const f = evt.target;
  ckState.address = {
    name: f.name.value.trim(), phone: f.phone.value.trim(), line: f.line.value.trim(),
    city: f.city.value.trim(), state: f.state.value.trim(), pincode: f.pincode.value.trim(),
  };
  STORE.saveAddress(ckState.address);
  ckState.step = 'payment';
  renderCheckout();
}

function renderPaymentStep() {
  const { total } = ckCartTotals();
  document.getElementById('checkout-content').innerHTML = `
    ${ckStepper('payment')}
    <div class="checkout-layout">
      <div class="checkout-panel">
        <h3 style="margin-bottom:16px;">Payment Method</h3>
        <div class="pay-tabs">
          <button type="button" class="pay-tab ${ckState.paymentMethod === 'upi' ? 'active' : ''}" onclick="ckSelectPayment('upi')">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 9h20"/></svg>
            UPI
          </button>
          <button type="button" class="pay-tab ${ckState.paymentMethod === 'netbanking' ? 'active' : ''}" onclick="ckSelectPayment('netbanking')">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M4 21V9l8-6 8 6v12M9 21v-6h6v6"/></svg>
            Net Banking
          </button>
          <button type="button" class="pay-tab ${ckState.paymentMethod === 'cod' ? 'active' : ''}" onclick="ckSelectPayment('cod')">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 10h6M9 14h6"/></svg>
            Cash on Delivery
          </button>
        </div>
        <div id="pay-method-body">${ckPaymentBody()}</div>
        <button type="button" class="btn btn-outline-dark" style="margin-top:16px;" onclick="ckState.step='address'; renderCheckout();">← Back to Address</button>
      </div>
      ${ckSummaryCard()}
    </div>`;
}

function ckSelectPayment(method) {
  ckState.paymentMethod = method;
  document.querySelectorAll('.pay-tab').forEach((el, i) => {
    el.classList.toggle('active', ['upi', 'netbanking', 'cod'][i] === method);
  });
  document.getElementById('pay-method-body').innerHTML = ckPaymentBody();
}

function ckPaymentBody() {
  const { total } = ckCartTotals();
  if (ckState.paymentMethod === 'upi') {
    return `
      <div class="pay-upi">
        <div class="upi-qr-box">
          <canvas id="upi-qr-canvas" width="150" height="150"></canvas>
          <p>Scan with any UPI app to pay <strong>${formatINR(total)}</strong></p>
        </div>
        <div class="upi-or">or</div>
        <div class="upi-id-row">
          <input type="text" id="upi-id-input" placeholder="yourname@upi" style="flex:1;">
          <button class="btn btn-accent" onclick="ckPayNow()">Verify & Pay ${formatINR(total)}</button>
        </div>
        <p class="checkout-hint">Demo payment — no real transaction is made and no money is deducted.</p>
      </div>`;
  }
  if (ckState.paymentMethod === 'netbanking') {
    return `
      <div class="pay-netbanking">
        <label class="auth-label">Select your bank
          <select id="bank-select" style="display:block; width:100%; margin-top:6px; padding:11px 13px; border:1px solid var(--border); border-radius:8px; font-size:14px;">
            ${BANKS.map(b => `<option>${b}</option>`).join('')}
          </select>
        </label>
        <button class="btn btn-accent btn-block" onclick="ckOpenBankModal()">Proceed to Net Banking — ${formatINR(total)}</button>
        <p class="checkout-hint">Demo payment — no real bank login happens and no money is deducted.</p>
      </div>`;
  }
  return `
    <div class="pay-cod">
      <p style="font-size:14px; color:var(--text-muted); margin-bottom:16px;">Pay in cash when your order is delivered.</p>
      <button class="btn btn-accent btn-block" onclick="ckPayNow()">Place Order — Pay ${formatINR(total)} on Delivery</button>
    </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  // Draw the fake UPI QR whenever the UPI panel is visible
  const observer = new MutationObserver(() => {
    const canvas = document.getElementById('upi-qr-canvas');
    if (canvas && !canvas.dataset.drawn) {
      drawFakeQR(canvas);
      canvas.dataset.drawn = '1';
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
});

function drawFakeQR(canvas) {
  const ctx = canvas.getContext('2d');
  const cells = 15;
  const cellSize = canvas.width / cells;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#111113';
  let seed = 42;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      // Draw fixed "finder" squares in corners like a real QR, random noise elsewhere
      const inCorner = (x < 4 && y < 4) || (x > cells - 5 && y < 4) || (x < 4 && y > cells - 5);
      if (inCorner) {
        const cx = x < 4 ? 0 : cells - 4;
        const cy = y < 4 ? 0 : 0;
        if (x >= cx && x < cx + 4 && ((y < 4) || (x < 4 && y > cells - 5))) {
          // simple ring pattern
          const lx = x - (x < 4 ? 0 : cells - 4);
          const ly = (y < 4) ? y : y - (cells - 5) - 1;
          if (lx === 0 || lx === 3 || ly === 0 || ly === 3) ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      } else if (rand() > 0.55) {
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
}

function ckOpenBankModal() {
  const bank = document.getElementById('bank-select').value;
  const { total } = ckCartTotals();
  const overlay = document.createElement('div');
  overlay.className = 'bank-modal-overlay';
  overlay.innerHTML = `
    <div class="bank-modal">
      <button class="bank-modal-close" onclick="this.closest('.bank-modal-overlay').remove()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
      <h3>${bank} — Net Banking</h3>
      <p class="checkout-hint" style="margin-bottom:16px;">This is a simulated bank login for demo purposes only.</p>
      <label class="auth-label">User ID
        <input type="text" id="bank-user" placeholder="Your net banking user ID">
      </label>
      <label class="auth-label">Password
        <input type="password" id="bank-pass" placeholder="Your net banking password">
      </label>
      <button class="btn btn-accent btn-block" onclick="ckBankLogin()">Login & Authorize Payment — ${formatINR(total)}</button>
    </div>`;
  document.body.appendChild(overlay);
}

function ckBankLogin() {
  document.querySelector('.bank-modal-overlay')?.remove();
  ckPayNow();
}

function ckPayNow() {
  ckState.step = 'processing';
  renderCheckout();
  setTimeout(() => {
    ckFinalizeOrder();
    ckState.step = 'success';
    renderCheckout();
  }, 1400);
}

function renderProcessingStep() {
  const methodLabel = { upi: 'UPI payment', netbanking: 'net banking payment', cod: 'order' }[ckState.paymentMethod];
  document.getElementById('checkout-content').innerHTML = `
    <div class="checkout-processing">
      <div class="spinner"></div>
      <p>Confirming your ${methodLabel}…</p>
    </div>`;
}

function ckFinalizeOrder() {
  const { items, subtotal, discount, shipping, total } = ckCartTotals();
  const user = STORE.currentUser();
  const order = {
    orderId: 'RS' + Date.now().toString().slice(-8),
    date: new Date().toISOString(),
    customerEmail: user ? user.email : 'guest',
    customerName: ckState.address ? ckState.address.name : (user ? user.name : 'Guest'),
    address: ckState.address,
    paymentMethod: ckState.paymentMethod,
    items: items.map(i => ({
      id: i.id, name: i.product.name, image: i.product.image, size: i.size,
      color: i.color || i.product.color, customText: i.customText || '', qty: i.qty, price: i.product.price,
    })),
    subtotal, discount, shipping, total,
    status: 'Confirmed',
  };
  STORE.saveOrder(order);
  STORE.saveCart([]);
  ckState.lastOrder = order;
}

function renderSuccessStep() {
  const o = ckState.lastOrder;
  if (!o) { window.location.href = 'index.html'; return; }
  const eta = new Date(Date.now() + 5 * 24 * 3600 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const methodLabel = { upi: 'UPI', netbanking: 'Net Banking', cod: 'Cash on Delivery' }[o.paymentMethod];
  document.getElementById('checkout-content').innerHTML = `
    ${ckStepper('success')}
    <div class="order-success">
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></svg>
      <h2>Order Confirmed!</h2>
      <p>Order <strong>#${o.orderId}</strong> placed via ${methodLabel}. Estimated delivery by <strong>${eta}</strong>.</p>
      <div class="order-success-actions">
        <a href="track.html?order=${o.orderId}" class="btn btn-accent">Track My Order</a>
        <a href="orders.html" class="btn btn-outline-dark">View My Orders</a>
        <a href="catalog.html" class="btn btn-outline-dark">Continue Shopping</a>
      </div>
    </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader('');
  renderFooter();
  renderCheckout();
});
