/**
 * SoireeWeb — Animations & Interactive Components
 * Scroll Animations, Counters, Carousel, FAQ Accordion
 * Wedding Coordination & Event Planning — Philippines
 */

'use strict';

/* ============================================================
   1. DOM Ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initCounterAnimation();
  initTestimonialCarousel();
  initFAQAccordion();
  initFAQSearch();
  initContactForm();
  initParallax();
});

/* ============================================================
   2. Scroll-Triggered Animations (IntersectionObserver)
   ============================================================ */
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: show all elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   3. Animated Counters
   ============================================================ */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  if (!('IntersectionObserver' in window)) {
    counters.forEach(el => {
      el.textContent = el.dataset.target + (el.dataset.suffix || '');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => {
    el.textContent = '0' + (el.dataset.suffix || '');
    observer.observe(el);
  });
}

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10) || 0;
  const suffix   = el.dataset.suffix || '';
  const prefix   = el.dataset.prefix || '';
  const duration = parseInt(el.dataset.duration, 10) || 2000;
  const start    = performance.now();

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function update(currentTime) {
    const elapsed  = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = easeOutQuart(progress);
    const current  = Math.round(eased * target);

    el.textContent = prefix + current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = prefix + target.toLocaleString() + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* ============================================================
   4. Testimonials Carousel
   ============================================================ */
let carouselState = {
  current:    0,
  total:      0,
  autoplay:   null,
  itemsVisible: 1,
  isAnimating: false,
};

function initTestimonialCarousel() {
  const track  = document.querySelector('.testimonials-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn  = document.querySelector('.carousel-btn.prev');
  const nextBtn  = document.querySelector('.carousel-btn.next');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (!track || !slides.length) return;

  carouselState.total = slides.length;

  // Determine visible items based on viewport
  function getVisibleItems() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  carouselState.itemsVisible = getVisibleItems();

  // Create dots
  if (dotsContainer) {
    const totalDots = Math.ceil(carouselState.total / carouselState.itemsVisible);
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i * carouselState.itemsVisible));
      dotsContainer.appendChild(dot);
    }
  }

  // Navigation buttons
  prevBtn && prevBtn.addEventListener('click', () => {
    if (carouselState.isAnimating) return;
    showCarouselPrev();
    resetAutoplay();
  });

  nextBtn && nextBtn.addEventListener('click', () => {
    if (carouselState.isAnimating) return;
    showCarouselNext();
    resetAutoplay();
  });

  // Auto-play
  startAutoplay();

  // Pause on hover
  const carousel = document.querySelector('.testimonials-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin',    stopAutoplay);
    carousel.addEventListener('focusout',   startAutoplay);
  }

  // Touch/Swipe
  let touchStart = 0;
  if (track) {
    track.addEventListener('touchstart', e => {
      touchStart = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', e => {
      const diff = touchStart - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? showCarouselNext() : showCarouselPrev();
        resetAutoplay();
      }
    }, { passive: true });
  }

  // Responsive resize
  window.addEventListener('resize', debounceResize(() => {
    const newVisible = getVisibleItems();
    if (newVisible !== carouselState.itemsVisible) {
      carouselState.itemsVisible = newVisible;
      carouselState.current = 0;
      updateCarousel();
      rebuildDots();
    }
  }));
}

function debounceResize(fn) {
  let t;
  return function() {
    clearTimeout(t);
    t = setTimeout(fn, 250);
  };
}

function rebuildDots() {
  const dotsContainer = document.querySelector('.carousel-dots');
  if (!dotsContainer) return;

  const totalDots = Math.ceil(carouselState.total / carouselState.itemsVisible);
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i * carouselState.itemsVisible));
    dotsContainer.appendChild(dot);
  }
}

function goToSlide(index) {
  const maxIndex = carouselState.total - carouselState.itemsVisible;
  carouselState.current = Math.max(0, Math.min(index, maxIndex));
  updateCarousel();
}

function showCarouselNext() {
  const maxIndex = carouselState.total - carouselState.itemsVisible;
  carouselState.current = carouselState.current >= maxIndex
    ? 0
    : carouselState.current + 1;
  updateCarousel();
}

function showCarouselPrev() {
  const maxIndex = carouselState.total - carouselState.itemsVisible;
  carouselState.current = carouselState.current <= 0
    ? maxIndex
    : carouselState.current - 1;
  updateCarousel();
}

function updateCarousel() {
  const track  = document.querySelector('.testimonials-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots   = document.querySelectorAll('.dot');

  if (!track || !slides.length) return;

  carouselState.isAnimating = true;

  const slideWidth = 100 / carouselState.itemsVisible;
  track.style.transform = `translateX(-${carouselState.current * slideWidth}%)`;

  // Update dots
  const dotIndex = Math.floor(carouselState.current / carouselState.itemsVisible) %
    Math.ceil(carouselState.total / carouselState.itemsVisible);

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === dotIndex);
  });

  setTimeout(() => {
    carouselState.isAnimating = false;
  }, 600);
}

function startAutoplay() {
  stopAutoplay();
  carouselState.autoplay = setInterval(() => {
    showCarouselNext();
  }, 5000);
}

function stopAutoplay() {
  if (carouselState.autoplay) {
    clearInterval(carouselState.autoplay);
    carouselState.autoplay = null;
  }
}

function resetAutoplay() {
  stopAutoplay();
  startAutoplay();
}

/* ============================================================
   5. FAQ Accordion
   ============================================================ */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others (accordion behavior)
      faqItems.forEach(other => {
        if (other !== item && other.classList.contains('open')) {
          closeAccordion(other);
        }
      });

      isOpen ? closeAccordion(item) : openAccordion(item);
    });

    // Keyboard support
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });

    // ARIA attributes
    question.setAttribute('aria-expanded', 'false');
    answer.setAttribute('role', 'region');
    const qId = `faq-q-${Math.random().toString(36).substr(2, 6)}`;
    const aId = `faq-a-${Math.random().toString(36).substr(2, 6)}`;
    question.setAttribute('id', qId);
    question.setAttribute('aria-controls', aId);
    answer.setAttribute('id', aId);
    answer.setAttribute('aria-labelledby', qId);
  });
}

function openAccordion(item) {
  const answer  = item.querySelector('.faq-answer');
  const icon    = item.querySelector('.faq-icon');
  const question = item.querySelector('.faq-question');

  item.classList.add('open');
  question && question.setAttribute('aria-expanded', 'true');

  if (answer) {
    answer.style.maxHeight = answer.scrollHeight + 'px';
  }
}

function closeAccordion(item) {
  const answer   = item.querySelector('.faq-answer');
  const question = item.querySelector('.faq-question');

  item.classList.remove('open');
  question && question.setAttribute('aria-expanded', 'false');

  if (answer) {
    answer.style.maxHeight = '0';
  }
}

/* ============================================================
   6. FAQ Search / Filter
   ============================================================ */
function initFAQSearch() {
  const searchInput = document.getElementById('faq-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    filterFAQ(query);
  });

  // Clear on Escape
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      filterFAQ('');
      searchInput.blur();
    }
  });
}

function filterFAQ(query) {
  const faqItems    = document.querySelectorAll('.faq-item');
  const categories  = document.querySelectorAll('.faq-category');
  const noResults   = document.getElementById('faq-no-results');

  let visibleCount = 0;

  faqItems.forEach(item => {
    const questionText = item.querySelector('.faq-question')?.textContent?.toLowerCase() || '';
    const answerText   = item.querySelector('.faq-answer-inner')?.textContent?.toLowerCase() || '';
    const matches      = !query || questionText.includes(query) || answerText.includes(query);

    item.style.display = matches ? '' : 'none';
    if (matches) visibleCount++;
  });

  // Show/hide category titles based on visible items
  categories && categories.forEach(cat => {
    const visibleInCat = [...cat.querySelectorAll('.faq-item')].some(
      item => item.style.display !== 'none'
    );
    cat.style.display = visibleInCat ? '' : 'none';
  });

  // No results message
  if (noResults) {
    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
  }
}

/* ============================================================
   7. Contact Form — Validation + Formspree Submission
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn     = form.querySelector('.form-submit-btn');
  const successMsg    = document.getElementById('form-success');
  const errorMsg      = document.getElementById('form-error-global');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm(form)) return;

    // Loading state
    setSubmitLoading(submitBtn, true);

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method:  'POST',
        body:    formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // Success
        form.reset();
        form.style.display = 'none';
        if (successMsg) {
          successMsg.classList.add('visible');
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Google Analytics event
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_submit', {
            event_category: 'Contact',
            event_label: 'Wedding Inquiry'
          });
        }
      } else {
        const data = await response.json();
        const message = data?.errors?.map(e => e.message).join(', ') ||
          'Something went wrong. Please try again or email us directly.';
        showFormError(errorMsg, message);
      }
    } catch (err) {
      showFormError(errorMsg, 'Network error. Please check your connection and try again.');
    } finally {
      setSubmitLoading(submitBtn, false);
    }
  });

  // Real-time validation
  form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearFieldError(input));
  });
}

function validateForm(form) {
  let isValid = true;
  const fields = form.querySelectorAll('[required]');

  fields.forEach(field => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  return isValid;
}

function validateField(field) {
  clearFieldError(field);

  const value   = field.value.trim();
  const type    = field.type;
  const name    = field.name;
  let errorMsg  = '';

  if (field.hasAttribute('required') && !value) {
    errorMsg = 'This field is required.';
  } else if (type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    errorMsg = 'Please enter a valid email address.';
  } else if (name === 'phone' && value && !/^[\d\s\+\-\(\)]{7,20}$/.test(value)) {
    errorMsg = 'Please enter a valid phone number.';
  }

  if (errorMsg) {
    showFieldError(field, errorMsg);
    return false;
  }

  return true;
}

function showFieldError(field, message) {
  field.classList.add('error');
  const errorEl = field.parentElement?.querySelector('.form-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
}

function clearFieldError(field) {
  field.classList.remove('error');
  const errorEl = field.parentElement?.querySelector('.form-error');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
}

function showFormError(el, message) {
  if (!el) return;
  el.textContent = message;
  el.style.display = 'block';
  setTimeout(() => { if (el) el.style.display = 'none'; }, 6000);
}

function setSubmitLoading(btn, isLoading) {
  if (!btn) return;
  btn.disabled = isLoading;
  btn.innerHTML = isLoading
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Sending...`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> Send Inquiry`;
}

/* ============================================================
   8. Parallax Effect (subtle, performance-optimized)
   ============================================================ */
function initParallax() {
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length) return;

  // Only on desktop — skip for mobile to avoid jank
  if (window.innerWidth < 768) return;

  // Check prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        parallaxEls.forEach(el => {
          const speed  = parseFloat(el.dataset.parallax) || 0.3;
          const offset = scrollY * speed;
          el.style.transform = `translateY(${offset}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================================
   9. Add spin keyframe dynamically for loading spinner
   ============================================================ */
(function addSpinKeyframe() {
  const style = document.createElement('style');
  style.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
})();

/* ============================================================
   10. Gallery CSS for show/hide animation
   ============================================================ */
(function addGalleryStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .gallery-hidden {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .gallery-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
})();