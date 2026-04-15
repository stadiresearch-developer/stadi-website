# Stadi Website Redesign Instructions
### Reference: methodsanalytics.co.uk

This document provides step-by-step instructions for Claude Code to redesign the Stadi Research & Analytics website to match the visual style, layout, and design language of methodsanalytics.co.uk. All existing content (company name, services, copy, images) must be preserved — only the design is changing.

---

## 1. COLOUR PALETTE — Full Swap

Replace the current teal/cyan scheme with a hot pink/crimson accent system.

In `assets/css/style.css`, update all CSS custom properties:

```css
:root {
  --bg-primary: #0d1520;       /* Deep navy (slightly darker than current) */
  --bg-secondary: #111827;
  --bg-card: #1a2035;
  --border-color: #1e2d4a;
  --accent: #C6163E;           /* Hot pink/crimson — replaces teal #00c8c8 */
  --accent-hover: #a01232;     /* Darker pink on hover */
  --accent-light: rgba(198, 22, 62, 0.12); /* For backgrounds/highlights */
  --text-primary: #ffffff;
  --text-secondary: #b0bec5;
  --text-muted: #64748b;
  --font-heading: 'Montserrat', sans-serif;
  --font-body: 'Open Sans', sans-serif;
}
```

Do a global find-and-replace across all CSS/SCSS files:
- `#00c8c8` → `#C6163E`
- `#00b4b4` → `#a01232`
- `#00e5b0` → `#C6163E`
- `rgba(0, 200, 200, ...)` → `rgba(198, 22, 62, ...)`

---

## 2. NAVIGATION — Replace Horizontal Navbar with Hamburger Menu

The reference site uses a minimal header with logo top-left and a hamburger icon top-right only. No horizontal nav links are shown. When clicked, a fullscreen overlay menu appears.

### 2a. Update `#header` in all HTML files

Remove the `<nav id="navbar">` block entirely. Replace with:

```html
<header id="header" class="fixed-top">
  <div class="container-fluid d-flex align-items-center justify-content-between">
    <div class="logo">
      <a href="index.html"><img src="assets/img/Logo.png" alt="Stadi Analytics" class="img-fluid"></a>
    </div>
    <button class="hamburger-btn" id="hamburgerBtn" aria-label="Open Menu">
      <span></span>
      <span class="accent-line"></span>
      <span></span>
    </button>
  </div>
</header>

<!-- Fullscreen Nav Overlay -->
<div class="nav-overlay" id="navOverlay">
  <button class="nav-overlay-close" id="navClose">&times;</button>
  <nav class="overlay-nav">
    <ul>
      <li><a href="index.html">Home</a></li>
      <li><a href="about.html">About Us</a></li>
      <li><a href="team.html">Our Team</a></li>
      <li><a href="services.html">Services</a></li>
      <li><a href="portfolio.html">Portfolio</a></li>
      <li><a href="blog.html">Insights</a></li>
      <li><a href="contact.html">Contact</a></li>
    </ul>
    <div class="overlay-nav-social">
      <a href="https://twitter.com/Stadi_Analytics" target="_blank"><i class="bi bi-twitter-x"></i></a>
      <a href="https://www.linkedin.com/company/stadi-research-analytics/" target="_blank"><i class="bi bi-linkedin"></i></a>
    </div>
  </nav>
</div>
```

### 2b. CSS for header and nav overlay (add to style.css)

```css
#header {
  height: 80px;
  background: transparent;
  transition: background 0.4s ease;
  border-bottom: none;
}

#header.header-scrolled {
  background: rgba(13, 21, 32, 0.95);
  backdrop-filter: blur(20px);
}

/* Hamburger button */
.hamburger-btn {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.hamburger-btn span {
  display: block;
  width: 28px;
  height: 2px;
  background: #ffffff;
  transition: all 0.3s ease;
}

.hamburger-btn .accent-line {
  background: #C6163E; /* Pink accent on middle line — signature detail */
  width: 20px;         /* Shorter than the others */
}

/* Fullscreen overlay nav */
.nav-overlay {
  position: fixed;
  inset: 0;
  background: rgba(13, 21, 32, 0.98);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.4s ease, visibility 0.4s ease;
}

.nav-overlay.active {
  opacity: 1;
  visibility: visible;
}

.nav-overlay-close {
  position: absolute;
  top: 24px;
  right: 32px;
  background: none;
  border: none;
  color: #fff;
  font-size: 48px;
  cursor: pointer;
  line-height: 1;
}

.overlay-nav ul {
  list-style: none;
  padding: 0;
  text-align: left;
}

.overlay-nav ul li {
  margin-bottom: 16px;
}

.overlay-nav ul li a {
  font-family: 'Montserrat', sans-serif;
  font-size: clamp(28px, 5vw, 52px);
  font-weight: 800;
  color: #ffffff;
  text-decoration: none;
  letter-spacing: -0.02em;
  transition: color 0.2s ease;
  line-height: 1.1;
}

.overlay-nav ul li a:hover {
  color: #C6163E;
}

.overlay-nav-social {
  margin-top: 40px;
  display: flex;
  gap: 20px;
}

.overlay-nav-social a {
  color: #b0bec5;
  font-size: 20px;
}

.overlay-nav-social a:hover {
  color: #C6163E;
}
```

### 2c. JavaScript for hamburger toggle (add to `assets/js/main.js`)

```javascript
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navOverlay = document.getElementById('navOverlay');
const navClose = document.getElementById('navClose');

if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', () => {
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
}

if (navClose) {
  navClose.addEventListener('click', () => {
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });
}
```

---

## 3. HERO SECTION — Left-Aligned, Full-Viewport with Typewriter & Diagonal Elements

This is the biggest visual change. The current hero is centered; the reference hero is dramatically left-aligned with large bold text and a cycling typewriter word.

### 3a. Update HTML for `#hero` in `index.html`

```html
<section id="hero">
  <div class="hero-bg-overlay"></div>

  <div class="hero-content">
    <span class="hero-eyebrow">End-to-End Research & Analytics <span class="eyebrow-dash">—</span></span>
    <h1>
      Unleashing the<br>
      power of <span class="typewriter-wrap">
        <span class="typewriter" id="heroTypewriter"></span><span class="cursor">_</span>
      </span>
    </h1>
    <p class="hero-subtitle">For Government | NGO | Agriculture | Banking | Healthcare</p>
    <div class="hero-ctas">
      <a href="services.html" class="btn-primary-cta">Our Services <span class="btn-plus">+</span></a>
      <a href="https://www.youtube.com/watch?v=jDDaplaOz7Q" class="btn-outline-cta glightbox">
        <span class="play-icon-circle"><i class="bi bi-play-fill"></i></span> Overview
      </a>
    </div>
  </div>

  <!-- Diagonal pink wedge bottom-right -->
  <div class="hero-pink-wedge"></div>

  <!-- Dotted decoration -->
  <div class="hero-dot-grid"></div>

  <!-- Floating 3D geometric decoration (CSS-drawn or SVG) -->
  <div class="hero-geo-shape"></div>
</section>
```

### 3b. CSS for new hero (replace existing `#hero` styles)

```css
#hero {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: var(--bg-primary);
  background-image: url('assets/img/homepage_1.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
  padding: 140px 80px 80px;
  overflow: hidden;
}

/* Dark overlay on hero image */
.hero-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(13,21,32,0.88) 50%, rgba(13,21,32,0.55) 100%);
  z-index: 1;
}

/* LEFT-ALIGNED content (critical change from current centered layout) */
.hero-content {
  position: relative;
  z-index: 2;
  max-width: 700px;
  text-align: left;
  margin: 0;
}

/* Small label above headline */
.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-heading);
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #ffffff;
  margin-bottom: 20px;
  opacity: 0.8;
}

.eyebrow-dash {
  color: #C6163E; /* Pink dash — signature detail */
  font-size: 18px;
  font-weight: 700;
}

/* Giant headline — left-aligned, very large */
#hero h1 {
  font-size: clamp(48px, 7vw, 90px);
  font-weight: 800;
  color: #ffffff;
  line-height: 1.0;
  letter-spacing: -0.03em;
  margin-bottom: 24px;
  text-align: left;
}

/* Typewriter animation wrapper */
.typewriter-wrap {
  display: inline-block;
  min-width: 200px;
}

.typewriter {
  color: #C6163E; /* Typed words are pink */
}

.cursor {
  color: #C6163E;
  animation: blink 0.8s infinite;
  font-weight: 300;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Subtitle */
.hero-subtitle {
  font-size: 14px;
  color: rgba(255,255,255,0.6);
  letter-spacing: 0.08em;
  margin-bottom: 40px;
  text-align: left;
}

/* CTA buttons — boxy, rectangular (not rounded) */
.hero-ctas {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-primary-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #C6163E;
  color: #ffffff;
  font-family: var(--font-heading);
  font-size: 14px;
  font-weight: 600;
  padding: 16px 32px;
  border-radius: 0;  /* Square corners — reference site uses sharp corners */
  border: 2px solid #C6163E;
  text-decoration: none;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: background 0.25s ease, color 0.25s ease;
}

.btn-primary-cta:hover {
  background: #a01232;
  border-color: #a01232;
  color: #ffffff;
}

.btn-plus {
  font-size: 18px;
  font-weight: 300;
}

.btn-outline-cta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: transparent;
  color: #ffffff;
  font-family: var(--font-heading);
  font-size: 14px;
  font-weight: 600;
  padding: 16px 32px;
  border-radius: 0;
  border: 2px solid rgba(255,255,255,0.5);
  text-decoration: none;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: all 0.25s ease;
}

.btn-outline-cta:hover {
  border-color: #ffffff;
  color: #ffffff;
}

/* Play icon in circle */
.play-icon-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.6);
  font-size: 10px;
}

/* DIAGONAL PINK WEDGE — bottom-right corner (signature element) */
.hero-pink-wedge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 380px;
  height: 380px;
  background: #C6163E;
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
  z-index: 1;
}

/* Dotted grid pattern on the pink wedge */
.hero-dot-grid {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 320px;
  height: 320px;
  background-image: radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px);
  background-size: 18px 18px;
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
  z-index: 2;
  pointer-events: none;
}

/* Geometric floating shape (right side) */
.hero-geo-shape {
  position: absolute;
  right: 340px;
  bottom: 120px;
  width: 160px;
  height: 160px;
  background: rgba(255,255,255,0.06);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  z-index: 3;
  border: 1px solid rgba(255,255,255,0.15);
}

@media (max-width: 768px) {
  #hero {
    padding: 120px 24px 80px;
  }
  .hero-pink-wedge,
  .hero-dot-grid,
  .hero-geo-shape {
    display: none;
  }
}
```

### 3c. Typewriter JavaScript (add to `assets/js/main.js`)

```javascript
// Hero typewriter effect
const typewriterEl = document.getElementById('heroTypewriter');
if (typewriterEl) {
  const words = ['data.', 'insights.', 'results.', 'impact.'];
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
```

---

## 4. TYPOGRAPHY — Make Headings Larger and Bolder

The reference site uses much larger, more impactful headings, often all-caps for section labels.

Add/update these rules globally in `style.css`:

```css
/* ALL-CAPS section labels (used above section headings) */
.section-label {
  display: inline-block;
  font-family: var(--font-heading);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #C6163E;
  margin-bottom: 16px;
}

/* Section headings — bolder and larger */
.section-header h2 {
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

/* About intro — large statement paragraph */
.about-intro-heading {
  font-size: clamp(22px, 3vw, 34px);
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-primary);
}
```

Update all `<h2>` section headers to add a `<span class="section-label">` above them. For example:

```html
<!-- BEFORE -->
<h2>Sectors We Specialise In</h2>

<!-- AFTER -->
<span class="section-label">Sectors</span>
<h2>Sectors We Specialise In</h2>
```

---

## 5. BUTTONS — Remove Rounded Corners, Make Boxy

The reference site uses sharp rectangular buttons (border-radius: 0), not pill/rounded.

In `style.css`, update all button border-radius values:

```css
/* Replace ALL instances of border-radius on buttons */
.btn-primary-cta,
.btn-outline-cta,
.nav-cta {
  border-radius: 0 !important;
}
```

---

## 6. SERVICE DETAIL SECTIONS — Add Diagonal Image Cuts

Each service detail section (`service-detail`) has an image with a diagonal cut. Add this to style.css:

```css
.service-img-wrap {
  position: relative;
}

.service-img {
  position: relative;
  overflow: hidden;
}

/* Diagonal clip on all service images */
.service-img img {
  width: 100%;
  clip-path: polygon(0 0, 100% 0, 92% 100%, 0 100%);
  transition: transform 0.4s ease;
}

.service-detail.section-light .service-img img {
  clip-path: polygon(8% 0, 100% 0, 100% 100%, 0 100%);
}

.service-img:hover img {
  transform: scale(1.03);
}

/* Pink accent line on images */
.service-img::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 4px;
  background: #C6163E;
}
```

---

## 7. SECTORS SECTION — Update to ALL-CAPS Card Style

Update the sectors section HTML to use the reference site's card style:

```html
<!-- Add section label above heading -->
<section id="sectors" class="sectors section-dark">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Sectors</span>
      <h2>Sectors We Specialise In</h2>
    </div>
    <!-- ... existing sector cards, but change h3 to uppercase style -->
  </div>
</section>
```

Update the `.sector-card h3` in CSS:

```css
.sector-card h3 {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-primary);
  margin: 16px 0 12px;
}

/* Pink accent bar on sector card icon */
.sector-icon {
  position: relative;
  padding-bottom: 16px;
}

.sector-icon::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 32px;
  height: 3px;
  background: #C6163E;
}
```

---

## 8. TESTIMONIALS — Add a Testimonial Carousel Section

The reference site has a prominent testimonials slider. Add this section to `index.html` between the "Why Choose Us" and "Clients" sections:

```html
<!-- ======= Testimonials Section ======= -->
<section id="testimonials" class="testimonials section-dark">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Client Feedback</span>
      <h2>What Our Clients Say</h2>
    </div>
    <div class="testimonials-slider swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <div class="testimonial-card">
            <div class="quote-mark">"</div>
            <p>"Stadi provided exceptional research and insight that directly improved our programme outcomes. Their methodology was rigorous and their team was a pleasure to work with."</p>
            <div class="testimonial-author">
              <strong>Programme Director</strong>
              <span>Government Agency, Kenya</span>
            </div>
          </div>
        </div>
        <!-- Add more slides as needed -->
      </div>
      <div class="testimonials-controls">
        <button class="swiper-button-prev testimonial-prev"><i class="bi bi-arrow-left"></i></button>
        <button class="swiper-button-next testimonial-next"><i class="bi bi-arrow-right"></i></button>
      </div>
    </div>
  </div>
</section>
```

CSS for testimonials:

```css
.testimonials {
  padding: 100px 0;
}

.testimonial-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 48px;
  position: relative;
}

.quote-mark {
  font-size: 80px;
  line-height: 0.5;
  color: #C6163E;
  font-family: Georgia, serif;
  margin-bottom: 24px;
  display: block;
}

.testimonial-card p {
  font-size: 18px;
  line-height: 1.7;
  color: var(--text-primary);
  font-style: italic;
  margin-bottom: 32px;
}

.testimonial-author strong {
  display: block;
  color: var(--text-primary);
  font-family: var(--font-heading);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.testimonial-author span {
  color: #C6163E;
  font-size: 13px;
}

.testimonials-controls {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.testimonials-controls button {
  width: 48px;
  height: 48px;
  border: 2px solid var(--border-color);
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  border-radius: 0;
  font-size: 16px;
  transition: all 0.25s ease;
}

.testimonials-controls button:hover {
  background: #C6163E;
  border-color: #C6163E;
}
```

---

## 9. CTA BANNER — Update Copy to Match Reference Site Style

Update the CTA banner section copy and style to mirror the reference site's bold closing statement:

```html
<section id="cta-banner" class="cta-banner">
  <div class="container">
    <span class="section-label">Work With Us</span>
    <h2>Find out how Stadi Analytics can<br>transform your data for good</h2>
    <a href="contact.html" class="btn-primary-cta">Get In Touch <span class="btn-plus">+</span></a>
  </div>
</section>
```

CSS update:

```css
.cta-banner {
  background: #C6163E;
  padding: 100px 0;
  text-align: center;
}

.cta-banner h2 {
  font-size: clamp(28px, 4vw, 52px);
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin-bottom: 40px;
  line-height: 1.15;
}

.cta-banner .section-label {
  color: rgba(255,255,255,0.7);
}

.cta-banner .btn-primary-cta {
  background: #ffffff;
  color: #C6163E;
  border-color: #ffffff;
}

.cta-banner .btn-primary-cta:hover {
  background: transparent;
  color: #ffffff;
}
```

---

## 10. FOOTER — Add Bold CTA Heading Before Footer Links

The reference site's footer begins with a large bold statement heading before the standard footer columns. Add this to `index.html` and all pages:

```html
<footer id="footer">
  <!-- Footer CTA row (reference site signature detail) -->
  <div class="footer-cta-row">
    <div class="container">
      <h2>Find out how Stadi Analytics can<br>transform your data into actionable insights</h2>
      <a href="contact.html" class="btn-primary-cta">Get In Touch <span class="btn-plus">+</span></a>
    </div>
  </div>

  <!-- Existing footer-top and footer-bottom content unchanged -->
  <div class="footer-top"> ... </div>
  <div class="footer-bottom"> ... </div>
</footer>
```

CSS:

```css
.footer-cta-row {
  padding: 100px 0;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.footer-cta-row h2 {
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 32px;
  line-height: 1.2;
}
```

---

## 11. SECTION SPACING & DIAGONAL DIVIDERS

Add diagonal section transitions between alternating dark/light sections using CSS clip-path:

```css
/* Sections that slope downward */
.section-dark.diagonal-bottom {
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 60px), 0 100%);
  margin-bottom: -60px;
  padding-bottom: 140px;
}

.section-light.diagonal-top {
  clip-path: polygon(0 60px, 100% 0, 100% 100%, 0 100%);
  padding-top: 140px;
}
```

Apply these classes to the alternating service sections for a dynamic diagonal flow.

---

## 12. SCROLL ANIMATIONS — Add Fade-In on Scroll

The reference site uses heavy scroll-triggered animations. Implement a lightweight CSS + Intersection Observer version:

```javascript
// Fade-in on scroll (add to main.js)
const fadeEls = document.querySelectorAll('.fade-in-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

fadeEls.forEach(el => observer.observe(el));
```

```css
.fade-in-up {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.fade-in-up.visible {
  opacity: 1;
  transform: translateY(0);
}
```

Add `class="fade-in-up"` to all section headings, service cards, sector cards, and stat boxes.

---

## 13. STAT BOXES — Update to Match Reference Style

Replace the current stat-box grid with a cleaner, reference-style layout:

```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;
}

.stat-box {
  padding: 48px 32px;
  border: 1px solid var(--border-color);
  position: relative;
}

/* Pink top accent bar */
.stat-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 32px;
  width: 40px;
  height: 3px;
  background: #C6163E;
}

.stat-number {
  font-size: 56px;
  font-weight: 800;
  color: #ffffff;
  display: block;
  line-height: 1;
  margin-bottom: 8px;
  letter-spacing: -0.03em;
}

/* Add "+" suffix after numbers */
.stat-number::after {
  content: '+';
  font-size: 32px;
  color: #C6163E;
}

.stat-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  font-family: var(--font-heading);
  font-weight: 600;
}
```

---

## 14. APPLY CHANGES TO ALL PAGES

The following changes must be applied consistently across **all HTML files** (index.html, about.html, team.html, services.html, contact.html, portfolio-details.html, blog.html, blog-single.html, blog-loans.html):

1. Replace the `<header>` and `<nav>` block with the hamburger + overlay nav (Section 2)
2. Update all `<a class="btn-primary-cta">` to remove rounded corners
3. Add `class="section-label"` spans above section headings
4. Update all `<footer>` blocks with the new footer-cta-row (Section 10)
5. Replace all teal accent colours with pink (#C6163E)
6. Add `class="fade-in-up"` to key content elements

---

## 15. SUMMARY OF KEY VISUAL DIFFERENCES TO ACHIEVE

| Element | Current (Stadi) | Target (Methods Analytics Style) |
|---|---|---|
| Accent colour | Teal `#00c8c8` | Hot pink `#C6163E` |
| Navigation | Horizontal navbar | Hamburger + fullscreen overlay |
| Hero alignment | Centered text | Left-aligned text |
| Hero headline | Static text | Typewriter animation cycling words |
| CTA buttons | Rounded pill | Sharp rectangular (border-radius: 0) |
| Section labels | None | ALL-CAPS small labels above headings |
| Images | Standard | Diagonal clip-path cuts |
| Decorative elements | Circles/dots | Diagonal pink wedge + geometric shapes |
| Stat boxes | Card grid | Bordered grid with pink accent bars |
| Testimonials | None | Swiper carousel with large quote marks |
| Footer | Standard columns | Bold CTA heading row + columns |
| Animations | AOS library | Intersection Observer fade-in-up |

---

*These instructions are intended to be passed directly to Claude Code. All Stadi content, copy, images, and branding must remain intact — only the visual design system is being updated.*
