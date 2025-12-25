// ============================================
// ALEGRIA PARIS - Jewelry Creator
// ============================================

class JewelryCreator {
  constructor() {
    this.currentMainSlide = 0;
    this.totalMainSlides = 5;
    this.selections = {
      matiere: null,
      couleur: null,
      taille: null,
      serti: null,
      diamant: null
    };
    
    this.optionCarousels = {
      matiere: { currentIndex: 0, totalItems: 2 },
      couleur: { currentIndex: 0, totalItems: 3 },
      taille: { currentIndex: 0, totalItems: 8 },
      serti: { currentIndex: 0, totalItems: 2 },
      diamant: { currentIndex: 0, totalItems: 3 }
    };

    this.init();
  }

  init() {
    this.setupMainCarousel();
    this.setupOptionsCarousels();
    this.setupOptionSelection();
    this.setupSubmitButton();
    this.updateProgressBar();
    this.createStarsAnimation();
    this.initializeOptionsDisplay();
  }

  // Initialize options to show only one at a time
  initializeOptionsDisplay() {
    const allTracks = document.querySelectorAll('.options-carousel__track');
    
    allTracks.forEach(track => {
      const cards = track.querySelectorAll('.option-card');
      
      // For regular carousels, position them side by side but show only one
      cards.forEach((card, index) => {
        card.style.minWidth = '100%';
        card.style.flexShrink = '0';
      });
    });
  }

  // ============================================
  // Stars Animation
  // ============================================
  createStarsAnimation() {
    const starsContainer = document.querySelector('.create-hero__stars');
    if (!starsContainer) return;

    for (let i = 0; i < 30; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.cssText = `
        position: absolute;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        background: white;
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.7 + 0.3};
        animation: twinkle ${Math.random() * 3 + 2}s infinite;
      `;
      starsContainer.appendChild(star);
    }

    // Add twinkle animation if not already present
    if (!document.querySelector('#twinkle-animation')) {
      const style = document.createElement('style');
      style.id = 'twinkle-animation';
      style.textContent = `
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ============================================
  // Main Carousel Navigation
  // ============================================
  setupMainCarousel() {
    const prevBtn = document.getElementById('mainPrevBtn');
    const nextBtn = document.getElementById('mainNextBtn');

    prevBtn.addEventListener('click', () => this.navigateMain(-1));
    nextBtn.addEventListener('click', () => this.navigateMain(1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.navigateMain(-1);
      if (e.key === 'ArrowRight') this.navigateMain(1);
    });

    this.updateMainCarousel();
  }

  navigateMain(direction) {
    const newSlide = this.currentMainSlide + direction;
    
    if (newSlide < 0 || newSlide >= this.totalMainSlides) return;
    
    this.currentMainSlide = newSlide;
    this.updateMainCarousel();
    this.updateProgressBar();
    this.updateProgressSteps();
  }

  updateMainCarousel() {
    const track = document.getElementById('mainTrack');
    const slides = document.querySelectorAll('.creator-carousel__slide');
    const prevBtn = document.getElementById('mainPrevBtn');
    const nextBtn = document.getElementById('mainNextBtn');

    // Update track position
    track.style.transform = `translateX(-${this.currentMainSlide * 100}%)`;

    // Update slides active state
    slides.forEach((slide, index) => {
      if (index === this.currentMainSlide) {
        slide.classList.add('creator-carousel__slide--active');
      } else {
        slide.classList.remove('creator-carousel__slide--active');
      }
    });

    // Update navigation buttons
    prevBtn.disabled = this.currentMainSlide === 0;
    nextBtn.disabled = this.currentMainSlide === this.totalMainSlides - 1;
  }

  updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const percentage = ((this.currentMainSlide + 1) / this.totalMainSlides) * 100;
    progressBar.style.width = `${percentage}%`;
  }

  updateProgressSteps() {
    const steps = document.querySelectorAll('.creator-progress__step');
    steps.forEach((step, index) => {
      if (index === this.currentMainSlide) {
        step.classList.add('creator-progress__step--active');
      } else {
        step.classList.remove('creator-progress__step--active');
      }
    });
  }

  // ============================================
  // Options Carousel Navigation
  // ============================================
  setupOptionsCarousels() {
    const navButtons = document.querySelectorAll('.options-carousel__nav');

    navButtons.forEach(button => {
      button.addEventListener('click', () => {
        const carouselType = button.getAttribute('data-carousel');
        const direction = button.classList.contains('options-carousel__nav--next') ? 1 : -1;
        this.navigateOptions(carouselType, direction);
      });
    });
  }

  navigateOptions(type, direction) {
    const carousel = this.optionCarousels[type];
    const track = document.querySelector(`.options-carousel__track[data-carousel="${type}"]`);
    
    if (!track) return;

    const newIndex = carousel.currentIndex + direction;
    
    if (newIndex < 0 || newIndex >= carousel.totalItems) return;

    carousel.currentIndex = newIndex;

    // Show one card at a time centered
    track.style.transform = `translateX(-${newIndex * 100}%)`;
  }

  // ============================================
  // Option Selection
  // ============================================
  setupOptionSelection() {
    const optionCards = document.querySelectorAll('.option-card');

    optionCards.forEach(card => {
      card.addEventListener('click', () => {
        const slide = card.closest('.creator-carousel__slide');
        const type = slide.getAttribute('data-type');
        const value = card.getAttribute('data-value');

        this.selectOption(type, value, card);
      });
    });
  }

  selectOption(type, value, card) {
    // Remove active class from all cards in this type
    const slide = card.closest('.creator-carousel__slide');
    const allCards = slide.querySelectorAll('.option-card');
    allCards.forEach(c => c.classList.remove('option-card--active'));

    // Add active class to selected card
    card.classList.add('option-card--active');

    // Save selection
    this.selections[type] = value;

    // Update summary
    this.updateSummary(type, value);

    // Check if all selections are made
    this.checkCompletion();
  }

  updateSummary(type, value) {
    const summaryValue = document.querySelector(`.creator-summary__value[data-type="${type}"]`);
    if (summaryValue) {
      // Format the value for display
      const displayValue = this.formatDisplayValue(type, value);
      summaryValue.textContent = displayValue;
      
      // Add animation
      summaryValue.style.animation = 'none';
      setTimeout(() => {
        summaryValue.style.animation = 'pulse 0.5s ease';
      }, 10);
    }
  }

  formatDisplayValue(type, value) {
    // Convert kebab-case to readable format
    const formatted = value
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Special formatting for specific types
    if (type === 'matiere') {
      return `Or ${formatted}`;
    }
    if (type === 'couleur') {
      return formatted;
    }
    if (type === 'taille') {
      return `Taille ${value}`;
    }
    if (type === 'serti') {
      return value === 'oui' ? 'Avec serti' : 'Sans serti';
    }
    if (type === 'diamant') {
      return `Diamant ${formatted}`;
    }

    return formatted;
  }

  checkCompletion() {
    const allSelected = Object.values(this.selections).every(value => value !== null);
    const submitBtn = document.getElementById('submitCreation');
    
    if (allSelected) {
      submitBtn.disabled = false;
      submitBtn.style.animation = 'pulse 1s ease infinite';
    } else {
      submitBtn.disabled = true;
      submitBtn.style.animation = 'none';
    }
  }

  // ============================================
  // Submit Button
  // ============================================
  setupSubmitButton() {
    const submitBtn = document.getElementById('submitCreation');
    
    submitBtn.addEventListener('click', () => {
      this.submitCreation();
    });
  }

  submitCreation() {
    // Build query parameters
    const params = new URLSearchParams();
    
    Object.entries(this.selections).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    // Redirect to confirmation page with selections
    const confirmationUrl = `https://youtube.com?${params.toString()}`;
    
    // Show loading state
    const submitBtn = document.getElementById('submitCreation');
    submitBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"/>
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="4"/>
      </svg>
      Création en cours...
    `;

    // Add spin animation
    if (!document.querySelector('#spin-animation')) {
      const style = document.createElement('style');
      style.id = 'spin-animation';
      style.textContent = `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `;
      document.head.appendChild(style);
    }

    // Simulate loading and redirect
    setTimeout(() => {
      window.location.href = confirmationUrl;
    }, 1000);
  }
}

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on the create page
  if (document.querySelector('.jewelry-creator')) {
    new JewelryCreator();
  }
});
