/* ============================================================
   ReTrO StItChEs — customer profile page logic
   Lets a logged-in customer edit their personal info, saved
   delivery address, and password at any time. Demo only — saved
   in this browser via localStorage, no backend involved.
   ============================================================ */

function renderProfile() {
  const user = STORE.currentUser();
  const root = document.getElementById('profile-content');

  if (!user) {
    root.innerHTML = `
      <div class="empty-cart">
        <h3 style="font-size:18px; margin-bottom:8px;">Login to view your profile</h3>
        <p style="color:var(--text-muted); font-size:14px; margin-bottom:20px;">Create an account or log in to manage your details.</p>
        <a href="login.html?next=profile.html" class="btn btn-accent">Login / Sign Up</a>
      </div>`;
    return;
  }

  const addr = STORE.getSavedAddress() || {};

  root.innerHTML = `
    <div class="checkout-panel" style="margin-bottom:20px;">
      <h3 style="margin-bottom:4px;">Personal Information</h3>
      <p class="checkout-hint" style="margin-bottom:18px;">Member since ${new Date(user.joined).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
      <form id="profile-info-form" onsubmit="handleProfileInfoSubmit(event)">
        <label class="auth-label">Full Name
          <input type="text" name="name" required value="${user.name}">
        </label>
        <label class="auth-label">Email
          <input type="email" name="email" required value="${user.email}">
        </label>
        <label class="auth-label">Phone Number
          <input type="tel" name="phone" pattern="[0-9]{10}" placeholder="10-digit mobile number" value="${user.phone || ''}">
        </label>
        <div class="auth-error" id="profile-info-error"></div>
        <div class="profile-saved-msg" id="profile-info-saved">Saved!</div>
        <button type="submit" class="btn btn-accent">Save Changes</button>
      </form>
    </div>

    <div class="checkout-panel" style="margin-bottom:20px;">
      <h3 style="margin-bottom:4px;">Saved Delivery Address</h3>
      <p class="checkout-hint" style="margin-bottom:18px;">Used to pre-fill checkout — you can still edit it at checkout any time.</p>
      <form id="profile-address-form" onsubmit="handleProfileAddressSubmit(event)">
        <label class="auth-label">Full Name
          <input type="text" name="name" value="${addr.name || ''}">
        </label>
        <label class="auth-label">Phone Number
          <input type="tel" name="phone" pattern="[0-9]{10}" placeholder="10-digit mobile number" value="${addr.phone || ''}">
        </label>
        <label class="auth-label">Address Line
          <input type="text" name="line" placeholder="House no., street, area" value="${addr.line || ''}">
        </label>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
          <label class="auth-label">City
            <input type="text" name="city" value="${addr.city || ''}">
          </label>
          <label class="auth-label">State
            <input type="text" name="state" value="${addr.state || ''}">
          </label>
        </div>
        <label class="auth-label">Pincode
          <input type="text" name="pincode" pattern="[0-9]{6}" placeholder="6-digit pincode" value="${addr.pincode || ''}">
        </label>
        <div class="profile-saved-msg" id="profile-address-saved">Saved!</div>
        <button type="submit" class="btn btn-accent">Save Address</button>
      </form>
    </div>

    <div class="checkout-panel">
      <h3 style="margin-bottom:18px;">Change Password</h3>
      <form id="profile-password-form" onsubmit="handleProfilePasswordSubmit(event)">
        <label class="auth-label">Current Password
          <input type="password" name="currentPassword" required>
        </label>
        <label class="auth-label">New Password
          <input type="password" name="newPassword" required minlength="4">
        </label>
        <div class="auth-error" id="profile-password-error"></div>
        <div class="profile-saved-msg" id="profile-password-saved">Password updated!</div>
        <button type="submit" class="btn btn-outline-dark">Update Password</button>
      </form>
    </div>`;
}

function showSavedMsg(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2200);
}

function handleProfileInfoSubmit(evt) {
  evt.preventDefault();
  const f = evt.target;
  const result = STORE.updateProfile({ name: f.name.value, email: f.email.value, phone: f.phone.value });
  const errEl = document.getElementById('profile-info-error');
  if (!result.ok) {
    errEl.textContent = result.error;
    return;
  }
  errEl.textContent = '';
  showSavedMsg('profile-info-saved');
  showToast('Profile updated');
  renderHeader(''); // refresh "Hi, <name>" if name/email changed
}

function handleProfileAddressSubmit(evt) {
  evt.preventDefault();
  const f = evt.target;
  STORE.saveAddress({
    name: f.name.value.trim(), phone: f.phone.value.trim(), line: f.line.value.trim(),
    city: f.city.value.trim(), state: f.state.value.trim(), pincode: f.pincode.value.trim(),
  });
  showSavedMsg('profile-address-saved');
  showToast('Address saved');
}

function handleProfilePasswordSubmit(evt) {
  evt.preventDefault();
  const f = evt.target;
  const result = STORE.changePassword(f.currentPassword.value, f.newPassword.value);
  const errEl = document.getElementById('profile-password-error');
  if (!result.ok) {
    errEl.textContent = result.error;
    return;
  }
  errEl.textContent = '';
  f.reset();
  showSavedMsg('profile-password-saved');
  showToast('Password updated');
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader('');
  renderFooter();
  renderProfile();
});
