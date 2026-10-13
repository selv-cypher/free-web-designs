# ReTrO StItChEs — Men's Fashion E-Commerce Site

A full frontend for a single-brand men's clothing store: catalog, filtering/search,
product detail with color/size selection and custom text/logo personalization,
cart, wishlist, login/signup, checkout (UPI / Net Banking / COD), live order
tracking, order history, and an editable customer profile.

**Important: this is frontend-only.** There is no backend, no database, and no
real payment gateway. Everything (products, accounts, cart, orders, addresses)
is either hardcoded dummy data or stored in the browser's `localStorage`. That's
exactly what this handoff is for — wiring it up to a real backend.

## Running it locally

No build step. Just serve the folder statically, e.g.:

```
python3 -m http.server 8000
# or
npx serve .
```

Then open `http://localhost:8000/welcome.html` (or `index.html` — it will
redirect to `welcome.html` on a fresh visit; see "Entry gate" below).

## File structure

```
index.html         Home page (hero, categories, featured products)
welcome.html        Entry gate: login/signup or skip, shown once per session
login.html          Standalone login/signup page (linked from header)
catalog.html        Product listing with filters, search, sort
product.html         Product detail page (PDP): size/color, personalization, add to bag
cart.html           Shopping bag
checkout.html       Address -> Payment (UPI / Net Banking / COD) -> Confirmation
orders.html         Order history for the logged-in customer
track.html          Live order tracking timeline (simulated courier updates)
profile.html        Editable customer profile (name/email/phone, address, password)
wishlist.html        Saved items

css/style.css       All styling (single stylesheet, CSS custom properties in :root)

js/data.js          PRODUCTS / CATEGORIES / COLLECTIONS — the entire product catalog (dummy data)
js/main.js          Shared STORE object (see below), header/footer rendering, product cards
js/catalog.js       Catalog page filtering/sorting logic
js/product.js       Product detail page logic (color/size/personalization, add to bag)
js/cart.js          Cart page logic
js/checkout.js      Checkout flow + simulated payment (UPI/Net Banking/COD)
js/orders.js        Order history rendering
js/track.js         Live order tracking (client-side timer simulating courier updates)
js/profile.js       Profile editing
js/auth.js          Login/signup page logic (used by login.html)
js/welcome.js        Entry gate logic (used by welcome.html)
js/wishlist.js       Wishlist page logic

images/products/*.jpg   Real product photography (98 files) used for the 12 "Trousers" products.
                        Every other product uses placehold.co placeholder images (see js/data.js).
```

## The one object to know: `STORE` (in `js/main.js`)

Every piece of "backend-shaped" state in this app — cart, wishlist, user
accounts, orders, saved addresses — reads and writes through the `STORE`
object in `js/main.js`. Right now every method is a thin wrapper around
`localStorage`. **This is the integration seam**: replace the body of each
method with a `fetch()`/API call and the rest of the app keeps working
unchanged, because every page calls `STORE.*`, never `localStorage` directly.

Key methods and what they'd become with a real backend:

| STORE method | Currently | Becomes with a backend |
|---|---|---|
| `getCart()` / `saveCart()` / `addToCart()` / `updateQtyAt()` / `removeAt()` | `localStorage` array | `GET/POST /api/cart` (probably keyed by session or user id) |
| `getWishlist()` / `toggleWishlist()` | `localStorage` array of product ids | `GET/POST /api/wishlist` |
| `signup()` / `login()` / `logout()` / `currentUser()` | Plaintext password stored in `localStorage`, "session" = an email string in `localStorage` | Real auth: hashed passwords server-side, a session cookie or JWT. `currentUser()` should become an async call (or read from a token) instead of a synchronous localStorage read — every caller currently assumes it's synchronous, so that's the main refactor. |
| `updateProfile()` / `changePassword()` | Mutates a `users` array in `localStorage` | `PATCH /api/users/me`, `POST /api/users/me/password` |
| `getSavedAddress()` / `saveAddress()` | One address in `localStorage`, keyed by user email | `GET/POST /api/addresses` (ideally supporting multiple saved addresses) |
| `saveOrder()` / `getOrders()` / `ordersForCurrentUser()` | `localStorage` array | `POST /api/orders` (created at checkout), `GET /api/orders?user=...` |
| `getOrderTimeline()` (also in main.js) | Computes a fake status timeline from `order.date` on a compressed ~4-minute clock, purely client-side | Should be replaced with real order status pulled from the backend/courier integration. `track.html`'s polling loop (`js/track.js`, `tickTrack()`) can stay structurally the same — just swap the client-side clock math for a periodic `GET /api/orders/:id/status` call. |
| Product catalog (`PRODUCTS` in `js/data.js`) | Hardcoded array | `GET /api/products` — `js/data.js` should be deleted/replaced with a fetch on page load; every page currently assumes `PRODUCTS`/`CATEGORIES`/`COLLECTIONS` are synchronously available as globals, so this is the other main refactor (either fetch before render, or keep a fast synchronous cache warmed on app start). |

## Payments (`js/checkout.js`)

The UPI and Net Banking flows are **entirely simulated** — there is no payment
gateway integration. `ckPayNow()` just waits ~1.4s and marks the order
"Confirmed". To go live, this is where you'd integrate a real gateway (Razorpay,
Cashfree, PayU, etc.): call their checkout/order-create API, redirect or open
their widget, and only call `ckFinalizeOrder()` after a real payment success
callback/webhook — not optimistically like it does now.

## Known simplifications worth knowing about before integrating

- **Passwords are stored in plaintext** in `localStorage` (`STORE.signup`/`login`).
  Obviously not acceptable with a real backend — do real hashing server-side.
- **No server-side validation anywhere.** Forms only have basic HTML5
  `required`/`pattern` validation.
- **Order tracking timeline is fake** — a client-side timer, not real courier data.
- **Cart/wishlist/orders are per-browser**, not per-account in any secure sense
  (a user "logged in" on two devices won't see the same cart).
- **Custom logo uploads** (`js/product.js`, `handleLogoUpload`) are read via
  `FileReader` into a base64 data URL and stored directly in the cart/order —
  fine for a demo, but you'll want real file upload + storage (S3, etc.) for
  production, since data URLs bloat `localStorage`/payloads fast.
