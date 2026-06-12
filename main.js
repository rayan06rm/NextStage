/* ════════════════════════════════════════════════════════════
   NextStage V3 — JavaScript
   Formulaire diagnostique conditionnel complet
════════════════════════════════════════════════════════════ */

/* ─── Init Lucide Icons ─── */
if (typeof lucide !== 'undefined') lucide.createIcons();

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

/* ─── Nav scroll ─── */
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
      const offset = 64;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    }
  });
});

/* ══════════════════════════════════════════════════════
   DIAGNOSTIC FORM — Logique conditionnelle complète
══════════════════════════════════════════════════════ */

const form = document.getElementById('diagnosticForm');
const progressFill = document.getElementById('progressFill');
const stepLabel = document.getElementById('stepLabel');
const formSuccess = document.getElementById('formSuccess');
const formSteps = document.querySelectorAll('.form-step');

let currentStep = 1;
const totalSteps = 4;

// ── Contenu conditionnel selon la situation ──
const DIAGNOSTIC_CONTENT = {
  debut: {
    caseId: 'caseDebut',
    successTitle: 'Ton plan de départ est prêt !',
    successMsg: 'Je t\'envoie sur WhatsApp dans les 24h un plan complet pour démarrer ta procédure.',
    successItems: [
      '📋 Les 5 erreurs critiques à éviter dès le début',
      '📅 Ton calendrier personnalisé vers la France',
      '🎯 Les filières adaptées à ton profil',
      '💬 Un échange direct avec Rayan sur ta situation',
    ],
    recap: 'Tu recevras un plan de démarrage adapté à ton profil : calendrier, filières recommandées, premières étapes concrètes.',
  },
  dossier: {
    caseId: 'caseDossier',
    successTitle: 'Analyse de ton dossier en cours !',
    successMsg: 'Je prépare un retour détaillé sur ton dossier. Attends mon WhatsApp dans les 24h.',
    successItems: [
      '🔍 Analyse des points faibles de ton dossier',
      '📝 Ce qu\'il faut corriger avant de soumettre',
      '🏫 Stratégie de sélection des universités',
      '💬 Conseils sur ta lettre de motivation',
    ],
    recap: 'Tu recevras une analyse de ton dossier en cours : les erreurs fréquentes, comment les corriger, et quelles universités cibler.',
  },
  admis: {
    caseId: 'caseAdmis',
    successTitle: 'Stratégie visa préparée pour toi !',
    successMsg: 'Tu es à l\'étape la plus critique. Je t\'écris sur WhatsApp avec ta stratégie visa personnalisée.',
    successItems: [
      '✅ Comment choisir la meilleure admission',
      '📦 Ce que ton dossier consulaire doit contenir',
      '⚠️ Les erreurs qui causent les refus de visa',
      '💬 Préparation à l\'entretien consulaire',
    ],
    recap: 'Tu recevras une stratégie pour maximiser tes chances d\'obtenir le visa : constitution du dossier consulaire, erreurs à éviter, préparation entretien.',
  },
  refuse: {
    caseId: 'caseRefuse',
    successTitle: 'Analyse de ton refus en cours !',
    successMsg: 'J\'ai vécu exactement ça. Je t\'écris sur WhatsApp avec un plan pour ta 2ème demande.',
    successItems: [
      '🔎 Analyse des raisons probables de ton refus',
      '🛠️ Ce que tu dois corriger dans ton dossier',
      '📋 Plan d\'action pour ta 2ème demande',
      '💬 Rayan a obtenu son visa au 2ème essai — il sait quoi faire',
    ],
    recap: 'Tu recevras une analyse de ton refus et un plan d\'action concret pour ta 2ème demande de visa. Rayan est passé par là.',
  },
};

function getSelectedEtape() {
  return form?.querySelector('input[name="etape"]:checked')?.value || null;
}

// ── Met à jour la colonne gauche selon la sélection ──
function updateLeftPanel(etape) {
  // Cache tous les cases
  document.querySelectorAll('.diag-case').forEach(el => {
    el.classList.remove('active');
  });

  const defaultCase = document.getElementById('caseDefault');

  if (!etape || !DIAGNOSTIC_CONTENT[etape]) {
    if (defaultCase) {
      defaultCase.classList.remove('hidden');
      defaultCase.classList.add('active');
    }
    return;
  }

  // Cache le default
  if (defaultCase) defaultCase.classList.add('hidden');

  // Affiche le bon case
  const caseEl = document.getElementById(DIAGNOSTIC_CONTENT[etape].caseId);
  if (caseEl) caseEl.classList.add('active');
}

// ── Met à jour le récap avant soumission ──
function updateRecap() {
  const etape = getSelectedEtape();
  const recapContent = document.getElementById('recapContent');
  if (!recapContent) return;
  if (etape && DIAGNOSTIC_CONTENT[etape]) {
    recapContent.textContent = DIAGNOSTIC_CONTENT[etape].recap;
  }
}

// ── Affiche les champs conditionnels selon la situation ──
function updateConditionalFields(etape) {
  const fieldTcf = document.getElementById('fieldTcf');
  const fieldAdmissions = document.getElementById('fieldAdmissions');
  const fieldRefus = document.getElementById('fieldRefus');

  if (!fieldTcf || !fieldAdmissions || !fieldRefus) return;

  // Reset
  fieldTcf.style.display = 'none';
  fieldAdmissions.style.display = 'none';
  fieldRefus.style.display = 'none';

  if (etape === 'debut' || etape === 'dossier') {
    fieldTcf.style.display = 'flex';
  } else if (etape === 'admis') {
    fieldAdmissions.style.display = 'flex';
  } else if (etape === 'refuse') {
    fieldRefus.style.display = 'flex';
    fieldTcf.style.display = 'flex'; // aussi utile pour le refus
  }
}

// ── Écouter les clics sur les radio buttons ──
document.querySelectorAll('input[name="etape"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const val = radio.value;
    updateLeftPanel(val);
    updateConditionalFields(val);
    // Auto-avance sur mobile / si déjà sur step 1
    if (currentStep === 1) {
      setTimeout(() => showStep(2), 400);
    }
  });
});

// ── Progress & steps ──
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
  // Si on arrive à step 4, mettre à jour le récap
  if (step === 4) updateRecap();
}

function validateStep(stepEl) {
  let valid = true;
  stepEl.querySelectorAll('input[required]').forEach(el => {
    const empty = !el.value.trim();
    el.style.borderColor = empty ? '#ef4444' : '';
    if (empty) { valid = false; el.focus(); }
  });
  return valid;
}

if (form) {
  form.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      const stepEl = form.querySelector(`.form-step[data-step="${currentStep}"]`);
      // Step 1 : check qu'une option est sélectionnée
      if (currentStep === 1) {
        const selected = form.querySelector('input[name="etape"]:checked');
        if (!selected) {
          // Secouer visuellement les options
          const opts = form.querySelector('.form-options');
          opts?.classList.add('shake');
          setTimeout(() => opts?.classList.remove('shake'), 500);
          return;
        }
      }
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

    const etape = getSelectedEtape();
    const content = DIAGNOSTIC_CONTENT[etape] || {};

    // Collect all data
    const data = {
      etape,
      projet:         form.querySelector('input[name="projet"]')?.value || '',
      niveau:         form.querySelector('select[name="niveau"]')?.value || '',
      rentree:        form.querySelector('select[name="rentree"]')?.value || '',
      tcf:            form.querySelector('select[name="tcf"]')?.value || '',
      admissions:     form.querySelector('select[name="admissions"]')?.value || '',
      raison_refus:   form.querySelector('select[name="raison_refus"]')?.value || '',
      ville:          form.querySelector('input[name="ville"]')?.value || '',
      campus_france:  form.querySelector('select[name="campus_france"]')?.value || '',
      prenom:         form.querySelector('input[name="prenom"]')?.value || '',
      whatsapp:       form.querySelector('input[name="whatsapp"]')?.value || '',
      email:          form.querySelector('input[name="email"]')?.value || '',
    };

    console.log('[NextStage] Nouveau lead qualifié:', data);
    const SUPABASE_URL = 'https://xrxlteycmcmztdqscfeq.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyeGx0ZXljbWNtenRkcXNjZmVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMDk5NDUsImV4cCI6MjA5Njc4NTk0NX0.nW_isNhNwAjWdzahAsccVE6kPsAJR2_ZBdTT6iDFh-s';

    fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(data)
    }).catch(err => console.error('Supabase error:', err));

    // Notifier par email
fetch('https://xrxlteycmcmztdqscfeq.supabase.co/functions/v1/notify-lead', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyeGx0ZXljbWNtenRkcXNjZmVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMDk5NDUsImV4cCI6MjA5Njc4NTk0NX0.nW_isNhNwAjWdzahAsccVE6kPsAJR2_ZBdTT6iDFh-s'
  },
  body: JSON.stringify({ record: data })
}).catch(err => console.error('Email error:', err));

    // ── Personnaliser l'écran de succès ──
    const successTitle = document.getElementById('successTitle');
    const successMessage = document.getElementById('successMessage');
    const successWhat = document.getElementById('successWhat');
    const successWhatsapp = document.getElementById('successWhatsapp');

    const prenom = data.prenom ? `, ${data.prenom}` : '';

    if (successTitle) successTitle.textContent = content.successTitle || 'Diagnostic reçu !';
    if (successMessage) successMessage.textContent = content.successMsg || 'Je t\'écris sur WhatsApp dans les 24h.';

    if (successWhat && content.successItems) {
      successWhat.innerHTML = `<ul>${content.successItems.map(item => `<li>${item}</li>`).join('')}</ul>`;
    }

    // Préremplir le message WhatsApp avec les infos du lead
    const waMsg = encodeURIComponent(
      `Salut Rayan ! Je viens de remplir le diagnostic sur ton site.\n` +
      `Situation : ${etape || '?'}\n` +
      `Filière : ${data.projet || '?'}\n` +
      `Rentrée visée : ${data.rentree || '?'}\n` +
      `Ville : ${data.ville || '?'}\n` +
      `Prénom : ${data.prenom || '?'}`
    );
    if (successWhatsapp) successWhatsapp.href = `https://wa.me/33759804462?text=${waMsg}`;

    // Masquer les étapes, afficher le succès
    formSteps.forEach(s => s.classList.remove('active'));
    if (progressFill) progressFill.style.width = '100%';
    if (formSuccess) formSuccess.classList.add('active');
  });

  // Clear error on input
  form.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => { el.style.borderColor = ''; });
  });

  // Init
  updateProgress();
  updateLeftPanel(null);
}

/* ─── FAQ Accordion ─── */
document.querySelectorAll('.faq-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => {
      el.classList.remove('open');
      el.querySelector('.faq-body').style.maxHeight = '0';
    });
    if (!isOpen) {
      item.classList.add('open');
      const body = item.querySelector('.faq-body');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  });
});

/* ─── Scroll reveal ─── */
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(el => {
    const siblings = Array.from(el.parentElement.querySelectorAll('.reveal'));
    el.style.transitionDelay = `${siblings.indexOf(el) * 0.08}s`;
    obs.observe(el);
  });
}

/* ─── Timeline track fade in ─── */
const timelineTrack = document.querySelector('.timeline-track');
if (timelineTrack && 'IntersectionObserver' in window) {
  timelineTrack.style.opacity = '0';
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      timelineTrack.style.transition = 'opacity 0.6s';
      timelineTrack.style.opacity = '1';
    }
  }, { threshold: 0 }).observe(timelineTrack);
}