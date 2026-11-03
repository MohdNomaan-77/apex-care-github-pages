(() => {
  const root = document.querySelector('#shop-root'); if (!root) return;
  const grid = document.querySelector('#shop-grid');
  const count = document.querySelector('#results-count');
  const search = document.querySelector('#shop-search');
  const category = document.querySelector('#category-filter');
  const size = document.querySelector('#size-filter');
  const sort = document.querySelector('#sort-filter');
  const maxPrice = document.querySelector('#max-price');
  const maxLabel = document.querySelector('#max-price-label');
  const params = new URLSearchParams(location.search);
  const wishlistOnly = location.hash === '#wishlist';
  if (wishlistOnly) {
    document.querySelector('.shop-toolbar h2').textContent = 'Your wishlist';
    document.querySelector('.shop-toolbar .eyebrow').textContent = 'SAVED FOR LATER';
  }
  if (params.has('category')) category.value = params.get('category');
  if (params.has('q')) search.value = params.get('q');
  if (params.get('new') === 'true') document.querySelector('#new-only').checked = true;

  function applyFilters() {
    const q = search.value.trim().toLowerCase(); const cat = category.value; const chosenSize = size.value;
    let list = Store.products.filter(p => {
      const matchesText = !q || `${p.name} ${p.category} ${p.audience} ${p.description}`.toLowerCase().includes(q);
      const matchesCategory = !cat || p.category === cat || p.audience === cat || (cat === 'Kids' && p.audience === 'Kids');
      const matchesSize = !chosenSize || p.sizes.includes(chosenSize);
      const matchesPrice = p.price <= Number(maxPrice.value);
      const matchesNew = !document.querySelector('#new-only').checked || p.isNew;
      const matchesWishlist = !wishlistOnly || Store.read(Store.WISH_KEY, []).includes(p.id);
      return matchesText && matchesCategory && matchesSize && matchesPrice && matchesNew && matchesWishlist;
    });
    if (sort.value === 'price-low') list.sort((a,b) => a.price-b.price);
    if (sort.value === 'price-high') list.sort((a,b) => b.price-a.price);
    if (sort.value === 'newest') list.sort((a,b) => Number(b.isNew)-Number(a.isNew));
    Store.renderProducts(grid, list); count.textContent = `${list.length} ${list.length === 1 ? 'piece' : 'pieces'} found`;
    document.querySelector('#no-results').hidden = list.length > 0;
    maxLabel.textContent = Store.money(Number(maxPrice.value));
  }
  [search,category,size,sort,maxPrice,document.querySelector('#new-only')].forEach(el => el.addEventListener('input', applyFilters));
  document.querySelector('#clear-filters').addEventListener('click', () => { search.value='';category.value='';size.value='';sort.value='featured';maxPrice.value='3000';document.querySelector('#new-only').checked=false;applyFilters(); });
  document.addEventListener('click', event => { if (event.target.closest('[data-wishlist]')) setTimeout(applyFilters, 0); });
  applyFilters();
})();
