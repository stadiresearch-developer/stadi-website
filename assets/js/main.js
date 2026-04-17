/**
* Stadi Research & Analytics
* Main JavaScript — Redesign
*/
(function() {
  "use strict";

  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  const scrollto = (el) => {
    let header = select('#header')
    let offset = header ? header.offsetHeight : 0
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Header scroll styling
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Hamburger menu + fullscreen overlay nav + mega dropdown
   */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navOverlay = document.getElementById('navOverlay');
  const navClose = document.getElementById('navClose');
  const servicesBtn = document.getElementById('servicesDropdownBtn');
  const megaDropdown = document.getElementById('megaDropdown');

  // Services mega dropdown toggle
  if (servicesBtn && megaDropdown) {
    servicesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = megaDropdown.classList.contains('active');
      megaDropdown.classList.toggle('active');
      servicesBtn.classList.toggle('active');
      if (!isActive && navOverlay) {
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('click', (e) => {
      if (!megaDropdown.contains(e.target) && !servicesBtn.contains(e.target)) {
        megaDropdown.classList.remove('active');
        servicesBtn.classList.remove('active');
      }
    });

    megaDropdown.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        megaDropdown.classList.remove('active');
        servicesBtn.classList.remove('active');
      });
    });
  }

  // Hamburger open
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      navOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (megaDropdown) {
        megaDropdown.classList.remove('active');
        if (servicesBtn) servicesBtn.classList.remove('active');
      }
    });
  }

  if (navClose) {
    navClose.addEventListener('click', () => {
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close overlay when clicking a nav link
  if (navOverlay) {
    const overlayLinks = navOverlay.querySelectorAll('a');
    overlayLinks.forEach(link => {
      link.addEventListener('click', () => {
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /**
   * Scroll with offset on links with .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with offset on page load with hash links
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * GLightbox
   */
  if (typeof GLightbox !== 'undefined') {
    GLightbox({ selector: '.glightbox' });
  }

  /**
   * Clients Slider (sub-pages)
   */
  if (typeof Swiper !== 'undefined' && select('.clients-slider')) {
    new Swiper('.clients-slider', {
      speed: 400,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      slidesPerView: 'auto',
      pagination: { el: '.swiper-pagination', type: 'bullets', clickable: true },
      breakpoints: {
        320: { slidesPerView: 2, spaceBetween: 40 },
        480: { slidesPerView: 3, spaceBetween: 60 },
        640: { slidesPerView: 4, spaceBetween: 80 },
        992: { slidesPerView: 6, spaceBetween: 120 }
      }
    });
  }

  /**
   * Testimonials slider
   */
  if (typeof Swiper !== 'undefined' && select('.testimonials-slider')) {
    new Swiper('.testimonials-slider', {
      speed: 600,
      loop: true,
      autoplay: { delay: 6000, disableOnInteraction: false },
      slidesPerView: 1,
      spaceBetween: 30,
      navigation: {
        nextEl: '.testimonial-next',
        prevEl: '.testimonial-prev',
      }
    });
  }

  /**
   * Swiper slider with 1 slide
   */
  if (typeof Swiper !== 'undefined' && select('.slides-1')) {
    new Swiper('.slides-1', {
      speed: 600,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      slidesPerView: 'auto',
      pagination: { el: '.swiper-pagination', type: 'bullets', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
    });
  }

  /**
   * Portfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer && typeof Isotope !== 'undefined') {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);
      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(el => el.classList.remove('filter-active'));
        this.classList.add('filter-active');
        portfolioIsotope.arrange({ filter: this.getAttribute('data-filter') });
      }, true);
    }
  });

  /**
   * Portfolio lightbox
   */
  if (typeof GLightbox !== 'undefined') {
    GLightbox({ selector: '.portfolio-lightbox' });
  }

  /**
   * Portfolio details slider
   */
  if (typeof Swiper !== 'undefined' && select('.portfolio-details-slider')) {
    new Swiper('.portfolio-details-slider', {
      speed: 400,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', type: 'bullets', clickable: true }
    });
  }

  /**
   * Hero background image cycling
   */
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    const heroImages = [
      'assets/img/homepage_1.jpg',
      'assets/img/homepage_2.jpg',
      'assets/img/stadi_1.jpg'
    ];
    let currentImg = 0;
    heroBg.style.backgroundImage = `url('${heroImages[0]}')`;
    setInterval(() => {
      currentImg = (currentImg + 1) % heroImages.length;
      heroBg.style.opacity = '0';
      setTimeout(() => {
        heroBg.style.backgroundImage = `url('${heroImages[currentImg]}')`;
        heroBg.style.opacity = '1';
      }, 800);
    }, 5000);
  }

  /**
   * Hero typewriter effect
   */
  const typewriterEl = document.getElementById('heroTypewriter');
  if (typewriterEl) {
    const words = ['insights.', 'solutions.', 'applications.', 'impact.'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 60 : 120;

      if (!isDeleting && charIndex === currentWord.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 400;
      }

      setTimeout(type, speed);
    }

    type();
  }

  /**
   * Fade-in on scroll — Intersection Observer
   */
  const fadeEls = document.querySelectorAll('.fade-in-up');
  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    fadeEls.forEach(el => observer.observe(el));
  }

  /**
   * Service tab cards — smooth scroll
   */
  on('click', '.service-tab-card', function(e) {
    e.preventDefault();
    select('.service-tab-card', true).forEach(card => card.classList.remove('active'));
    this.classList.add('active');
    const target = this.getAttribute('href');
    if (target && select(target)) {
      scrollto(target);
    }
  }, true);

  /**
   * PureCounter
   */
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

  /**
   * Skills animation (sub-pages)
   */
  if (typeof Waypoint !== 'undefined') {
    let skilsContent = select('.skills-content');
    if (skilsContent) {
      new Waypoint({
        element: skilsContent,
        offset: '80%',
        handler: function() {
          let progress = select('.progress .progress-bar', true);
          progress.forEach((el) => {
            el.style.width = el.getAttribute('aria-valuenow') + '%'
          });
        }
      })
    }
  }

  /**
   * Set current year in footer
   */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})()
