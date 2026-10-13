/* ============================================================
   ReTrO StItChEs — shared utilities: state, header, product card render
   ============================================================ */

const STORE = {
  cartKey: 'retro_stitches_cart',
  wishKey: 'retro_stitches_wishlist',

  getCart() {
    try { return JSON.parse(localStorage.getItem(this.cartKey)) || []; }
    catch (e) { return []; }
  },
  saveCart(cart) {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    updateHeaderCounts();
  },
  addToCart(productId, size, qty = 1, extra = {}) {
    const cart = this.getCart();
    const color = extra.color || null;
    const customText = extra.customText || '';
    const customLogo = extra.customLogo || null;
    // A line is a distinct combination of product + size + color + personalization
    const existing = cart.find(i => i.id === productId && i.size === size && i.color === color && i.customText === customText && i.customLogo === customLogo);
    if (existing) existing.qty += qty;
    else cart.push({ id: productId, size, qty, color, customText, customLogo });
    this.saveCart(cart);
  },
  updateQty(productId, size, qty) {
    // Legacy helper (id+size only) — kept for compatibility, but a cart can now hold
    // several lines of the same id+size in different colors/personalizations, so the
    // cart page uses updateQtyAt/removeAt (by line index) instead.
    let cart = this.getCart();
    if (qty <= 0) {
      cart = cart.filter(i => !(i.id === productId && i.size === size));
    } else {
      const item = cart.find(i => i.id === productId && i.size === size);
      if (item) item.qty = qty;
    }
    this.saveCart(cart);
  },
  removeFromCart(productId, size) {
    const cart = this.getCart().filter(i => !(i.id === productId && i.size === size));
    this.saveCart(cart);
  },
  updateQtyAt(index, qty) {
    let cart = this.getCart();
    if (qty <= 0) {
      cart.splice(index, 1);
    } else if (cart[index]) {
      cart[index].qty = qty;
    }
    this.saveCart(cart);
  },
  removeAt(index) {
    const cart = this.getCart();
    cart.splice(index, 1);
    this.saveCart(cart);
  },
  cartCount() {
    return this.getCart().reduce((sum, i) => sum + i.qty, 0);
  },

  getWishlist() {
    try { return JSON.parse(localStorage.getItem(this.wishKey)) || []; }
    catch (e) { return []; }
  },
  saveWishlist(list) {
    localStorage.setItem(this.wishKey, JSON.stringify(list));
    updateHeaderCounts();
  },
  toggleWishlist(productId) {
    let list = this.getWishlist();
    const has = list.includes(productId);
    if (has) list = list.filter(id => id !== productId);
    else list.push(productId);
    this.saveWishlist(list);
    return !has;
  },
  isWishlisted(productId) {
    return this.getWishlist().includes(productId);
  },

  /* ---------- Customer accounts (demo — stored in this browser only) ---------- */
  usersKey: 'retro_stitches_users',
  sessionKey: 'retro_stitches_session',

  getUsers() {
    try { return JSON.parse(localStorage.getItem(this.usersKey)) || []; }
    catch (e) { return []; }
  },
  saveUsers(users) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  },
  signup(name, email, password) {
    const users = this.getUsers();
    const emailLc = email.trim().toLowerCase();
    if (users.some(u => u.email === emailLc)) {
      return { ok: false, error: 'An account with this email already exists. Try logging in instead.' };
    }
    const user = { name: name.trim(), email: emailLc, phone: '', password, joined: new Date().toISOString() };
    users.push(user);
    this.saveUsers(users);
    this.setSession(emailLc);
    return { ok: true, user };
  },
  login(email, password) {
    const users = this.getUsers();
    const emailLc = email.trim().toLowerCase();
    const user = users.find(u => u.email === emailLc && u.password === password);
    if (!user) return { ok: false, error: 'Incorrect email or password.' };
    this.setSession(emailLc);
    return { ok: true, user };
  },
  setSession(email) {
    localStorage.setItem(this.sessionKey, email);
  },
  logout() {
    localStorage.removeItem(this.sessionKey);
    updateHeaderCounts();
  },
  currentUser() {
    const email = localStorage.getItem(this.sessionKey);
    if (!email) return null;
    return this.getUsers().find(u => u.email === email) || null;
  },
  updateProfile(updates) {
    const current = this.currentUser();
    if (!current) return { ok: false, error: 'Not logged in.' };
    const users = this.getUsers();
    const newEmail = (updates.email || current.email).trim().toLowerCase();
    if (newEmail !== current.email && users.some(u => u.email === newEmail)) {
      return { ok: false, error: 'Another account already uses that email.' };
    }
    const idx = users.findIndex(u => u.email === current.email);
    if (idx === -1) return { ok: false, error: 'Account not found.' };
    const updated = {
      ...users[idx],
      name: (updates.name || current.name).trim(),
      email: newEmail,
      phone: updates.phone !== undefined ? updates.phone.trim() : (current.phone || ''),
    };
    users[idx] = updated;
    this.saveUsers(users);
    if (newEmail !== current.email) {
      // Keep orders and saved addresses attached to the account when the email changes
      const orders = this.getOrders().map(o => o.customerEmail === current.email ? { ...o, customerEmail: newEmail } : o);
      localStorage.setItem(this.ordersKey, JSON.stringify(orders));
      const oldAddrKey = `retro_stitches_address_${current.email}`;
      const savedAddr = localStorage.getItem(oldAddrKey);
      if (savedAddr) {
        localStorage.setItem(`retro_stitches_address_${newEmail}`, savedAddr);
        localStorage.removeItem(oldAddrKey);
      }
      this.setSession(newEmail);
    }
    return { ok: true, user: updated };
  },
  changePassword(currentPassword, newPassword) {
    const current = this.currentUser();
    if (!current) return { ok: false, error: 'Not logged in.' };
    if (current.password !== currentPassword) return { ok: false, error: 'Current password is incorrect.' };
    const users = this.getUsers();
    const idx = users.findIndex(u => u.email === current.email);
    if (idx === -1) return { ok: false, error: 'Account not found.' };
    users[idx].password = newPassword;
    this.saveUsers(users);
    return { ok: true };
  },

  /* ---------- Orders (demo — no real payment is processed) ---------- */
  ordersKey: 'retro_stitches_orders',
  getOrders() {
    try { return JSON.parse(localStorage.getItem(this.ordersKey)) || []; }
    catch (e) { return []; }
  },
  saveOrder(order) {
    const orders = this.getOrders();
    orders.unshift(order);
    localStorage.setItem(this.ordersKey, JSON.stringify(orders));
  },
  ordersForCurrentUser() {
    const user = this.currentUser();
    const all = this.getOrders();
    if (!user) return all.filter(o => o.customerEmail === 'guest');
    return all.filter(o => o.customerEmail === user.email);
  },

  /* ---------- Saved delivery address (demo — stored in this browser only) ---------- */
  addressKey() {
    const user = this.currentUser();
    return user ? `retro_stitches_address_${user.email}` : 'retro_stitches_address_guest';
  },
  getSavedAddress() {
    try { return JSON.parse(localStorage.getItem(this.addressKey())) || null; }
    catch (e) { return null; }
  },
  saveAddress(addr) {
    localStorage.setItem(this.addressKey(), JSON.stringify(addr));
  },
};

function formatINR(num) {
  return '₹' + Number(num).toLocaleString('en-IN');
}

function starIconSVG() {
  return '<svg class="star-icon" width="12" height="12" viewBox="0 0 24 24" fill="var(--star)" stroke="var(--star)" stroke-width="1"><polygon points="12 2 15.09 8.63 22 9.24 16.5 14.14 18.18 21 12 17.27 5.82 21 7.5 14.14 2 9.24 8.91 8.63"/></svg>';
}

/* ---------- Live order tracking ----------
   Demo only: there's no real courier/logistics API behind this, so the
   timeline is simulated on a compressed clock (minutes, not days) from
   the moment the order is placed, so it can be watched updating live. */
const ORDER_STAGES = [
  { key: 'confirmed', label: 'Order Confirmed', offset: 0, desc: "We've received your order and payment." },
  { key: 'processing', label: 'Processing', offset: 20, desc: 'Your items are being packed at our warehouse.' },
  { key: 'shipped', label: 'Shipped', offset: 75, desc: 'Your package has left the ReTrO StItChEs warehouse.' },
  { key: 'outfordelivery', label: 'Out for Delivery', offset: 150, desc: 'Your package is on the way with the delivery partner.' },
  { key: 'delivered', label: 'Delivered', offset: 240, desc: 'Delivered — enjoy your new gear!' },
];

function getOrderTimeline(order) {
  const orderTime = new Date(order.date).getTime();
  const now = Date.now();
  const elapsedSec = (now - orderTime) / 1000;
  const stages = ORDER_STAGES.map(s => ({ ...s, at: new Date(orderTime + s.offset * 1000).toISOString() }));
  let currentIndex = 0;
  stages.forEach((s, i) => { if (elapsedSec >= s.offset) currentIndex = i; });
  const isFinal = currentIndex === stages.length - 1;
  const segments = stages.length - 1;
  let progressPct;
  if (isFinal) {
    progressPct = 100;
  } else {
    const curOffset = stages[currentIndex].offset;
    const nextOffset = stages[currentIndex + 1].offset;
    const segFrac = Math.min(1, Math.max(0, (elapsedSec - curOffset) / (nextOffset - curOffset)));
    progressPct = ((currentIndex + segFrac) / segments) * 100;
  }
  const secToNext = isFinal ? 0 : Math.max(0, stages[currentIndex + 1].offset - elapsedSec);
  return { stages, currentIndex, currentStage: stages[currentIndex], progressPct, elapsedSec, isFinal, secToNext };
}

function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span class="toast-msg"></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector('.toast-msg').textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2200);
}

function updateHeaderCounts() {
  document.querySelectorAll('.cart-badge').forEach(el => {
    const n = STORE.cartCount();
    el.textContent = n;
    el.style.display = n > 0 ? 'flex' : 'none';
  });
  document.querySelectorAll('.wish-badge').forEach(el => {
    const n = STORE.getWishlist().length;
    el.textContent = n;
    el.style.display = n > 0 ? 'flex' : 'none';
  });
  renderAccountMenu();
}

/* ---------- Product card markup ---------- */
function productCardHTML(p) {
  const wished = STORE.isWishlisted(p.id);
  return `
  <div class="product-card" data-id="${p.id}">
    <a href="product.html?id=${p.id}" class="product-media" style="display:block;">
      <div class="product-tags">
        ${p.isNew ? '<span class="tag tag-new">New</span>' : ''}
        ${p.isBestseller ? '<span class="tag tag-best">Bestseller</span>' : ''}
      </div>
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <button class="wish-btn ${wished ? 'active' : ''}" data-wish="${p.id}" aria-label="Add to wishlist" onclick="event.preventDefault(); handleWishClick('${p.id}', this)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="${wished ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
      </button>
      <div class="quick-add">
        <button onclick="event.preventDefault(); quickAdd('${p.id}')">+ Quick Add</button>
      </div>
    </a>
    <a href="product.html?id=${p.id}" class="product-info" style="display:block;">
      <div class="product-collection">${p.collection}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-price-row">
        <span class="price-now">${formatINR(p.price)}</span>
        <span class="price-mrp">${formatINR(p.mrp)}</span>
        <span class="price-off">${p.discountPct}% OFF</span>
      </div>
      <span class="product-rating">${starIconSVG()} ${p.rating} <span style="color:var(--text-faint); font-weight:600;">(${p.reviews})</span></span>
    </a>
  </div>`;
}

function handleWishClick(id, btnEl) {
  const active = STORE.toggleWishlist(id);
  btnEl.classList.toggle('active', active);
  const svg = btnEl.querySelector('svg');
  svg.setAttribute('fill', active ? 'currentColor' : 'none');
  showToast(active ? 'Added to wishlist' : 'Removed from wishlist');
}

function quickAdd(id) {
  const p = getProductById(id);
  STORE.addToCart(id, p.sizes[Math.floor(p.sizes.length / 2)], 1);
  showToast(`${p.name} added to bag`);
}

/* ---------- Header / Footer injection ---------- */
function renderHeader(activePage) {
  const el = document.getElementById('site-header');
  if (!el) return;
  el.innerHTML = `
  <div class="topbar"><strong>Flat 50-80% OFF</strong> on Fall Essentials — Free shipping over ₹999</div>
  <header class="site-header">
    <div class="container header-inner">
      <button class="mobile-toggle" onclick="toggleDrawer(true)" aria-label="Menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
      <a href="index.html" class="logo">ReTrO StItChEs<span>.</span></a>
      <nav class="main-nav">
        <a href="catalog.html?cat=shirts" class="${activePage === 'shirts' ? 'active' : ''}">Shirts</a>
        <a href="catalog.html?cat=trousers" class="${activePage === 'trousers' ? 'active' : ''}">Trousers</a>
        <a href="catalog.html?sort=discount" class="${activePage === 'sale' ? 'active' : ''}" style="color:var(--accent)">Sale</a>
      </nav>
      <form class="search-box" onsubmit="event.preventDefault(); doSearch(this.q.value);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
        <input name="q" type="text" placeholder="Search for shirts and trousers...">
      </form>
      <div class="header-actions">
        <div class="account-menu" id="account-menu"></div>
        <a href="wishlist.html" class="icon-link">
          <span style="position:relative;">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
            <span class="badge wish-badge" style="display:none;">0</span>
          </span>
          Wishlist
        </a>
        <a href="cart.html" class="icon-link">
          <span style="position:relative;">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span class="badge cart-badge" style="display:none;">0</span>
          </span>
          Bag
        </a>
      </div>
    </div>
  </header>
  <div class="drawer-overlay" id="drawer-overlay" onclick="toggleDrawer(false)"></div>
  <div class="mobile-drawer" id="mobile-drawer">
    <button class="drawer-close btn btn-outline-dark btn-sm" onclick="toggleDrawer(false)">Close <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
    <a href="index.html">Home</a>
    <a href="catalog.html?cat=shirts">Shirts</a>
    <a href="catalog.html?cat=trousers">Trousers</a>
    <a href="catalog.html?sort=discount" style="color:var(--accent)">Sale</a>
    <a href="profile.html">My Profile</a>
    <a href="orders.html">My Orders</a>
    <a href="login.html" id="drawer-account-link">Login</a>
  </div>`;
  updateHeaderCounts();
}

function renderAccountMenu() {
  const el = document.getElementById('account-menu');
  const drawerLink = document.getElementById('drawer-account-link');
  if (!el) return;
  const user = STORE.currentUser();
  if (user) {
    const firstName = user.name.split(' ')[0];
    el.innerHTML = `
      <div class="account-dropdown">
        <button class="icon-link account-trigger" onclick="toggleAccountDropdown(event)">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Hi, ${firstName}
        </button>
        <div class="account-dropdown-menu" id="account-dropdown-menu">
          <a href="profile.html">My Profile</a>
          <a href="orders.html">My Orders</a>
          <a href="#" onclick="event.preventDefault(); handleLogout();">Logout</a>
        </div>
      </div>`;
    if (drawerLink) { drawerLink.textContent = 'Logout'; drawerLink.href = '#'; drawerLink.onclick = (e) => { e.preventDefault(); handleLogout(); }; }
  } else {
    el.innerHTML = `
      <a href="login.html" class="icon-link">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        Login
      </a>`;
    if (drawerLink) { drawerLink.textContent = 'Login'; drawerLink.href = 'login.html'; drawerLink.onclick = null; }
  }
}

function toggleAccountDropdown(e) {
  e.stopPropagation();
  const menu = document.getElementById('account-dropdown-menu');
  if (menu) menu.classList.toggle('open');
}

document.addEventListener('click', () => {
  const menu = document.getElementById('account-dropdown-menu');
  if (menu) menu.classList.remove('open');
});

function handleLogout() {
  STORE.logout();
  showToast('Logged out');
  renderAccountMenu();
  if (window.location.pathname.endsWith('orders.html')) {
    window.location.href = 'index.html';
  }
}

function toggleDrawer(open) {
  document.getElementById('mobile-drawer').classList.toggle('open', open);
  document.getElementById('drawer-overlay').classList.toggle('open', open);
}

function doSearch(q) {
  if (!q.trim()) return;
  window.location.href = 'catalog.html?q=' + encodeURIComponent(q.trim());
}

function renderFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="logo">ReTrO StItChEs<span>.</span></div>
          <p>Our own in-house menswear label — clean fits, honest prices, and drops that keep up with your week.</p>
          <div class="footer-social">
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg></a>
            <a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="X"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg></a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
          </div>
        </div>
        <div class="footer-col">
          <h5>Shop</h5>
          <ul>
            <li><a href="catalog.html?cat=shirts">Shirts</a></li>
            <li><a href="catalog.html?cat=trousers">Trousers</a></li>
            <li><a href="catalog.html?sort=discount">Sale</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Help</h5>
          <ul>
            <li><a href="#">Track Order</a></li>
            <li><a href="#">Shipping & Returns</a></li>
            <li><a href="#">Size Guide</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Company</h5>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Sustainability</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Legal</h5>
          <ul>
            <li><a href="#">Terms of Use</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Refund Policy</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 ReTrO StItChEs — Demo catalog for educational purposes.</span>
        <div class="payment-icons">
          <span>VISA</span><span>Mastercard</span><span>UPI</span><span>COD</span>
        </div>
      </div>
    </div>
  </footer>`;
}

document.addEventListener('DOMContentLoaded', () => {
  updateHeaderCounts();
  initGlassHeaderOnScroll();
  initSmoothPageTransitions();
});

/* ---------- Glass header: stronger blur/shadow once the page is scrolled ----------
   The header markup is injected by each page's own script (after this file's
   DOMContentLoaded already ran), so the header element is looked up fresh on
   every scroll rather than cached once. */
function initGlassHeaderOnScroll() {
  const onScroll = () => {
    const header = document.querySelector('.site-header');
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Smooth fade transition between pages ----------
   Intercepts plain internal navigation links (same-origin .html pages)
   and fades the page out before navigating, so moving around the site
   feels continuous rather than an abrupt hard cut. Anything that manages
   its own click behavior (buttons, elements with an inline onclick, hash
   links, external links, new-tab links) is left completely alone. */
function initSmoothPageTransitions() {
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target.closest('a[href]');
    if (!link) return;

    // Don't touch anything between the actual click target and the link
    // that manages its own behavior (e.g. the wishlist heart button).
    let el = e.target;
    while (el && el !== link) {
      if (el.hasAttribute && el.hasAttribute('onclick')) return;
      el = el.parentElement;
    }
    if (link.hasAttribute('onclick') || link.target === '_blank') return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    e.preventDefault();
    document.body.classList.add('page-leaving');
    setTimeout(() => { window.location.href = href; }, 190);
  });
}
