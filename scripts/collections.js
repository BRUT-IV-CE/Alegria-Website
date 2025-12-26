// Collections & Product rendering extracted from main script
(function(){
  const data = [
    { id: 'p1', title: 'Solitaire Étoile', collection: 'etoiles-eternelles', images: ['/assets/images/agencedaisy_alegria-photos_2025-06-06_1324/ALEGRIA-32.jpg','/assets/images/wetransfer_retouche-photo_2025-08-04_0915/image00005.jpeg'], price: 1200, description: 'Solitaire en or 18k, diamant synthétique 0.6ct.', characteristics: { metal: 'Or 18k', stone: 'Diamant synthétique 0.6ct', finish: 'Poli' } },
    { id: 'p2', title: 'Anneau Galaxie', collection: 'galaxie', images: ['/assets/images/wetransfer_retouche-photo_2025-08-04_0915/image00003.jpeg','/assets/images/wetransfer_retouche-photo_2025-08-04_0915/image00001.jpeg'], price: 980, description: 'Anneau or blanc, pavage de diamants.', characteristics: { metal: 'Or blanc', stone: 'Diamants pavage', finish: 'Brossé' } },
    { id: 'p3', title: 'Alliance Constellation', collection: 'constellation', images: ['/assets/images/wetransfer_retouche-photo_2025-08-04_0915/image00001.jpeg'], price: 760, description: 'Alliance fine assortie, finition polie.', characteristics: { metal: 'Or rose', stone: 'Sans pierre', finish: 'Poli' } },
    { id: 'p4', title: 'Boucle Étoile', collection: 'etoiles-eternelles', images: ['/assets/images/wetransfer_retouche-photo_2025-08-04_0915/image00005.jpeg'], price: 450, description: 'Boucles d’oreilles pendantes, éclat stellaire.', characteristics: { metal: 'Or 14k', stone: 'Diamant synthétique', finish: 'Poli' } }
  ];

  // state for listing
  const STATE = {
    filter: (new URLSearchParams(window.location.search).get('collection')) || 'all',
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

    const img = item.images && item.images[0] ? item.images[0] : item.image;

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

  function renderCollections(filter, append = false){
    const grid = document.getElementById('collectionsGrid');
    if(!grid) return;

    // compute items
    let items = (filter && filter !== 'all') ? data.filter(d => d.collection === filter) : data.slice();
    items = sortItems(items, STATE.sort);

    const paged = paginate(items, STATE.page, STATE.pageSize);

    if(!append) grid.innerHTML = '';
    if(paged.length === 0 && !append){ grid.innerHTML = '<p>Aucun bijou pour cette collection.</p>'; }

    paged.forEach(it => grid.appendChild(createCard(it)));

    // re-run add-to-cart binding for newly created buttons
    if (window.setupAddToCart) window.setupAddToCart();

    // update filter buttons active state
    document.querySelectorAll('[data-filter]').forEach(btn => {
      const f = btn.getAttribute('data-filter');
      if (f === (filter || 'all')) {
        btn.classList.remove('btn--outline');
        btn.classList.add('btn--primary');
      } else {
        btn.classList.remove('btn--primary');
        if (!btn.classList.contains('btn--outline')) btn.classList.add('btn--outline');
      }
    });

    // toggle load more visibility
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

    // bind thumbnail clicks
    document.querySelectorAll('.product-thumbs .thumb').forEach(btn => {
      btn.addEventListener('click', (e)=>{
        const src = btn.getAttribute('data-src');
        const main = document.getElementById('mainProductImage');
        if(main) main.src = src;
      });
    });

    // tabs
    document.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', (e)=>{
      const tab = e.currentTarget.getAttribute('data-tab');
      document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));
      e.currentTarget.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(p=>p.style.display = (p.getAttribute('data-panel')===tab)?'block':'none');
    }));

    // show default tab
    document.querySelectorAll('.tab-panel').forEach(p=>p.style.display = p.getAttribute('data-panel')==='desc' ? 'block' : 'none');

    // recommendations: show up to 4 other products from same collection
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

    // bind cart button
    if (window.setupAddToCart) window.setupAddToCart();
  }

  // Initialize depending on page
  document.addEventListener('DOMContentLoaded', () => {
    const colGrid = document.getElementById('collectionsGrid');
    const productDetail = document.getElementById('productDetail');

    // Setup sort control
    const sortSelect = document.getElementById('sortSelect');
    if(sortSelect){
      sortSelect.value = STATE.sort;
      sortSelect.addEventListener('change', (e)=>{
        STATE.sort = e.target.value;
        STATE.page = 1;
        renderCollections(STATE.filter, false);
      });
    }

    // Load more
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if(loadMoreBtn){
      loadMoreBtn.addEventListener('click', ()=>{
        STATE.page += 1;
        renderCollections(STATE.filter, true);
      });
    }

    if(colGrid){
      renderCollections(STATE.filter, false);

      // Filters
      document.querySelectorAll('[data-filter]').forEach(btn =>{
        btn.addEventListener('click', (e)=>{
          const f = e.currentTarget.getAttribute('data-filter');
          STATE.filter = f;
          STATE.page = 1;
          // update URL without reload
          const url = new URL(window.location);
          if(f === 'all') url.searchParams.delete('collection'); else url.searchParams.set('collection', f);
          history.replaceState({}, '', url);
          renderCollections(STATE.filter, false);
        });
      });
    }

    if(productDetail){
      const id = qs('id');
      renderProduct(id);
    }
  });

  // expose for tests/debug
  window.__ALEGRIA_DATA = data;
})();
