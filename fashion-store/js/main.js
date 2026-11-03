(() => {
  const CART_KEY = 'apexcare-cart-v1';
  const WISH_KEY = 'apexcare-wishlist-v1';
  const money = value => new Intl.NumberFormat('en-IN', {style:'currency', currency:'INR', maximumFractionDigits:0}).format(value);
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const products = window.STORE_PRODUCTS || [];

  function cartCount() { return read(CART_KEY, []).reduce((sum, item) => sum + item.qty, 0); }
  function updateHeader() {
    document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = cartCount());
    document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
    const current = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('[data-nav]').forEach(link => {
      if (link.getAttribute('href') === current) link.classList.add('is-active');
    });
  }
  function toast(message) {
    let node = document.querySelector('.toast');
    if (!node) { node = document.createElement('div'); node.className = 'toast'; node.setAttribute('role','status'); document.body.appendChild(node); }
    node.textContent = message; node.classList.add('show');
    clearTimeout(window.__toastTimer); window.__toastTimer = setTimeout(() => node.classList.remove('show'), 2400);
  }
  function addToCart(id, size, color) {
    const product = products.find(item => item.id === id);
    if (!product) return;
    const cart = read(CART_KEY, []);
    const chosenSize = size || product.sizes[0];
    const chosenColor = color || product.colors[0];
    const existing = cart.find(item => item.id === id && item.size === chosenSize && item.color === chosenColor);
    if (existing) existing.qty += 1;
    else cart.push({id, size:chosenSize, color:chosenColor, qty:1});
    write(CART_KEY, cart); updateHeader(); toast(`${product.name} added to bag`);
  }
  function toggleWishlist(id) {
    const list = read(WISH_KEY, []);
    const index = list.indexOf(id);
    if (index >= 0) { list.splice(index, 1); toast('Removed from wishlist'); }
    else { list.push(id); toast('Saved to wishlist'); }
    write(WISH_KEY, list); updateWishlistButtons();
  }
  function updateWishlistButtons() {
    const list = read(WISH_KEY, []);
    document.querySelectorAll('[data-wishlist]').forEach(button => {
      const saved = list.includes(button.dataset.wishlist);
      button.classList.toggle('is-saved', saved);
      button.setAttribute('aria-label', saved ? 'Remove from wishlist' : 'Add to wishlist');
      button.textContent = saved ? '♥' : '♡';
    });
    document.querySelectorAll('[data-wishlist-count]').forEach(el => el.textContent = list.length);
  }
  function card(product) {
    const saved = read(WISH_KEY, []).includes(product.id);
    const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
    return `<article class="product-card">
      <div class="product-image-wrap">
        <a class="product-image-link" href="product.html?id=${encodeURIComponent(product.id)}" aria-label="View ${product.name}">
          <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.style.display='none';this.parentElement.classList.add('image-fallback')">
        </a>
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        ${discount ? `<span class="discount-badge">-${discount}%</span>` : ''}
        <button class="wishlist-btn ${saved ? 'is-saved' : ''}" type="button" data-wishlist="${product.id}" aria-label="${saved ? 'Remove from wishlist' : 'Add to wishlist'}">${saved ? '♥' : '♡'}</button>
        <button class="quick-view-btn" type="button" data-quick-view="${product.id}">Quick view</button>
      </div>
      <div class="product-info">
        <div class="product-meta"><span>${product.category}</span><span>${product.audience}</span></div>
        <a class="product-name" href="product.html?id=${encodeURIComponent(product.id)}">${product.name}</a>
        <div class="product-price"><strong>${money(product.price)}</strong>${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ''}</div>
        <button class="text-add-btn" type="button" data-add="${product.id}">Add to bag <span>＋</span></button>
      </div>
    </article>`;
  }
  function renderProducts(target, list) {
    if (!target) return;
    target.innerHTML = list.map(card).join('');
    updateWishlistButtons();
  }
  function openQuickView(id) {
    const p = products.find(item => item.id === id); if (!p) return;
    const modal = document.querySelector('#quick-view-modal'); if (!modal) return;
    modal.innerHTML = `<div class="modal-backdrop" data-close-modal></div><section class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="quick-title">
      <button class="modal-close" type="button" data-close-modal aria-label="Close">×</button>
      <div class="modal-image"><img src="${p.image}" alt="${p.name}" onerror="this.style.display='none'"></div>
      <div class="modal-copy"><p class="eyebrow">${p.category} / ${p.audience}</p><h2 id="quick-title">${p.name}</h2><p class="modal-price">${money(p.price)} ${p.oldPrice ? `<del>${money(p.oldPrice)}</del>` : ''}</p><p>${p.description}</p>
      <label class="field-label" for="quick-size">Select size</label><select id="quick-size">${p.sizes.map(s => `<option>${s}</option>`).join('')}</select>
      <label class="field-label" for="quick-color">Select colour</label><select id="quick-color">${p.colors.map(c => `<option>${c}</option>`).join('')}</select>
      <button class="button button-dark button-full" type="button" data-modal-add="${p.id}">Add to bag</button><a class="underlined-link" href="product.html?id=${encodeURIComponent(p.id)}">View full details</a></div></section>`;
    modal.classList.add('is-open'); document.body.classList.add('modal-open');
  }
  function closeModal() { const modal = document.querySelector('#quick-view-modal'); if (modal) modal.classList.remove('is-open'); document.body.classList.remove('modal-open'); }

  document.addEventListener('click', event => {
    const add = event.target.closest('[data-add]');
    if (add) { addToCart(add.dataset.add); return; }
    const wish = event.target.closest('[data-wishlist]');
    if (wish) { toggleWishlist(wish.dataset.wishlist); return; }
    const quick = event.target.closest('[data-quick-view]');
    if (quick) { openQuickView(quick.dataset.quickView); return; }
    const modalAdd = event.target.closest('[data-modal-add]');
    if (modalAdd) { addToCart(modalAdd.dataset.modalAdd, document.querySelector('#quick-size')?.value, document.querySelector('#quick-color')?.value); closeModal(); return; }
    if (event.target.closest('[data-close-modal]')) closeModal();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

  const menuButton = document.querySelector('.menu-toggle');
  if (menuButton) menuButton.addEventListener('click', () => {
    const nav = document.querySelector('.main-nav'); const open = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open)); menuButton.textContent = open ? '✕' : '☰';
  });
  const newsletter = document.querySelector('[data-newsletter]');
  if (newsletter) newsletter.addEventListener('submit', event => {
    event.preventDefault(); const email = new FormData(newsletter).get('email');
    const list = read('apexcare-newsletter-v1', []); if (!list.includes(email)) list.push(email); write('apexcare-newsletter-v1', list);
    newsletter.reset(); toast('You are on the list — thank you!');
  });

  window.Store = {products, money, read, write, addToCart, toast, renderProducts, updateHeader, updateWishlistButtons, CART_KEY, WISH_KEY};
  document.addEventListener('DOMContentLoaded', () => { updateHeader(); updateWishlistButtons(); });
})();
