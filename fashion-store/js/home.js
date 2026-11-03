(() => {
  if (!window.Store) return;
  const newest = Store.products.filter(p => p.isNew).slice(0,4);
  const best = Store.products.filter(p => p.badge === 'Bestseller' || p.badge === 'Trending').slice(0,4);
  Store.renderProducts(document.querySelector('#new-arrivals-grid'), newest);
  Store.renderProducts(document.querySelector('#bestsellers-grid'), best);
})();
