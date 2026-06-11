/* ════════════════════════════════════════════════════════════
   NextStage V3 — JavaScript
════════════════════════════════════════════════════════════ */

/* ─── Mobile Menu ─── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ─── Nav scroll state ─── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ─── Smooth scroll ─── */
document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ─── Multi-step Form ─── */
const form = document.getElementById('diagnosticForm');
const progressFill = document.getElementById('progressFill');
const stepLabel = document.getElementById('stepLabel');
const formSuccess = document.getElementById('formSuccess');
const formSteps = document.querySelectorAll('.form-step');

let currentStep = 1;
const totalSteps = 3;

function updateProgress() {
  const pct = (currentStep / totalSteps) * 100;
  if (progressFill) progressFill.style.width = pct + '%';
  if (stepLabel) stepLabel.textContent = `Étape ${currentStep} / ${totalSteps}`;
}

function showStep(step) {
  formSteps.forEach(s => {
    s.classList.remove('active');
    if (parseInt(s.dataset.step) === step) s.classList.add('active');
  });
  currentStep = step;
  updateProgress();
}

function validateStep(stepEl) {
  let valid = true;
  // Check required text/email/tel inputs
  stepEl.querySelectorAll('input[required], select[required]').forEach(el => {
    const empty = !el.value.trim();
    el.style.borderColor = empty ? '#ef4444' : '';
    if (empty) valid = false;
  });
  return valid;
}

if (form) {
  form.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      const stepEl = form.querySelector(`.form-step[data-step="${currentStep}"]`);
      if (validateStep(stepEl) && currentStep < totalSteps) {
        showStep(currentStep + 1);
      }
    });
  });

  form.querySelectorAll('[data-prev]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) showStep(currentStep - 1);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const stepEl = form.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (!validateStep(stepEl)) return;

    // Collect data
    const data = {
      etape:    form.querySelector('input[name="etape"]:checked')?.value || '',
      projet:   form.querySelector('input[name="projet"]')?.value || '',
      ville:    form.querySelector('input[name="ville"]')?.value || '',
      niveau:   form.querySelector('select[name="niveau"]')?.value || '',
      rentree:  form.querySelector('select[name="rentree"]')?.value || '',
      prenom:   form.querySelector('input[name="prenom"]')?.value || '',
      whatsapp: form.querySelector('input[name="whatsapp"]')?.value || '',
      email:    form.querySelector('input[name="email"]')?.value || '',
    };

    console.log('[NextStage] Nouveau lead:', data);
    // TODO: POST to Supabase / Firebase / CRM / WhatsApp API

    // Hide steps, show success
    formSteps.forEach(s => s.classList.remove('active'));
    if (progressFill) progressFill.style.width = '100%';
    if (formSuccess) formSuccess.classList.add('active');
  });

  // Auto-advance on radio selection (step 1)
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('change', () => {
      if (currentStep === 1) {
        setTimeout(() => showStep(2), 350);
      }
    });
  });

  // Clear error state on input
  form.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => { el.style.borderColor = ''; });
  });

  updateProgress();
}

/* ─── FAQ Accordion ─── */
document.querySelectorAll('.faq-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(el => {
      el.classList.remove('open');
      el.querySelector('.faq-body').style.maxHeight = '0';
    });

    // Open if was closed
    if (!isOpen) {
      item.classList.add('open');
      const body = item.querySelector('.faq-body');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  });
});

/* ─── Scroll reveal ─── */
if ('IntersectionObserver' in window) {
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    // Stagger siblings inside same parent
    const siblings = Array.from(el.parentElement.querySelectorAll('.reveal'));
    const idx = siblings.indexOf(el);
    el.style.transitionDelay = `${idx * 0.08}s`;
    revealObs.observe(el);
  });
}

/* ─── Timeline line grow on scroll ─── */
const timelineTrack = document.querySelector('.timeline-track');
if (timelineTrack && 'IntersectionObserver' in window) {
  const trackObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        timelineTrack.style.transition = 'opacity 0.5s';
        timelineTrack.style.opacity = '1';
      }
    });
  }, { threshold: 0 });
  timelineTrack.style.opacity = '0';
  trackObs.observe(timelineTrack);
  lucide.createIcons();
}