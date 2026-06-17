(function() {
  const canvas = document.getElementById('petals-canvas');
  const ctx = canvas.getContext('2d');
  let petals = [];
  const PETAL_COUNT = 22;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const shapes = ['ellipse', 'teardrop'];

  function createPetal() {
    return {
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 100,
      size: 6 + Math.random() * 12,
      speedY: .4 + Math.random() * .8,
      speedX: -.3 + Math.random() * .6,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (.003 + Math.random() * .006) * (Math.random() > .5 ? 1 : -1),
      opacity: .3 + Math.random() * .45,
      hue: Math.random() > .5 ? '#f6e86c' : '#ffd500',
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      sway: Math.random() * Math.PI * 2,
      swaySpeed: .005 + Math.random() * .01,
    };
  }

  for (let i = 0; i < PETAL_COUNT; i++) {
    const p = createPetal();
    p.y = Math.random() * window.innerHeight;
    petals.push(p);
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.hue;
    ctx.beginPath();
    if (p.shape === 'ellipse') {
      ctx.ellipse(0, 0, p.size, p.size * .55, 0, 0, Math.PI * 2);
    } else {
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * .8, -p.size * .5, p.size * .8, p.size * .5, 0, p.size);
      ctx.bezierCurveTo(-p.size * .8, p.size * .5, -p.size * .8, -p.size * .5, 0, -p.size);
    }
    ctx.fill();
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => {
      p.sway += p.swaySpeed;
      p.x += p.speedX + Math.sin(p.sway) * .5;
      p.y += p.speedY;
      p.rot += p.rotSpeed;
      if (p.y > canvas.height + 30) {
        Object.assign(p, createPetal());
      }
      drawPetal(p);
    });
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ── HEADER SCROLL ── */
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
});

/* ── MOBILE NAV ── */
const ham = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
ham.addEventListener('click', () => mobileNav.classList.toggle('open'));
ham.addEventListener('keydown', e => { if (e.key === 'Enter') mobileNav.classList.toggle('open'); });
function closeMobile() { mobileNav.classList.remove('open'); }

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
}, { threshold: .12 });
revealEls.forEach(el => observer.observe(el));

/* ── LIGHTBOX ── */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbClose = document.getElementById('lb-close');

document.querySelectorAll('.gallery-item img').forEach(img => {
  img.addEventListener('click', () => {
    lbImg.src = img.src.replace('w=500', 'w=1200');
    lbImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  lbImg.src = '';
}

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ── SMOOTH ANCHOR OFFSET ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});