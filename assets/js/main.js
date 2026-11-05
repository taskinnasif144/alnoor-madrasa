/* ========================================
   Al-Noor Madrasa - Main JavaScript
   Vanilla JS, no jQuery
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initStickyHeader();
  initMobileMenu();
  initHeroSlider();
  initScrollReveal();
  initScrollTop();
  initScrollDown();
  initGalleryLightbox();
  initContactForm();
  initDonateForm();
  initLangToggle();
});

/* --- Preloader --- */
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('loaded'), 600);
  });
  const fallback = setTimeout(() => preloader.classList.add('loaded'), 3000);
  window.addEventListener('load', () => clearTimeout(fallback));
}

/* --- Sticky Header --- */
function initStickyHeader() {
  const wrapper = document.querySelector('.sticky-wrapper');
  if (!wrapper) return;
  const header = document.querySelector('.th-header');
  if (!header) return;
  const offset = header.offsetTop;
  window.addEventListener('scroll', () => {
    if (window.scrollY > offset + 100) {
      wrapper.classList.add('sticky');
    } else {
      wrapper.classList.remove('sticky');
    }
  });
}

/* --- Mobile Menu --- */
function initMobileMenu() {
  const toggle = document.querySelector('.th-menu-toggle');
  const wrapper = document.querySelector('.th-menu-wrapper');
  const overlay = document.querySelector('.menu-overlay');
  const close = document.querySelector('.th-menu-toggle-close');
  if (!toggle || !wrapper) return;

  function openMenu() {
    wrapper.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    wrapper.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', openMenu);
  if (close) close.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);
}

/* --- Hero Slider (vanilla implementation using Swiper-like fade) --- */
function initHeroSlider() {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-slide');
  const tabs = document.querySelectorAll('.hero-tabs .tab-btn');
  const dots = document.querySelectorAll('.slider-pagination .dot');
  let current = 0;
  let autoplayTimer;

  function goTo(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
      s.style.opacity = i === index ? '1' : '0';
      s.style.zIndex = i === index ? '1' : '0';
      s.querySelectorAll('[data-ani]').forEach(el => {
        if (i === index) {
          const delay = el.getAttribute('data-ani-delay') || '0s';
          setTimeout(() => el.classList.add('animated'), parseFloat(delay) * 1000);
        } else {
          el.classList.remove('animated');
        }
      });
    });
    tabs.forEach((t, i) => t.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    current = index;
  }

  tabs.forEach((tab, i) => tab.addEventListener('click', () => {
    goTo(i);
    resetAutoplay();
  }));

  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    goTo(i);
    resetAutoplay();
  }));

  function autoplay() {
    const next = (current + 1) % slides.length;
    goTo(next);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(autoplay, 6000);
  }

  if (slides.length > 1) {
    goTo(0);
    resetAutoplay();
  }
}

/* --- Scroll Reveal (IntersectionObserver) --- */
function initScrollReveal() {
  const elements = document.querySelectorAll('[data-ani]');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('animated'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-ani-delay') || '0s';
        setTimeout(() => el.classList.add('animated'), parseFloat(delay) * 1000);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* --- Scroll Top Button --- */
function initScrollTop() {
  const btn = document.querySelector('.scroll-top-btn');
  const ring = btn?.querySelector('.progress-ring circle');
  if (!btn) return;

  const totalDistance = document.documentElement.scrollHeight - window.innerHeight;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
    if (ring) {
      const progress = scrolled / totalDistance;
      const offset = 160 - (progress * 160);
      ring.style.strokeDashoffset = offset;
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --- Scroll Down Indicator --- */
function initScrollDown() {
  const scrollDown = document.querySelector('.scroll-down a');
  if (!scrollDown) return;
  scrollDown.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(scrollDown.getAttribute('href') || '#about');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
}

/* --- Gallery Lightbox --- */
function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  const overlay = document.querySelector('.lightbox-overlay');
  if (!items.length || !overlay) return;

  const img = overlay.querySelector('.lightbox-content img');
  const closeBtn = overlay.querySelector('.lightbox-close');
  const prevBtn = overlay.querySelector('.lightbox-nav.prev');
  const nextBtn = overlay.querySelector('.lightbox-nav.next');
  const counter = overlay.querySelector('.lightbox-counter');

  const images = Array.from(items).map(item => item.querySelector('img').src);
  let currentIdx = 0;

  function showImage(idx) {
    currentIdx = ((idx % images.length) + images.length) % images.length;
    img.src = images[currentIdx];
    if (counter) counter.textContent = `${currentIdx + 1} / ${images.length}`;
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      showImage(i);
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });
  if (prevBtn) prevBtn.addEventListener('click', () => showImage(currentIdx - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showImage(currentIdx + 1));

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIdx - 1);
    if (e.key === 'ArrowRight') showImage(currentIdx + 1);
  });
}

/* --- Contact Form (fake submit) --- */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  const success = document.querySelector('.contact-form .form-success');
  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const message = form.querySelector('[name="message"]');
    let valid = true;

    [name, email, message].forEach(field => {
      if (field && !field.value.trim()) {
        field.style.borderColor = '#DC3545';
        valid = false;
      } else if (field) {
        field.style.borderColor = '';
      }
    });

    if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.style.borderColor = '#DC3545';
      valid = false;
    }

    if (valid) {
      success.classList.add('show');
      form.reset();
      setTimeout(() => success.classList.remove('show'), 5000);
    }
  });
}

/* --- Donate Form --- */
function initDonateForm() {
  const form = document.querySelector('.donate-form');
  if (!form) return;

  const amountBtns = form.querySelectorAll('.amount-presets .amount-btn');
  const amountInput = form.querySelector('.custom-amount input');
  const formContent = form.querySelector('.donate-form-inner');
  const successMsg = form.querySelector('.donate-success');
  const termsCheckbox = form.querySelector('.donate-terms input[type="checkbox"]');
  const paymentMethods = form.querySelectorAll('.payment-method');

  if (amountBtns.length && amountInput) {
    amountBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        amountBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const amount = btn.getAttribute('data-amount');
        amountInput.value = amount === '0' ? '' : amount;
        amountInput.focus();
      });
    });

    amountInput.addEventListener('input', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
    });
  }

  if (paymentMethods.length) {
    paymentMethods.forEach(pm => {
      pm.addEventListener('click', () => {
        paymentMethods.forEach(p => p.classList.remove('active'));
        pm.classList.add('active');
      });
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (termsCheckbox && !termsCheckbox.checked) {
      alert('Please agree to the terms and conditions.');
      return;
    }
    if (amountInput && !amountInput.value.trim()) {
      amountInput.style.borderColor = '#DC3545';
      amountInput.focus();
      return;
    }

    const name = form.querySelector('[name="donor_name"]');
    const email = form.querySelector('[name="donor_email"]');
    const phone = form.querySelector('[name="donor_phone"]');
    let valid = true;
    [name, email, phone].forEach(f => {
      if (f && !f.value.trim()) {
        f.style.borderColor = '#DC3545';
        valid = false;
      } else if (f) {
        f.style.borderColor = '';
      }
    });

    if (!valid) return;

    if (formContent) formContent.style.display = 'none';
    if (successMsg) successMsg.classList.add('show');
  });
}

/* --- Language Toggle (visual stub) --- */
function initLangToggle() {
  const toggleLinks = document.querySelectorAll('.lang-toggle a');
  if (!toggleLinks.length) return;
  toggleLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      toggleLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

/* --- Active nav link highlighting --- */
(function highlightCurrentPage() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-menu a, .th-mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();
