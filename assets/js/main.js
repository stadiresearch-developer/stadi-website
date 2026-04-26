/* Stadi Redesign — main.js */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Header scroll ───────────────────────────────────── */
  const header = document.getElementById('header');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Hamburger / overlay nav ─────────────────────────── */
  const ham      = document.getElementById('ham');
  const overlay  = document.getElementById('navOverlay');
  const navClose = document.getElementById('navClose');

  if (ham && overlay) {
    ham.addEventListener('click', () => {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    navClose.addEventListener('click', closeNav);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeNav(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
  }
  function closeNav() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── Typewriter ──────────────────────────────────────── */
  const tw = document.getElementById('tw');
  if (tw) {
    const words = ['impact.', 'insights.', 'results.', 'decisions.'];
    let wi = 0, ci = 0, del = false;
    function tick() {
      const w = words[wi];
      tw.textContent = del ? w.slice(0, --ci) : w.slice(0, ++ci);
      let delay = del ? 55 : 110;
      if (!del && ci === w.length)  { delay = 2200; del = true; }
      if (del  && ci === 0)         { del = false; wi = (wi+1) % words.length; delay = 350; }
      setTimeout(tick, delay);
    }
    tick();
  }

  /* ── Fade-up on scroll ───────────────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => io.observe(el));
  }

  /* ── Counter animation ───────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = +el.dataset.count;
        const duration = 1600;
        const start = performance.now();
        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(ease * target);
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cio.observe(el));
  }

  /* ── Testimonial slider ──────────────────────────────── */
  const swiperEl = document.querySelector('.t-swiper');
  if (swiperEl && window.Swiper) {
    const swiper = new Swiper(swiperEl, {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 2,
      breakpoints: { 768: { slidesPerView: 2 } },
    });
    const prev = document.getElementById('tPrev');
    const next = document.getElementById('tNext');
    if (prev) prev.addEventListener('click', () => swiper.slidePrev());
    if (next) next.addEventListener('click', () => swiper.slideNext());
  }

  /* ── Hero viz: code typewriter ──────────────────────── */
  const codeOutput = document.getElementById('codeOutput');
  if (codeOutput) {
    const lines = [
      `<span class="code-cm"># Load survey dataset</span>`,
      `<span class="code-kw">library</span>(<span class="code-fn">tidyverse</span>)`,
      `df <span class="code-kw">&lt;-</span> <span class="code-fn">read_csv</span>(<span class="code-str">"baseline_2024.csv"</span>)`,
      ``,
      `<span class="code-cm"># Run impact model</span>`,
      `model <span class="code-kw">&lt;-</span> <span class="code-fn">lm</span>(impact ~ sector + region, df)`,
      `<span class="code-fn">summary</span>(model)`,
      ``,
      `<span class="code-cm"># Accuracy</span>`,
      `<span class="code-out">R² = 0.942 · p &lt; 0.001 ✓</span>`,
    ];
    let li = 0;
    function typeLine() {
      if (li >= lines.length) {
        setTimeout(() => { codeOutput.innerHTML = ''; li = 0; typeLine(); }, 3000);
        return;
      }
      const el = document.createElement('div');
      el.innerHTML = lines[li];
      codeOutput.appendChild(el);
      // scroll to bottom
      codeOutput.scrollTop = codeOutput.scrollHeight;
      li++;
      setTimeout(typeLine, li === lines.length ? 800 : Math.random() * 220 + 120);
    }
    setTimeout(typeLine, 800);
  }

  /* ── Hero viz: bar chart build ───────────────────────── */
  const vizBars = document.getElementById('vizBars');
  if (vizBars) {
    const fills = vizBars.querySelectorAll('.viz-bar-fill');
    const io = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      fills.forEach((el, i) => {
        setTimeout(() => {
          el.style.width = el.dataset.w + '%';
        }, i * 180);
      });
      io.disconnect();
    }, { threshold: 0.3 });
    io.observe(vizBars);
    // animate on load too (hero is visible immediately)
    setTimeout(() => {
      fills.forEach((el, i) => {
        setTimeout(() => { el.style.width = el.dataset.w + '%'; }, 600 + i * 180);
      });
    }, 400);
  }

  /* ── Hero viz: sparkline ─────────────────────────────── */
  const sparkLine = document.getElementById('sparkLine');
  const sparkFill = document.getElementById('sparkFill');
  if (sparkLine) {
    const pts = [200,180,210,160,230,190,250,170,240,200,220,180,260,150,280,160,300,140,320,120,340,110,360,90,380,80,400,60].map((v,i)=>i%2===0?v/2:v/8);
    // normalise to viewBox 200×40
    const xs = pts.filter((_,i)=>i%2===0);
    const ys = pts.filter((_,i)=>i%2!==0);
    const minY=Math.min(...ys), maxY=Math.max(...ys);
    const W=200, H=36;
    const norm = xs.map((x,i)=>{
      const nx = (x/Math.max(...xs))*W;
      const ny = H - ((ys[i]-minY)/(maxY-minY))*(H-4) - 2;
      return `${nx.toFixed(1)},${ny.toFixed(1)}`;
    });
    // Animate drawing
    let drawn = 0;
    function drawSpark() {
      if (drawn >= norm.length) return;
      drawn++;
      const pts2 = norm.slice(0,drawn).join(' ');
      sparkLine.setAttribute('points', pts2);
      const last = norm[drawn-1].split(',');
      const fillPts = norm.slice(0,drawn).join(' ') + ` ${last[0]},${H} 0,${H}`;
      sparkFill.setAttribute('points', fillPts);
      setTimeout(drawSpark, 60);
    }
    setTimeout(drawSpark, 1200);
  }

  /* ── Contact form ────────────────────────────────────── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type=submit]');
      btn.textContent = 'Sending…';
      setTimeout(() => {
        btn.textContent = 'Message Sent';
        btn.style.background = '#2a7a4b';
        form.reset();
      }, 1200);
    });
  }

});
