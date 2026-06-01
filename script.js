/* ════════════════════════
   STARFIELD CANVAS
════════════════════════ */
const canvas = document.getElementById('starfield');
const ctx    = canvas.getContext('2d');
let W, H, stars = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function initStars() {
  stars = Array.from({ length: 220 }, () => ({
    x:  Math.random() * W,
    y:  Math.random() * H,
    r:  Math.random() * 1.5 + .2,
    a:  Math.random(),
    da: (Math.random() * .003 + .001) * (Math.random() < .5 ? 1 : -1),
    // mix of reds and pinks instead of blues
    color: Math.random() < .4
      ? 'rgba(255,143,171,'    // pink
      : Math.random() < .5
        ? 'rgba(232,83,122,'   // hot pink
        : 'rgba(255,200,210,'  // blush
  }));
}
initStars();

function drawStars() {
  ctx.clearRect(0, 0, W, H);
  stars.forEach(s => {
    s.a += s.da;
    if (s.a <= 0 || s.a >= 1) s.da *= -1;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `${s.color}${(s.a * .8).toFixed(2)})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}
drawStars();

/* ════════════════════════
   SCROLL REVEALS
════════════════════════ */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: .12 });

['distanceWrap', 'letterCard', 'askTitle', 'askSub'].forEach(id => {
  const el = document.getElementById(id);
  if (el) io.observe(el);
});

/* ════════════════════════
   RUNAWAY NO BUTTON
════════════════════════ */
let noClicks = 0;
const yesLabels = [
  'Yes, always! 💕',
  'Of course! 💕',
  'YES!! 💖',
  'ALWAYS YES!! 🌸',
  'YESYESYES!! 💗',
  'Just say YES 🥺💕',
  'CLICK ME PLEASE 💖✨'
];

function runAway(btn) {
  const section = document.getElementById('ask');
  // Switch to absolute positioning on first escape
  if (btn.style.position !== 'absolute') {
    btn.style.position = 'absolute';
    // Start from roughly where it was (below the yes button)
    btn.style.left = '50%';
    btn.style.top  = '60%';
    btn.style.transform = 'translateX(-50%)';
  }

  const bw = btn.offsetWidth, bh = btn.offsetHeight;
  const maxX = section.offsetWidth  - bw - 20;
  const maxY = section.offsetHeight - bh - 20;

  btn.style.transform = '';
  btn.style.left       = Math.floor(Math.random() * Math.max(maxX, 10)) + 'px';
  btn.style.top        = Math.floor(Math.random() * Math.max(maxY, 10)) + 'px';
  btn.style.transition = 'left .18s cubic-bezier(.68,-.55,.27,1.55), top .18s cubic-bezier(.68,-.55,.27,1.55)';

  noClicks++;

  const yesBtn = document.getElementById('yesBtn');
  const scale  = Math.min(1 + noClicks * 0.14, 2.3);
  yesBtn.style.transform  = `scale(${scale})`;
  yesBtn.style.transition = 'transform .3s cubic-bezier(.68,-.55,.27,1.55), box-shadow .3s';
  yesBtn.style.boxShadow  = `0 ${8 + noClicks * 4}px ${30 + noClicks * 10}px rgba(232,83,122,${Math.min(.4 + noClicks * .1, .9)})`;
  yesBtn.textContent = yesLabels[Math.min(noClicks, yesLabels.length - 1)];

  if (noClicks >= 4) {
    btn.style.opacity = String(Math.max(0.07, 1 - noClicks * .18));
  }
}

/* ════════════════════════
   YES / BURST
════════════════════════ */
function sayYes() {
  document.getElementById('askContent').style.display = 'none';
  const s = document.getElementById('success');
  s.style.display = 'flex';
  burstParticles();
}

function burstParticles() {
  const emojis = ['💕', '💫', '✨', '🌸', '💖', '❤️', '🌺', '💗', '🌹', '💝'];
  for (let i = 0; i < 55; i++) {
    setTimeout(() => {
      const p     = document.createElement('div');
      p.className = 'burst-particle';
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      const angle = Math.random() * 360;
      const dist  = 200 + Math.random() * 400;
      const rad   = angle * Math.PI / 180;
      p.style.cssText = `
        left: 50vw; top: 50vh;
        font-size: ${.8 + Math.random() * 1.4}rem;
        --angle: ${angle}deg;
        --tx: ${Math.cos(rad) * dist}px;
        --ty: ${Math.sin(rad) * dist}px;
        animation: shootingFloat ${1.5 + Math.random() * 2}s ease-out forwards;
        opacity: 1;
      `;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 4000);
    }, i * 60);
  }
}