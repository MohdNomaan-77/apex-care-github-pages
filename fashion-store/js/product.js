(() => {
  const root = document.querySelector('#product-root'); if (!root) return;
  const id = new URLSearchParams(location.search).get('id');
  const p = Store.products.find(item => item.id === id) || Store.products[0];
  const discount = p.oldPrice ? Math.round((1-p.price/p.oldPrice)*100) : 0;
  root.innerHTML = `<div class="product-detail-image"><img src="${p.image}" alt="${p.name}" onerror="this.style.display='none'"><span class="product-badge">${p.badge || 'APEX CARE'}</span></div>
    <div class="product-detail-copy"><p class="eyebrow">${p.audience} / ${p.category}</p><h1>${p.name}</h1><div class="detail-price"><strong>${Store.money(p.price)}</strong>${p.oldPrice ? `<del>${Store.money(p.oldPrice)}</del><span class="saving">${discount}% OFF</span>` : ''}</div><p class="detail-description">${p.description}</p>
    <div class="detail-option"><span class="field-label">Colour</span><div class="color-options">${p.colors.map((c,i) => `<label class="color-option"><input type="radio" name="color" value="${c}" ${i===0?'checked':''}><span>${c}</span></label>`).join('')}</div></div>
    <div class="detail-option"><label class="field-label" for="detail-size">Select size</label><select id="detail-size">${p.sizes.map(s => `<option>${s}</option>`).join('')}</select><p class="size-note">Please check the size before adding this piece to your bag.</p></div>
    <div class="detail-actions"><button id="detail-add" class="button button-dark" type="button">Add to bag — ${Store.money(p.price)}</button><button class="wishlist-detail" type="button" data-wishlist="${p.id}">♡ Save</button></div>
    <div class="product-accordion"><details open><summary>Product details</summary><p>${p.description} Designed to mix easily with the rest of your wardrobe.</p></details><details><summary>Delivery & returns</summary><p>This is a front-end demo store. No physical order is placed and no delivery or return service is connected.</p></details></div></div>`;
  document.title = `${p.name} | APEX CARE`;
  document.querySelector('#detail-add').addEventListener('click', () => {
    const color = document.querySelector('input[name="color"]:checked')?.value;
    Store.addToCart(p.id, document.querySelector('#detail-size').value, color);
  });
  const related = Store.products.filter(item => item.id !== p.id && (item.category === p.category || item.audience === p.audience)).slice(0,4);
  Store.renderProducts(document.querySelector('#related-products'), related.length ? related : Store.products.filter(item => item.id !== p.id).slice(0,4));
})();
