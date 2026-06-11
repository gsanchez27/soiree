/**
 * SoireeWeb — Gallery & Lightbox JavaScript
 * Masonry Filter, Lightbox, Keyboard & Swipe Navigation
 * Wedding Coordination & Event Planning — Philippines
 */

'use strict';

/* ============================================================
   1. DOM Ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilter();
  initLightbox();
  initMasonryGrid();
});

/* ============================================================
   2. Gallery Filter (Category Pills)
   ============================================================ */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.masonry-item');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter || 'all';

      galleryItems.forEach((item, index) => {
        const category = item.dataset.category || '';
        const matches  = filter === 'all' || category === filter;

        if (matches) {
          item.style.display = '';
          // Staggered fade-in
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, index * 40);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ============================================================
   3. Masonry Grid — Initialize styles on items
   ============================================================ */
function initMasonryGrid() {
  const items = document.querySelectorAll('.masonry-item');
  items.forEach(item => {
    item.style.opacity = '1';
    item.style.transform = 'scale(1)';
    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });
}

/* ============================================================
   4. Lightbox
   ============================================================ */
let lightboxImages = [];
let currentIndex   = 0;
let touchStartX    = 0;
let touchEndX      = 0;
let isAnimating    = false;

function initLightbox() {
  // Build images array from gallery items
  const galleryItems = document.querySelectorAll('.masonry-item[data-src]');
  const featuredItems = document.querySelectorAll('.featured-gallery-item[data-src]');

  // Combine both gallery types
  const allItems = [...galleryItems, ...featuredItems];

  allItems.forEach((item, index) => {
    lightboxImages.push({
      src:     item.dataset.src || '',
      caption: item.dataset.caption || '',
      couple:  item.dataset.couple || '',
      date:    item.dataset.date || '',
    });

    item.addEventListener('click', () => {
      openLightbox(index);
    });

    // Keyboard: Enter/Space on focused card
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `View photo ${index + 1}`);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  // Create lightbox DOM if it doesn't exist
  createLightboxDOM();
}

function createLightboxDOM() {
  // Check if already created
  if (document.getElementById('lightbox')) {
    bindLightboxEvents();
    return;
  }

  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Photo Lightbox');
  lb.innerHTML = `
    <button class="lightbox-close" id="lightbox-close" aria-label="Close lightbox">&times;</button>
    <button class="lightbox-nav" id="lightbox-prev" aria-label="Previous photo">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>
    <div class="lightbox-inner">
      <img id="lightbox-img" src="" alt="Wedding photo" />
      <div class="lightbox-caption" id="lightbox-caption"></div>
    </div>
    <button class="lightbox-nav" id="lightbox-next" aria-label="Next photo">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
    <div class="lightbox-counter" id="lightbox-counter"></div>
  `;

  document.body.appendChild(lb);
  bindLightboxEvents();
}

function bindLightboxEvents() {
  const lb          = document.getElementById('lightbox');
  const closeBtn    = document.getElementById('lightbox-close');
  const prevBtn     = document.getElementById('lightbox-prev');
  const nextBtn     = document.getElementById('lightbox-next');
  const lbImg       = document.getElementById('lightbox-img');

  if (!lb) return;

  // Close button
  closeBtn && closeBtn.addEventListener('click', closeLightbox);

  // Nav buttons
  prevBtn && prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrev();
  });
  nextBtn && nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNext();
  });

  // Click backdrop to close
  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', handleLightboxKeydown);

  // Touch/Swipe support
  lb.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lb.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  // Preload on hover of nav buttons
  prevBtn && prevBtn.addEventListener('mouseenter', () => preloadImage(currentIndex - 1));
  nextBtn && nextBtn.addEventListener('mouseenter', () => preloadImage(currentIndex + 1));
}

function handleLightboxKeydown(e) {
  const lb = document.getElementById('lightbox');
  if (!lb || !lb.classList.contains('open')) return;

  switch (e.key) {
    case 'Escape':     closeLightbox(); break;
    case 'ArrowLeft':  showPrev();      break;
    case 'ArrowRight': showNext();      break;
  }
}

function handleSwipe() {
  const diff = touchStartX - touchEndX;
  const threshold = 50;

  if (Math.abs(diff) < threshold) return;
  diff > 0 ? showNext() : showPrev();
}

function openLightbox(index) {
  if (!lightboxImages.length) return;

  const lb = document.getElementById('lightbox');
  if (!lb) return;

  currentIndex = Math.max(0, Math.min(index, lightboxImages.length - 1));
  updateLightboxImage();

  lb.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Focus the close button for accessibility
  setTimeout(() => {
    const closeBtn = document.getElementById('lightbox-close');
    if (closeBtn) closeBtn.focus();
  }, 100);
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  lb.classList.remove('open');
  document.body.style.overflow = '';

  // Return focus to trigger element
  const activeItem = document.querySelector(`.masonry-item[data-src]:nth-child(${currentIndex + 1})`);
  if (activeItem) activeItem.focus();
}

function showPrev() {
  if (isAnimating || !lightboxImages.length) return;
  currentIndex = (currentIndex - 1 + lightboxImages.length) % lightboxImages.length;
  updateLightboxImage(true);
}

function showNext() {
  if (isAnimating || !lightboxImages.length) return;
  currentIndex = (currentIndex + 1) % lightboxImages.length;
  updateLightboxImage(false);
}

function updateLightboxImage(goingBack = false) {
  const lbImg     = document.getElementById('lightbox-img');
  const caption   = document.getElementById('lightbox-caption');
  const counter   = document.getElementById('lightbox-counter');

  if (!lbImg || !lightboxImages[currentIndex]) return;

  isAnimating = true;

  // Fade out current image
  lbImg.style.opacity = '0';
  lbImg.style.transform = `scale(0.95) translateX(${goingBack ? '20px' : '-20px'})`;

  setTimeout(() => {
    const data = lightboxImages[currentIndex];

    lbImg.src = data.src;
    lbImg.alt = data.couple ? `${data.couple} wedding photo` : 'Wedding photo';

    // Update caption
    if (caption) {
      if (data.couple || data.date) {
        caption.innerHTML = `
          <span style="font-family:var(--font-heading);font-size:1rem;color:rgba(255,255,255,0.9)">${data.couple || ''}</span>
          ${data.date ? `<span style="margin:0 0.5rem;opacity:0.4">·</span><span style="font-size:0.85rem;color:rgba(255,255,255,0.6)">${data.date}</span>` : ''}
        `;
      } else {
        caption.innerHTML = data.caption || '';
      }
    }

    // Update counter
    if (counter) {
      counter.textContent = `${currentIndex + 1} / ${lightboxImages.length}`;
    }

    // Preload next/prev
    preloadImage(currentIndex + 1);
    preloadImage(currentIndex - 1);

    // Fade in new image
    lbImg.onload = () => {
      lbImg.style.opacity = '1';
      lbImg.style.transform = 'scale(1) translateX(0)';
      isAnimating = false;
    };

    // Fallback if image already cached
    if (lbImg.complete) {
      lbImg.style.opacity = '1';
      lbImg.style.transform = 'scale(1) translateX(0)';
      isAnimating = false;
    }
  }, 200);

  // Add transition style
  lbImg.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
}

function preloadImage(index) {
  if (index < 0 || index >= lightboxImages.length) return;
  const img = new Image();
  img.src = lightboxImages[index].src;
}

/* ============================================================
   5. Featured Gallery (Home Page — 6 cards)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initFeaturedGallery();
});

function initFeaturedGallery() {
  const featuredItems = document.querySelectorAll('.featured-gallery-item');
  if (!featuredItems.length) return;

  // They are handled by initLightbox()
  // Just ensure hover effects are smooth
  featuredItems.forEach(item => {
    item.style.cursor = 'pointer';
  });
}

/* ============================================================
   6. Gallery Reveal Animation
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  if (!('IntersectionObserver' in window)) return;

  const items = document.querySelectorAll('.masonry-item, .featured-gallery-item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('gallery-visible');
        }, (entry.target.dataset.galleryIndex || 0) * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  items.forEach((item, index) => {
    item.dataset.galleryIndex = index % 6; // reset every 6 for stagger
    item.classList.add('gallery-hidden');
    observer.observe(item);
  });
});