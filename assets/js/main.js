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

  /* ── Hero headline: alternate lines one at a time ───── */
  const heroHeadline = document.getElementById('heroHeadline');
  if (heroHeadline) {
    const headlines = [
      [{ t:'From ', c:'white' }, { t:'Data', c:'crimson' }, { t:' to Decisions.', c:'white' }],
      [{ t:'From ', c:'white' }, { t:'Research', c:'crimson' }, { t:' to Reality.', c:'white' }],
    ];

    function buildHtml(segs, charCount) {
      let html = ''; let rem = charCount;
      for (const s of segs) {
        if (rem <= 0) break;
        const slice = s.t.slice(0, rem);
        const col = s.c === 'crimson' ? 'var(--crimson)' : 'var(--white)';
        html += `<span style="color:${col}">${slice}</span>`;
        rem -= s.t.length;
      }
      return html;
    }
    function segLen(segs) { return segs.reduce((s,x) => s + x.t.length, 0); }

    let hi = 0;      // headline index
    let ci = 0;      // char index
    let state = 'typing'; // typing | holding | deleting | gap

    function tickHeadline() {
      const segs = headlines[hi];
      const total = segLen(segs);

      if (state === 'typing') {
        ci++;
        heroHeadline.innerHTML = buildHtml(segs, ci);
        if (ci >= total) { state = 'holding'; setTimeout(tickHeadline, 2400); }
        else setTimeout(tickHeadline, 58);

      } else if (state === 'holding') {
        state = 'deleting';
        setTimeout(tickHeadline, 40);

      } else if (state === 'deleting') {
        ci--;
        heroHeadline.innerHTML = buildHtml(segs, ci);
        if (ci <= 0) {
          heroHeadline.innerHTML = '';
          state = 'gap';
          hi = (hi + 1) % headlines.length;
          setTimeout(tickHeadline, 320);
        } else {
          setTimeout(tickHeadline, 32);
        }

      } else if (state === 'gap') {
        ci = 0;
        state = 'typing';
        setTimeout(tickHeadline, 40);
      }
    }
    setTimeout(tickHeadline, 300);
  }


  const twWrap = document.getElementById('twWrap');
  if (twWrap) {
    // Each tagline is an array of {text, color} segments
    const taglines = [
      [{ t:'We research ', c:'white' }, { t:'what matters.', c:'crimson' }, { t:' We build ', c:'white' }, { t:'what works.', c:'crimson' }],
      [{ t:'Turning ', c:'white' }, { t:'evidence', c:'crimson' }, { t:' into action — across Kenya, East Africa, and beyond.', c:'white' }],
      [{ t:'Where ', c:'white' }, { t:'rigorous research', c:'crimson' }, { t:' meets ', c:'white' }, { t:'intelligent data solutions.', c:'crimson' }],
      [{ t:'Research-rooted. ', c:'crimson' }, { t:'Data-powered. ', c:'white' }, { t:'Impact-driven.', c:'crimson' }],
    ];
    let ti = 0;        // tagline index
    let ci = 0;        // char index within flat string
    let deleting = false;

    // Flatten tagline into plain string for typing, then rebuild styled HTML
    function buildHtml(tagline, charCount) {
      let html = '';
      let remaining = charCount;
      for (const seg of tagline) {
        if (remaining <= 0) break;
        const slice = seg.t.slice(0, remaining);
        const color = seg.c === 'crimson' ? 'var(--crimson)' : 'var(--white)';
        html += `<span style="color:${color}">${slice}</span>`;
        remaining -= seg.t.length;
      }
      return html;
    }
    function flatLen(tagline) {
      return tagline.reduce((s, seg) => s + seg.t.length, 0);
    }

    function tick() {
      const tl = taglines[ti];
      const total = flatLen(tl);
      if (deleting) ci--;
      else ci++;
      twWrap.innerHTML = buildHtml(tl, ci);
      let delay = deleting ? 28 : 55;
      if (!deleting && ci >= total)  { delay = 2600; deleting = true; }
      if (deleting  && ci <= 0)      { deleting = false; ti = (ti+1) % taglines.length; delay = 400; }
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

  /* ── Hero viz: 7 rotating displays ─────────────────── */
  const vizBody   = document.getElementById('vizPanelBody');
  const vizTitle  = document.getElementById('vizPanelTitle');
  const vizInds   = document.getElementById('vizIndicators');

  const DISPLAYS = [
    // 0 — R: horizontal bar chart (ggplot2)
    {
      title: 'impact_analysis.R',
      lang: 'R · ggplot2',
      render(el) {
        const data = [
          { label:'Agriculture', val:82, col:'#C6163E' },
          { label:'Healthcare',  val:91, col:'#1A56DB' },
          { label:'Banking',     val:74, col:'#7C3AED' },
          { label:'NGO',         val:68, col:'#0EA5E9' },
          { label:'Government',  val:88, col:'#9333EA' },
        ];
        el.innerHTML = `
<div style="font-family:var(--font-h);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:12px;">Impact Score — R / ggplot2</div>
${data.map(d=>`
<div style="display:flex;align-items:center;gap:8px;margin-bottom:9px;">
  <span style="font-family:var(--font-h);font-size:10px;font-weight:600;color:rgba(255,255,255,.5);width:76px;flex-shrink:0;">${d.label}</span>
  <div style="flex:1;height:6px;background:rgba(255,255,255,.07);overflow:hidden;">
    <div class="vbar" data-w="${d.val}" style="height:100%;width:0%;background:${d.col};transition:width 1s cubic-bezier(.2,.8,.2,1);"></div>
  </div>
  <span style="font-family:var(--font-h);font-size:10px;font-weight:700;color:rgba(255,255,255,.4);width:30px;text-align:right;">${d.val}%</span>
</div>`).join('')}
<div style="margin-top:14px;font-family:'Courier New',monospace;font-size:11px;color:rgba(255,255,255,.25);">ggplot(df, aes(x=sector, y=score, fill=sector)) +<br>&nbsp;&nbsp;geom_col() + coord_flip() + theme_minimal()</div>`;
        setTimeout(()=>el.querySelectorAll('.vbar').forEach((b,i)=>setTimeout(()=>b.style.width=b.dataset.w+'%',i*120)),50);
      }
    },
    // 1 — Python: line chart (matplotlib)
    {
      title: 'trend_analysis.py',
      lang: 'Python · matplotlib',
      render(el) {
        const pts = [12,18,15,28,24,38,32,45,42,55,60,58,72,68,80,76,88,84,94,90];
        const W=320,H=150,pad=20;
        const maxV=Math.max(...pts),minV=Math.min(...pts);
        const sx=(W-pad*2)/(pts.length-1);
        const sy=(H-pad*2)/(maxV-minV);
        const coords=pts.map((v,i)=>`${(pad+i*sx).toFixed(1)},${(H-pad-(v-minV)*sy).toFixed(1)}`);
        const fillCoords=[...coords,`${(pad+(pts.length-1)*sx).toFixed(1)},${H-pad}`,`${pad},${H-pad}`];
        el.innerHTML=`
<div style="font-family:var(--font-h);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:8px;">Project Outcomes Trend — Python / matplotlib</div>
<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:150px;">
  <defs><linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#C6163E" stop-opacity=".35"/><stop offset="100%" stop-color="#C6163E" stop-opacity="0"/></linearGradient></defs>
  <polygon points="${fillCoords.join(' ')}" fill="url(#lg1)"/>
  <polyline points="${coords.join(' ')}" fill="none" stroke="#C6163E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="400" stroke-dashoffset="400" id="linePath"/>
  ${pts.filter((_,i)=>i%4===0).map((v,i)=>{const xi=i*4;return `<circle cx="${(pad+xi*sx).toFixed(1)}" cy="${(H-pad-(v-minV)*sy).toFixed(1)}" r="3.5" fill="#C6163E" opacity="0"/><text x="${(pad+xi*sx).toFixed(1)}" y="${H-4}" text-anchor="middle" fill="rgba(255,255,255,.3)" font-size="9">${2018+i}</text>`}).join('')}
</svg>
<div style="font-family:'Courier New',monospace;font-size:11px;color:rgba(255,255,255,.25);margin-top:4px;">plt.plot(years, outcomes, color='#C6163E', linewidth=2)<br>plt.fill_between(years, outcomes, alpha=0.3)</div>`;
        setTimeout(()=>{
          const line=el.querySelector('#linePath');
          if(line){line.style.transition='stroke-dashoffset 1.8s ease';line.style.strokeDashoffset='0';}
          el.querySelectorAll('circle').forEach((c,i)=>setTimeout(()=>{c.style.transition='opacity .3s';c.style.opacity='1';},400+i*150));
        },100);
      }
    },
    // 2 — Python: scatter plot
    {
      title: 'correlation.py',
      lang: 'Python · seaborn',
      render(el) {
        const W=300,H=160,pad=24;
        const pts=Array.from({length:28},(_,i)=>({
          x:pad+Math.random()*(W-pad*2),
          y:pad+Math.random()*(H-pad*2),
          c:['#C6163E','#1A56DB','#7C3AED','#0EA5E9','#9333EA'][Math.floor(Math.random()*5)],
          s:3+Math.random()*5
        }));
        el.innerHTML=`
<div style="font-family:var(--font-h);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:8px;">Data Correlation — Python / seaborn</div>
<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:155px;">
  <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${H-pad}" stroke="rgba(255,255,255,.1)" stroke-width="1"/>
  <line x1="${pad}" y1="${H-pad}" x2="${W-pad}" y2="${H-pad}" stroke="rgba(255,255,255,.1)" stroke-width="1"/>
  ${pts.map((p,i)=>`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.s.toFixed(1)}" fill="${p.c}" opacity="0"><animate attributeName="opacity" from="0" to="0.8" dur="0.3s" begin="${0.05*i}s" fill="freeze"/></circle>`).join('')}
  <line x1="${pad}" y1="${H-pad-10}" x2="${W-pad}" y2="${pad+20}" stroke="rgba(255,255,255,.15)" stroke-width="1.5" stroke-dasharray="4,3"/>
</svg>
<div style="font-family:'Courier New',monospace;font-size:11px;color:rgba(255,255,255,.25);">sns.scatterplot(data=df, x='investment', y='impact',<br>&nbsp;&nbsp;hue='sector', size='population')</div>`;
      }
    },
    // 3 — R: donut / pie chart
    {
      title: 'sector_share.R',
      lang: 'R · ggplot2',
      render(el) {
        const slices=[
          {label:'Agriculture',val:28,col:'#C6163E'},
          {label:'Health',val:22,col:'#1A56DB'},
          {label:'Finance',val:18,col:'#7C3AED'},
          {label:'NGO',val:16,col:'#0EA5E9'},
          {label:'Gov',val:16,col:'#9333EA'},
        ];
        const cx=80,cy=80,r=60,inner=36;
        let angle=-Math.PI/2;
        const total=slices.reduce((s,d)=>s+d.val,0);
        const paths=slices.map(d=>{
          const sa=angle, ea=angle+(d.val/total)*2*Math.PI;
          const x1=cx+r*Math.cos(sa),y1=cy+r*Math.sin(sa);
          const x2=cx+r*Math.cos(ea),y2=cy+r*Math.sin(ea);
          const ix1=cx+inner*Math.cos(sa),iy1=cy+inner*Math.sin(sa);
          const ix2=cx+inner*Math.cos(ea),iy2=cy+inner*Math.sin(ea);
          const large=d.val/total>0.5?1:0;
          const path=`M ${ix1.toFixed(1)} ${iy1.toFixed(1)} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} L ${ix2.toFixed(1)} ${iy2.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${ix1.toFixed(1)} ${iy1.toFixed(1)} Z`;
          const mid=(sa+ea)/2;
          const lx=cx+(r+16)*Math.cos(mid),ly=cy+(r+16)*Math.sin(mid);
          angle=ea;
          return {path,col:d.col,label:d.label,val:d.val,lx,ly};
        });
        el.innerHTML=`
<div style="font-family:var(--font-h);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:6px;">Sector Distribution — R / ggplot2</div>
<div style="display:flex;align-items:center;gap:16px;">
<svg viewBox="0 0 160 160" style="width:155px;height:155px;flex-shrink:0;">
  ${paths.map((p,i)=>`<path d="${p.path}" fill="${p.col}" opacity="0" style="transition:opacity .3s ${i*0.12}s,transform .4s ${i*0.12}s;transform-origin:${cx}px ${cy}px;transform:scale(0.7);"><title>${p.label}: ${p.val}%</title></path>`).join('')}
  <text x="${cx}" y="${cy+5}" text-anchor="middle" fill="white" font-family="Montserrat,sans-serif" font-size="13" font-weight="800">100%</text>
  <text x="${cx}" y="${cy+18}" text-anchor="middle" fill="rgba(255,255,255,.3)" font-family="Montserrat,sans-serif" font-size="7">coverage</text>
</svg>
<div style="display:flex;flex-direction:column;gap:7px;">
${paths.map(p=>`<div style="display:flex;align-items:center;gap:6px;"><span style="width:8px;height:8px;border-radius:50%;background:${p.col};flex-shrink:0;"></span><span style="font-family:var(--font-h);font-size:10px;color:rgba(255,255,255,.6);">${p.label} <strong style="color:rgba(255,255,255,.9);">${p.val}%</strong></span></div>`).join('')}
</div>
</div>
<div style="font-family:'Courier New',monospace;font-size:10px;color:rgba(255,255,255,.25);margin-top:6px;">ggplot(df,aes(x=2,y=val,fill=sector))+geom_bar(stat="identity",width=1)+coord_polar("y")+xlim(0.5,2.5)</div>`;
        setTimeout(()=>{
          el.querySelectorAll('path').forEach(p=>{p.style.opacity='0.9';p.style.transform='scale(1)';});
        },80);
      }
    },
    // 4 — Python: heatmap (seaborn)
    {
      title: 'correlation_matrix.py',
      lang: 'Python · seaborn',
      render(el) {
        const labels=['Survey','Analytics','ML','Dashboard','Training'];
        const vals=[
          [1.0, 0.72, 0.58, 0.45, 0.61],
          [0.72,1.0,  0.84, 0.76, 0.53],
          [0.58,0.84, 1.0,  0.91, 0.44],
          [0.45,0.76, 0.91, 1.0,  0.38],
          [0.61,0.53, 0.44, 0.38, 1.0 ],
        ];
        const cell=36, pad=52;
        const W=pad+labels.length*cell+8, H=pad+labels.length*cell+8;
        function heatCol(v){
          const r=Math.round(v*198+(1-v)*20);
          const g=Math.round(v*22+(1-v)*30);
          const b=Math.round(v*62+(1-v)*100);
          return `rgb(${r},${g},${b})`;
        }
        el.innerHTML=`
<div style="font-family:var(--font-h);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:6px;">Correlation Matrix — Python / seaborn</div>
<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-height:190px;">
  ${labels.map((l,i)=>`
    <text x="${pad+i*cell+cell/2}" y="${pad-6}" text-anchor="middle" fill="rgba(255,255,255,.5)" font-size="8" font-family="Montserrat,sans-serif">${l}</text>
    <text x="${pad-6}" y="${pad+i*cell+cell/2+4}" text-anchor="end" fill="rgba(255,255,255,.5)" font-size="8" font-family="Montserrat,sans-serif">${l}</text>
  `).join('')}
  ${vals.map((row,i)=>row.map((v,j)=>`
    <rect x="${pad+j*cell+1}" y="${pad+i*cell+1}" width="${cell-2}" height="${cell-2}" fill="${heatCol(v)}" opacity="0" rx="1">
      <animate attributeName="opacity" from="0" to="1" dur="0.25s" begin="${(i*labels.length+j)*0.03}s" fill="freeze"/>
    </rect>
    <text x="${pad+j*cell+cell/2}" y="${pad+i*cell+cell/2+4}" text-anchor="middle" fill="rgba(255,255,255,.85)" font-size="8" font-family="Courier New,monospace">${v.toFixed(2)}</text>
  `).join('')).join('')}
</svg>
<div style="font-family:'Courier New',monospace;font-size:10px;color:rgba(255,255,255,.25);margin-top:4px;">sns.heatmap(corr_matrix, annot=True, cmap='RdPu', fmt='.2f')</div>`;
      }
    },
    // 5 — JavaScript: animated area chart
    {
      title: 'dashboard.js',
      lang: 'JavaScript · D3.js',
      render(el) {
        const series=[
          {label:'Research',col:'#C6163E',pts:[20,35,28,50,45,62,55,72,68,85,78,92]},
          {label:'Analytics',col:'#1A56DB',pts:[10,22,18,30,28,45,40,55,50,65,60,75]},
          {label:'Software',col:'#7C3AED',pts:[5,12,10,18,22,30,28,40,38,52,48,62]},
        ];
        const W=300,H=140,pad=20,months=['J','F','M','A','M','J','J','A','S','O','N','D'];
        const maxV=100;
        const sx=(W-pad*2)/(series[0].pts.length-1);
        const sy=(H-pad*2)/maxV;
        function toCoords(pts){return pts.map((v,i)=>`${(pad+i*sx).toFixed(1)},${(H-pad-v*sy).toFixed(1)}`).join(' ');}
        function toArea(pts){const c=toCoords(pts).split(' ');return [...c,`${(pad+(pts.length-1)*sx).toFixed(1)},${H-pad}`,`${pad},${H-pad}`].join(' ');}
        el.innerHTML=`
<div style="font-family:var(--font-h);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:6px;">Multi-Series Area — JS / D3.js</div>
<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:140px;">
  <defs>${series.map((s,i)=>`<linearGradient id="ag${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${s.col}" stop-opacity=".4"/><stop offset="100%" stop-color="${s.col}" stop-opacity="0"/></linearGradient>`).join('')}</defs>
  ${months.map((m,i)=>`<text x="${(pad+i*sx).toFixed(1)}" y="${H-3}" text-anchor="middle" fill="rgba(255,255,255,.25)" font-size="7" font-family="Montserrat,sans-serif">${m}</text>`).join('')}
  ${series.map((s,si)=>`
    <polygon points="${toArea(s.pts)}" fill="url(#ag${si})" opacity="0.7"/>
    <polyline points="${toCoords(s.pts)}" fill="none" stroke="${s.col}" stroke-width="2" stroke-dasharray="500" stroke-dashoffset="500" id="ap${si}"/>
  `).join('')}
</svg>
<div style="display:flex;gap:14px;margin-top:6px;">
  ${series.map(s=>`<span style="display:flex;align-items:center;gap:5px;font-family:var(--font-h);font-size:10px;color:rgba(255,255,255,.55);"><span style="width:12px;height:2px;background:${s.col};display:inline-block;"></span>${s.label}</span>`).join('')}
</div>
<div style="font-family:'Courier New',monospace;font-size:10px;color:rgba(255,255,255,.25);margin-top:6px;">d3.select('svg').append('path').datum(data)<br>&nbsp;&nbsp;.attr('d', area).style('fill', color)</div>`;
        setTimeout(()=>{
          series.forEach((_,i)=>{const l=el.querySelector(`#ap${i}`);if(l){l.style.transition=`stroke-dashoffset 1.6s ease ${i*0.3}s`;l.style.strokeDashoffset='0';}});
        },80);
      }
    },
    // 6 — STATA: vertical grouped bar
    {
      title: 'survey_results.do',
      lang: 'STATA',
      render(el) {
        const groups=['2020','2021','2022','2023','2024'];
        const series=[
          {label:'Baseline',col:'#C6163E',vals:[62,68,71,78,85]},
          {label:'Endline', col:'#1A56DB',vals:[45,55,63,72,81]},
        ];
        const W=300,H=150,pad=28,bw=18,gap=6,gw=series.length*(bw+gap)-gap+10;
        const groupX=groups.map((_,i)=>pad+i*(gw+20)+gw/2);
        el.innerHTML=`
<div style="font-family:var(--font-h);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:6px;">Survey Outcomes — STATA / twoway bar</div>
<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:148px;">
  <line x1="${pad-4}" y1="${H-pad}" x2="${W-8}" y2="${H-pad}" stroke="rgba(255,255,255,.12)" stroke-width="1"/>
  ${groups.map((g,gi)=>`
    ${series.map((s,si)=>{
      const barH=(s.vals[gi]/100)*(H-pad*1.6);
      const x=pad+gi*(gw+20)+si*(bw+gap);
      const y=H-pad-barH;
      return `<rect x="${x}" y="${H-pad}" width="${bw}" height="0" fill="${s.col}" opacity="0.85" rx="1" id="bar${gi}_${si}"><animate attributeName="height" from="0" to="${barH.toFixed(1)}" dur="0.6s" begin="${(gi*series.length+si)*0.1}s" fill="freeze"/><animate attributeName="y" from="${H-pad}" to="${y.toFixed(1)}" dur="0.6s" begin="${(gi*series.length+si)*0.1}s" fill="freeze"/></rect>`;
    }).join('')}
    <text x="${pad+gi*(gw+20)+gw/2-6}" y="${H-4}" text-anchor="middle" fill="rgba(255,255,255,.4)" font-size="8" font-family="Montserrat,sans-serif">${g}</text>
  `).join('')}
</svg>
<div style="display:flex;gap:14px;margin-top:4px;">
  ${series.map(s=>`<span style="display:flex;align-items:center;gap:5px;font-family:var(--font-h);font-size:10px;color:rgba(255,255,255,.55);"><span style="width:10px;height:10px;background:${s.col};display:inline-block;border-radius:2px;"></span>${s.label}</span>`).join('')}
</div>
<div style="font-family:'Courier New',monospace;font-size:10px;color:rgba(255,255,255,.25);margin-top:6px;">twoway (bar baseline year) (bar endline year),<br>&nbsp;&nbsp;by(sector) legend(on) scheme(s2color)</div>`;
      }
    },
  ];

  if (vizBody && vizTitle && vizInds) {
    // build indicators
    DISPLAYS.forEach((_,i)=>{
      const d=document.createElement('div');
      d.className='viz-ind'+(i===0?' active':'');
      vizInds.appendChild(d);
    });

    let current=0;
    let timer=null;

    function showDisplay(idx) {
      const inds=vizInds.querySelectorAll('.viz-ind');
      inds.forEach((d,i)=>d.classList.toggle('active',i===idx));
      vizBody.classList.add('fading');
      setTimeout(()=>{
        vizTitle.textContent=DISPLAYS[idx].title;
        vizBody.innerHTML='';
        DISPLAYS[idx].render(vizBody);
        vizBody.classList.remove('fading');
      },350);
    }

    function nextDisplay() {
      current=(current+1)%DISPLAYS.length;
      showDisplay(current);
    }

    showDisplay(0);
    timer=setInterval(nextDisplay, 5000);

    // click indicator to jump
    vizInds.querySelectorAll('.viz-ind').forEach((d,i)=>{
      d.style.cursor='pointer';
      d.addEventListener('click',()=>{
        clearInterval(timer);
        current=i;
        showDisplay(i);
        timer=setInterval(nextDisplay,5000);
      });
    });
  }

  /* ── Crossfade image sliders (all pages) ────────────── */
  function initCfSlider(sliderEl, dotsEl, interval) {
    if (!sliderEl || !dotsEl) return;
    const frames = sliderEl.querySelectorAll('.img-cf-frame');
    if (frames.length < 2) return;
    let idx = 0;
    // Build dots
    frames.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'cf-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => jump(i));
      dotsEl.appendChild(d);
    });
    function jump(to) {
      frames[idx].classList.remove('on');
      dotsEl.querySelectorAll('.cf-dot')[idx].classList.remove('active');
      idx = to;
      frames[idx].classList.add('on');
      dotsEl.querySelectorAll('.cf-dot')[idx].classList.add('active');
    }
    setInterval(() => jump((idx + 1) % frames.length), interval);
  }
  // Init all sliders found on page
  document.querySelectorAll('.img-cf').forEach((el, i) => {
    const dotsEl = el.querySelector('.cf-dots');
    initCfSlider(el, dotsEl, 4000 + i * 500);
  });

  /* ── Contact form ────────────────────────────────────── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('button[type=submit]');
      const originalHtml = btn.innerHTML;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      const data = Object.fromEntries(new FormData(form));

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error('Send failed');

        btn.textContent = 'Message Sent!';
        btn.style.background = '#2a7a4b';
        form.reset();
        setTimeout(() => { btn.innerHTML = originalHtml; btn.style.background = ''; btn.disabled = false; }, 4000);
      } catch (err) {
        btn.textContent = 'Failed — please try again';
        btn.style.background = '#a03';
        btn.disabled = false;
        setTimeout(() => { btn.innerHTML = originalHtml; btn.style.background = ''; }, 4000);
      }
    });
  }

});
