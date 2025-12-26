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

    // Mobile menu toggle with outside-click and Escape handling
    if (toggle && menu) {
      const menuLinks = menu.querySelectorAll('a');

      const handleOutsideClick = (e) => {
        if (!menu.contains(e.target) && e.target !== toggle) {
          closeMenu();
        }
      };

      const handleKeydown = (e) => {
        if (e.key === 'Escape') closeMenu();
      };

      function openMenu() {
        menu.classList.add('is-open');
        toggle.classList.add('is-active');
        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('keydown', handleKeydown);
        document.body.classList.add('nav-open');
      }

      function closeMenu() {
        menu.classList.remove('is-open');
        toggle.classList.remove('is-active');
        document.removeEventListener('click', handleOutsideClick);
        document.removeEventListener('keydown', handleKeydown);
        document.body.classList.remove('nav-open');
      }

      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (menu.classList.contains('is-open')) closeMenu(); else openMenu();
      });

      // Prevent clicks inside menu from closing it via document listener
      menu.addEventListener('click', (e) => e.stopPropagation());

      // Close menu on link click (also works for anchor links)
      menuLinks.forEach(link => {
        link.addEventListener('click', () => closeMenu());
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