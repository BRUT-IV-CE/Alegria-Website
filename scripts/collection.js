// scripts/collection.js
// Extrait: collections & product rendering
(function(){
  const data = [
    { id: 'p1', title: 'Solitaire Étoile', collection: 'etoiles-eternelles', type: 'bague', images: ['/assets/images/agencedaisy_alegria-photos_2025-06-06_1324/ALEGRIA-32.jpg','/assets/images/wetransfer_retouche-photo_2025-08-04_0915/image00005.jpeg'], price: 1200, description: 'Solitaire en or 18k, diamant synthétique 0.6ct.', characteristics: { metal: 'Or 18k', stone: 'Diamant synthétique 0.6ct', finish: 'Poli' } },
    { id: 'p2', title: 'Anneau Galaxie', collection: 'galaxie', type: 'bague', images: ['/assets/images/wetransfer_retouche-photo_2025-08-04_0915/image00003.jpeg','/assets/images/wetransfer_retouche-photo_2025-08-04_0915/image00001.jpeg'], price: 980, description: 'Anneau or blanc, pavage de diamants.', characteristics: { metal: 'Or blanc', stone: 'Diamants pavage', finish: 'Brossé' } },
    { id: 'p3', title: 'Alliance Constellation', collection: 'constellation', type: 'bague', images: ['/assets/images/wetransfer_retouche-photo_2025-08-04_0915/image00001.jpeg'], price: 760, description: 'Alliance fine assortie, finition polie.', characteristics: { metal: 'Or rose', stone: 'Sans pierre', finish: 'Poli' } },
    { id: 'p4', title: 'Boucle Étoile', collection: 'etoiles-eternelles', type: 'boucles-oreilles', images: ['/assets/images/wetransfer_retouche-photo_2025-08-04_0915/image00005.jpeg'], price: 450, description: 'Boucles d’oreilles pendantes, éclat stellaire.', characteristics: { metal: 'Or 14k', stone: 'Diamant synthétique', finish: 'Poli' } }
  ];

  const STATE = {
    collectionFilters: (new URLSearchParams(window.location.search).get('collection')) ? new URLSearchParams(window.location.search).get('collection').split(',') : [],
    typeFilters: (new URLSearchParams(window.location.search).get('type')) ? new URLSearchParams(window.location.search).get('type').split(',') : [],
    sort: 'default',
    page: 1,
    pageSize: 8
  };

  function qs(name){
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function formatPrice(n){
    return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
  }

  function createCard(item){
    const article = document.createElement('article');
    article.className = 'product-card collection-card';
    article.setAttribute('data-collection', item.collection);
    if(item.type) article.setAttribute('data-type', item.type);
    const img = item.images && item.images[0] ? item.images[0] : '';
    article.innerHTML = `
      <div class="collection-card__image">
        <img src="${img}" alt="${item.title}" loading="lazy">
        <div class="collection-card__overlay">
          <a href="/pages/product.html?id=${item.id}" class="btn btn--light">Voir détail</a>
        </div>
      </div>
      <div class="collection-card__content">
        <h3 class="collection-card__title">${item.title}</h3>
        <p class="collection-card__description">${formatPrice(item.price)}</p>
      </div>
    `;
    return article;
  }

  function sortItems(items, sort){
    if(!sort || sort === 'default') return items;
    if(sort === 'price-asc') return items.slice().sort((a,b)=>a.price-b.price);
    if(sort === 'price-desc') return items.slice().sort((a,b)=>b.price-a.price);
    return items;
  }

  function paginate(items, page, pageSize){
    const start = (page-1)*pageSize;
    return items.slice(start, start+pageSize);
  }

  function renderSelectedChips(){
    const container = document.getElementById('selectedFilters');
    if(!container) return;
    container.innerHTML = '';
    const createChip = (label, group, value) => {
      const span = document.createElement('span');
      span.className = 'chip inline-flex items-center gap-2 bg-white/10 text-white px-3 py-1 rounded-full text-sm border border-white/10';
      span.setAttribute('data-chip-group', group);
      span.setAttribute('data-chip-value', value);
      const btn = document.createElement('button');
      btn.className = 'chip-remove ml-2 text-white/80 hover:text-white';
      btn.setAttribute('aria-label', `Retirer ${label}`);
      btn.innerHTML = '&times;';
      span.textContent = label;
      span.appendChild(btn);
      return span;
    };
    STATE.typeFilters.forEach(t => {
      const el = document.querySelector(`.filter-option[data-filter-type="${t}"]`);
      const label = el ? el.textContent.trim() : t;
      container.appendChild(createChip(label, 'type', t));
    });
    STATE.collectionFilters.forEach(c => {
      const el = document.querySelector(`.filter-option[data-filter-collection="${c}"]`);
      const label = el ? el.textContent.trim() : c;
      if(c !== 'toutes') container.appendChild(createChip(label, 'collection', c));
    });
  }

  function toggleFilter(group, value){
    if(group === 'type'){
      const idx = STATE.typeFilters.indexOf(value);
      if(idx === -1) STATE.typeFilters.push(value); else STATE.typeFilters.splice(idx,1);
    }
    if(group === 'collection'){
      // 'toutes' clears collection filters
      if(value === 'toutes') { STATE.collectionFilters = []; }
      else {
        const idx = STATE.collectionFilters.indexOf(value);
        if(idx === -1) STATE.collectionFilters.push(value); else STATE.collectionFilters.splice(idx,1);
      }
    }
    // sync URL
    const url = new URL(window.location);
    if(STATE.collectionFilters.length) url.searchParams.set('collection', STATE.collectionFilters.join(',')); else url.searchParams.delete('collection');
    if(STATE.typeFilters.length) url.searchParams.set('type', STATE.typeFilters.join(',')); else url.searchParams.delete('type');
    history.replaceState({}, '', url);
    STATE.page = 1;
    renderSelectedChips();
    renderCollections(false);
  }

  function markFilterOptions(){
    document.querySelectorAll('.filter-option[data-filter-type]').forEach(btn => {
      const v = btn.getAttribute('data-filter-type');
      if(STATE.typeFilters.includes(v)) { btn.classList.add('bg-indigo-600','text-white'); btn.classList.remove('bg-white','text-gray-800'); } else { btn.classList.remove('bg-indigo-600','text-white'); if(!btn.classList.contains('bg-white')) btn.classList.add('bg-white','text-gray-800'); }
    });
    document.querySelectorAll('.filter-option[data-filter-collection]').forEach(btn => {
      const v = btn.getAttribute('data-filter-collection');
      if(v === 'toutes') return; // special
      if(STATE.collectionFilters.includes(v)) { btn.classList.add('bg-indigo-600','text-white'); btn.classList.remove('bg-white','text-gray-800'); } else { btn.classList.remove('bg-indigo-600','text-white'); if(!btn.classList.contains('bg-white')) btn.classList.add('bg-white','text-gray-800'); }
    });
  }

  function renderCollections(append = false){
    const grid = document.getElementById('collectionsGrid');
    if(!grid) return;
    let items = data.slice();
    if(STATE.collectionFilters.length) items = items.filter(d => STATE.collectionFilters.includes(d.collection));
    if(STATE.typeFilters.length) items = items.filter(d => STATE.typeFilters.includes(d.type));
    items = sortItems(items, STATE.sort);
    const paged = paginate(items, STATE.page, STATE.pageSize);
    if(!append) grid.innerHTML = '';
    if(paged.length === 0 && !append){ grid.innerHTML = '<p>Aucun bijou pour cette collection.</p>'; }
    paged.forEach(it => grid.appendChild(createCard(it)));
    if (window.setupAddToCart) window.setupAddToCart();
    markFilterOptions();
    const total = items.length;
    const loaded = STATE.page * STATE.pageSize;
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if(loadMoreBtn) loadMoreBtn.style.display = (loaded < total) ? 'inline-flex' : 'none';
  }

  function renderProduct(id){
    const target = document.getElementById('productDetail');
    if(!target) return;
    const item = data.find(d => d.id === id);
    if(!item){ target.innerHTML = '<p>Produit introuvable.</p>'; return; }
    const imgs = item.images && item.images.length ? item.images : [item.image];
    target.innerHTML = `
      <div class="product-detail">
        <div class="product-detail__media">
          <div class="product-main-image"><img id="mainProductImage" src="${imgs[0]}" alt="${item.title}"></div>
          <div class="product-thumbs">
            ${imgs.map((src, i) => `<button class="thumb" data-src="${src}" aria-label="Voir image ${i+1}"><img src="${src}" alt="thumb"></button>`).join('')}
          </div>
        </div>
        <div class="product-detail__info">
          <h1>${item.title}</h1>
          <p class="muted">Collection: ${item.collection.replace(/-/g,' ')}</p>
          <p class="price">${formatPrice(item.price)}</p>
          <div class="product-actions">
            <a href="mailto:contact@alegria-paris.com?subject=Demande%20${encodeURIComponent(item.title)}" class="btn btn--primary">Demander un devis</a>
            <a href="#" class="btn btn--outline" data-add-to-cart data-product-id="${item.id}">Ajouter au panier</a>
          </div>
          <div class="product-tabs">
            <div class="tabs-nav">
              <button class="tab-btn active" data-tab="desc">Description</button>
              <button class="tab-btn" data-tab="specs">Caractéristiques</button>
              <button class="tab-btn" data-tab="rec">Recommandations</button>
            </div>
            <div class="tabs-content">
              <div class="tab-panel" data-panel="desc">${item.description}</div>
              <div class="tab-panel" data-panel="specs">
                <ul class="specs-list">
                  ${Object.entries(item.characteristics || {}).map(([k,v])=>`<li><strong>${k}:</strong> ${v}</li>`).join('')}
                </ul>
              </div>
              <div class="tab-panel" data-panel="rec">
                <div class="recommendations"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.querySelectorAll('.product-thumbs .thumb').forEach(btn => {
      btn.addEventListener('click', (e)=>{
        const src = btn.getAttribute('data-src');
        const main = document.getElementById('mainProductImage');
        if(main) main.src = src;
      });
    });
    document.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', (e)=>{
      const tab = e.currentTarget.getAttribute('data-tab');
      document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));
      e.currentTarget.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(p=>p.style.display = (p.getAttribute('data-panel')===tab)?'block':'none');
    }));
    document.querySelectorAll('.tab-panel').forEach(p=>p.style.display = p.getAttribute('data-panel')==='desc' ? 'block' : 'none');
    const recContainer = target.querySelector('.recommendations');
    if(recContainer){
      const recs = data.filter(d => d.collection === item.collection && d.id !== item.id).slice(0,4);
      if(recs.length===0) recContainer.innerHTML = '<p>Aucune recommandation.</p>';
      else {
        recContainer.innerHTML = recs.map(r => `
          <div class="rec-card">
            <a href="/pages/product.html?id=${r.id}"><img src="${r.images[0]}" alt="${r.title}"></a>
            <p class="rec-title">${r.title}</p>
            <p class="rec-price">${formatPrice(r.price)}</p>
          </div>
        `).join('');
      }
    }
    if (window.setupAddToCart) window.setupAddToCart();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const colGrid = document.getElementById('collectionsGrid');
    const productDetail = document.getElementById('productDetail');
    // sort dropdown (replaces legacy <select>)
    const sortToggle = document.getElementById('sortToggle');
    const sortMenu = document.querySelector('.sort-dropdown .dropdown__menu');
    const sortLabelMap = { 'default': 'Pertinence', 'price-asc': 'Prix croissant', 'price-desc': 'Prix décroissant' };
    if(sortToggle){
      // set initial label
      sortToggle.textContent = sortLabelMap[STATE.sort] || 'Trier';
      // ensure menu hidden
      if(sortMenu && !sortMenu.classList.contains('hidden')) sortMenu.classList.add('hidden');
      // option clicks
      document.querySelectorAll('.sort-option').forEach(opt => {
        opt.addEventListener('click', (e) => {
          const v = e.currentTarget.getAttribute('data-sort');
          STATE.sort = v;
          STATE.page = 1;
          // update label
          sortToggle.textContent = sortLabelMap[v] || 'Trier';
          // close menu
          if(sortMenu) sortMenu.classList.add('hidden');
          // sync aria
          sortToggle.setAttribute('aria-expanded','false');
          renderCollections(false);
        });
      });
    }
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if(loadMoreBtn){
      loadMoreBtn.addEventListener('click', ()=>{
        STATE.page += 1;
        renderCollections(true);
      });
    }
    if(colGrid){
      // initial render
      renderSelectedChips();
      renderCollections(false);

      // attach dropdown option listeners
      document.querySelectorAll('.filter-option[data-filter-type]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const v = e.currentTarget.getAttribute('data-filter-type');
          toggleFilter('type', v);
        });
      });
      document.querySelectorAll('.filter-option[data-filter-collection]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const v = e.currentTarget.getAttribute('data-filter-collection');
          toggleFilter('collection', v);
        });
      });

      // remove chip handler
      document.getElementById('selectedFilters').addEventListener('click', (e) => {
        const rem = e.target.closest('.chip-remove');
        if(!rem) return;
        const chip = rem.parentNode;
        const group = chip.getAttribute('data-chip-group');
        const value = chip.getAttribute('data-chip-value');
        if(group === 'type') toggleFilter('type', value);
        if(group === 'collection') toggleFilter('collection', value);
      });

      // dropdown toggle behavior (uses Tailwind 'hidden' class)
      document.querySelectorAll('.dropdown').forEach(drop => {
        const toggle = drop.querySelector('.dropdown__toggle');
        const menu = drop.querySelector('.dropdown__menu');
        if(!toggle || !menu) return;
        // ensure menu hidden initially
        if(!menu.classList.contains('hidden')) menu.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.addEventListener('click', (ev) => {
          ev.stopPropagation();
          const isHidden = menu.classList.toggle('hidden');
          toggle.setAttribute('aria-expanded', isHidden ? 'false' : 'true');
        });
      });

      // close dropdowns when clicking outside
      document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown__menu').forEach(m => m.classList.add('hidden'));
        document.querySelectorAll('.dropdown__toggle').forEach(t => t.setAttribute('aria-expanded','false'));
      });
    }
    if(productDetail){
      const id = qs('id');
      renderProduct(id);
    }
  });

  window.__ALEGRIA_DATA = data;
})();
