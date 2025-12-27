// ============================================
// ALEGRIA PARIS - Main JavaScript
// ============================================

class AlegriaWebsite {
  constructor() {
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupHeroOptimized(); // VERSION OPTIMISÉE
    this.setupGiftingCarousel(); // NOUVEAU CAROUSEL PLEIN ÉCRAN
    this.setupScrollAnimations();
    this.setupForms();
  }

  // ============================================
  // Navigation
  // ============================================
  setupNavigation() {
    const header = document.querySelector('.header');
    const toggle = document.querySelector('.navbar__toggle');
    const menu = document.querySelector('.navbar__menu');

    // Scroll effect avec throttle pour optimisation
    let ticking = false;
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      lastScroll = window.pageYOffset;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (lastScroll > 100) {
            header.classList.add('header--scrolled');
          } else {
            header.classList.remove('header--scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    });

    // Mobile menu toggle
    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        menu.classList.toggle('is-open');
        toggle.classList.toggle('is-active');
      });

      // Close menu on link click
      const menuLinks = menu.querySelectorAll('a');
      menuLinks.forEach(link => {
        link.addEventListener('click', () => {
          menu.classList.remove('is-open');
          toggle.classList.remove('is-active');
        });
      });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const headerHeight = header.offsetHeight;
          const targetPosition = target.offsetTop - headerHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ============================================
  // Hero Section OPTIMISÉ (Fix lag des étoiles)
  // ============================================
  setupHeroOptimized() {
    const starsContainer = document.querySelector('.hero__stars');
    if (!starsContainer) return;

    // Créer moins d'étoiles (50 au lieu de 100) pour de meilleures performances
    this.createOptimizedStars(starsContainer, 50);

    // Animation CSS pure (pas de JS) pour de meilleures performances
    if (!document.querySelector('#optimized-stars-animation')) {
      const style = document.createElement('style');
      style.id = 'optimized-stars-animation';
      style.textContent = `
        .star {
          will-change: opacity;
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  createOptimizedStars(container, count) {
    // Utiliser un fragment pour optimiser les performances DOM
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Optimisation: tailles variées pour plus de profondeur
      const size = Math.random() * 3 + 1;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 3;
      const duration = 2 + Math.random() * 3;
      
      star.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: white;
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        animation: twinkle ${duration}s infinite ${delay}s;
        opacity: ${Math.random() * 0.5 + 0.3};
        box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, 0.8);
      `;
      
      fragment.appendChild(star);
    }
    
    container.appendChild(fragment);
  }

  // ============================================
  // Gifting Full-Width Carousel (NOUVEAU)
  // ============================================
  setupGiftingCarousel() {
    const carousel = document.querySelector('.gifting__carousel');
    if (!carousel) return;

    const slides = Array.from(carousel.querySelectorAll('.gifting__slide'));
    const prevBtn = document.querySelector('.gifting__arrow--prev');
    const nextBtn = document.querySelector('.gifting__arrow--next');
    const dots = document.querySelectorAll('.gifting__dot');
    
    let currentIndex = 0;
    let autoplayInterval;
    let isTransitioning = false;

    // Fonction pour aller à une slide spécifique
    const goToSlide = (index, direction = 'next') => {
      if (isTransitioning) return;
      isTransitioning = true;

      // Retirer la classe active de la slide actuelle
      slides[currentIndex].classList.remove('active');
      
      // Mettre à jour l'index
      currentIndex = index;
      
      // Ajouter l'animation appropriée
      const animationClass = direction === 'next' ? 'slide-in-right' : 'slide-in-left';
      slides[currentIndex].classList.add(animationClass);
      
      // Activer la nouvelle slide
      slides[currentIndex].classList.add('active');
      
      // Retirer la classe d'animation après la transition
      setTimeout(() => {
        slides.forEach(slide => {
          slide.classList.remove('slide-in-right', 'slide-in-left');
        });
        isTransitioning = false;
      }, 800);

      // Mettre à jour les dots
      updateDots();
    };

    // Navigation suivante
    const goNext = () => {
      const nextIndex = (currentIndex + 1) % slides.length;
      goToSlide(nextIndex, 'next');
    };

    // Navigation précédente
    const goPrev = () => {
      const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(prevIndex, 'prev');
    };

    // Mettre à jour les indicateurs
    const updateDots = () => {
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    // Event listeners pour les boutons
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goPrev();
        resetAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goNext();
        resetAutoplay();
      });
    }

    // Event listeners pour les dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        const direction = index > currentIndex ? 'next' : 'prev';
        goToSlide(index, direction);
        resetAutoplay();
      });
    });

    // Support du swipe tactile
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          goNext();
        } else {
          goPrev();
        }
        resetAutoplay();
      }
    };

    // Support clavier
    document.addEventListener('keydown', (e) => {
      if (!isElementInViewport(carousel)) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
        resetAutoplay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
        resetAutoplay();
      }
    });

    // Vérifier si un élément est visible
    function isElementInViewport(el) {
      const rect = el.getBoundingClientRect();
      return (
        rect.top < window.innerHeight &&
        rect.bottom > 0
      );
    }

    // Autoplay
    const startAutoplay = () => {
      autoplayInterval = setInterval(goNext, 5000); // Change toutes les 5 secondes
    };

    const stopAutoplay = () => {
      clearInterval(autoplayInterval);
    };

    const resetAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    // Démarrer l'autoplay
    startAutoplay();

    // Pause au hover (desktop uniquement)
    if (window.innerWidth > 768) {
      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('mouseleave', startAutoplay);
    }

    // Pause quand l'onglet n'est pas visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });
  }

  // ============================================
  // Scroll Animations
  // ============================================
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.collection-card, .gift-card, .commitment-card, .inspiration-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.6s ease';
      observer.observe(el);
    });

    // Add visible class style
    if (!document.querySelector('#scroll-animation-style')) {
      const style = document.createElement('style');
      style.id = 'scroll-animation-style';
      style.textContent = `
        .is-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ============================================
  // Forms
  // ============================================
  setupForms() {
    // Newsletter form
    const newsletterForm = document.querySelector('.footer__newsletter');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        console.log('Newsletter subscription:', email);
        
        // Show success message
        const input = newsletterForm.querySelector('input[type="email"]');
        const originalPlaceholder = input.placeholder;
        input.value = '';
        input.placeholder = 'Merci pour votre inscription ! ✓';
        input.style.color = '#4CAF50';
        
        setTimeout(() => {
          input.placeholder = originalPlaceholder;
          input.style.color = '';
        }, 3000);
      });
    }

    // Contact form
    const contactForm = document.querySelector('.contact__form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        
        // Build email message
        const contactData = {
          nom: formData.get('nom') || formData.get('fullname'),
          email: formData.get('email'),
          sujet: formData.get('sujet') || formData.get('subject'),
          message: formData.get('message')
        };
        
        console.log('Contact form submitted:', contactData);
        
        // Send email
        const subject = `Contact ALEGRIA - ${contactData.sujet}`;
        const body = `
Nom: ${contactData.nom}
Email: ${contactData.email}
Sujet: ${contactData.sujet}

Message:
${contactData.message}
        `;
        
        const mailtoLink = `mailto:contact@alegria-paris.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
        
        // Show success and reset
        alert('Votre message a été envoyé avec succès !');
        contactForm.reset();
      });
    }

    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq__item');
    faqItems.forEach(item => {
      const question = item.querySelector('.faq__question');
      if (question) {
        question.addEventListener('click', () => {
          const isOpen = item.hasAttribute('open');
          
          // Close all other items
          faqItems.forEach(other => {
            if (other !== item) {
              other.removeAttribute('open');
            }
          });
          
          // Toggle current item
          if (!isOpen) {
            item.setAttribute('open', '');
          }
        });
      }
    });
  }
}

// ============================================
// Additional utility functions
// ============================================

// Lazy loading images
function setupLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
}

// Parallax effect for hero
function setupParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const parallaxElements = hero.querySelectorAll('.hero__content, .hero__stars');
        
        parallaxElements.forEach(el => {
          const speed = el.dataset.speed || 0.5;
          el.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        ticking = false;
      });
      ticking = true;
    }
  });
}

// Add to cart functionality (for future e-commerce integration)
function setupAddToCart() {
  const addToCartButtons = document.querySelectorAll('[data-add-to-cart]');
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = button.dataset.productId;
      
      // Animation
      button.textContent = 'Ajouté ! ✓';
      button.style.backgroundColor = '#4CAF50';
      
      setTimeout(() => {
        button.textContent = 'Ajouter au panier';
        button.style.backgroundColor = '';
      }, 2000);
      
      console.log('Product added to cart:', productId);
    });
  });
}

// Initialize everything
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AlegriaWebsite();
    setupLazyLoading();
    setupParallax();
    setupAddToCart();
  });
} else {
  new AlegriaWebsite();
  setupLazyLoading();
  setupParallax();
  setupAddToCart();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AlegriaWebsite;
}

// ============================================
// Collections & Product rendering (merged from collections.js)
// ============================================
// Collections & Product rendering (merged from collections.js)
(function(){
  const data = [
    { id: 'p1', title: 'Solitaire Étoile', collection: 'etoiles-eternelles', images: ['image/agencedaisy_alegria-photos_2025-06-06_1324/ALEGRIA-32.jpg','image/wetransfer_retouche-photo_2025-08-04_0915/image00005.jpeg'], price: 1200, description: 'Solitaire en or 18k, diamant synthétique 0.6ct.', characteristics: { metal: 'Or 18k', stone: 'Diamant synthétique 0.6ct', finish: 'Poli' } },
    { id: 'p2', title: 'Anneau Galaxie', collection: 'galaxie', images: ['image/wetransfer_retouche-photo_2025-08-04_0915/image00003.jpeg','image/wetransfer_retouche-photo_2025-08-04_0915/image00001.jpeg'], price: 980, description: 'Anneau or blanc, pavage de diamants.', characteristics: { metal: 'Or blanc', stone: 'Diamants pavage', finish: 'Brossé' } },
    { id: 'p3', title: 'Alliance Constellation', collection: 'constellation', images: ['image/wetransfer_retouche-photo_2025-08-04_0915/image00001.jpeg'], price: 760, description: 'Alliance fine assortie, finition polie.', characteristics: { metal: 'Or rose', stone: 'Sans pierre', finish: 'Poli' } },
    { id: 'p4', title: 'Boucle Étoile', collection: 'etoiles-eternelles', images: ['image/wetransfer_retouche-photo_2025-08-04_0915/image00005.jpeg'], price: 450, description: 'Boucles d’oreilles pendantes, éclat stellaire.', characteristics: { metal: 'Or 14k', stone: 'Diamant synthétique', finish: 'Poli' } }
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
          <a href="product.html?id=${item.id}" class="btn btn--light">Voir détail</a>
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
    setupAddToCart();

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
            <a href="product.html?id=${r.id}"><img src="${r.images[0]}" alt="${r.title}"></a>
            <p class="rec-title">${r.title}</p>
            <p class="rec-price">${formatPrice(r.price)}</p>
          </div>
        `).join('');
      }
    }

    // bind cart button
    setupAddToCart();
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
