// Injecte le contenu des fichiers data/*.json dans la page.
// Modifiable depuis /admin (CMS) sans toucher au code.

const ICONS = {
  web: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="14" rx="1"/><line x1="3" y1="8" x2="21" y2="8"/><circle cx="6" cy="6" r="0.6" fill="currentColor" stroke="none"/></svg>`,
  app: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="16" height="18" rx="1"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>`,
  shield: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z"/></svg>`,
  chat: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>`
};

function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null) el.textContent = value;
}

function setHTML(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null) el.innerHTML = value;
}

async function loadJSON(path) {
  try {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch (err) {
    console.warn('Contenu introuvable, valeurs par défaut conservées :', path, err);
    return null;
  }
}

function renderSite(data) {
  if (!data) return;

  if (data.brand) {
    setText('brand-name-header', data.brand.name);
    setText('brand-name-footer', data.brand.name);
  }

  if (data.hero) {
    setText('hero-location', data.hero.location);
    if (data.hero.title_line1 || data.hero.title_accent) {
      setHTML('hero-title', `${data.hero.title_line1 || ''} <em>${data.hero.title_accent || ''}</em>`);
    }
    setText('hero-lead', data.hero.lead);
    setText('hero-cta-primary', data.hero.cta_primary_label);
    setText('hero-cta-secondary', data.hero.cta_secondary_label);
  }

  if (data.services_intro) {
    setText('services-kicker', data.services_intro.kicker);
    setText('services-title', data.services_intro.title);
    setText('services-text', data.services_intro.text);
  }

  if (data.work_intro) {
    setText('work-kicker', data.work_intro.kicker);
    setText('work-title', data.work_intro.title);
    setText('work-text', data.work_intro.text);
  }

  if (data.about) {
    const a = data.about;
    setText('about-big-stat', a.big_stat);
    setText('about-stat-label', a.stat_label);
    setText('about-chantier-label', a.chantier_label);
    setText('about-chantier-value', a.chantier_value);
    setText('about-ecran-label', a.ecran_label);
    setText('about-ecran-value', a.ecran_value);
    setText('about-kicker', a.kicker);
    setText('about-title', a.title);
    const wrap = document.getElementById('about-paragraphs');
    if (wrap && Array.isArray(a.paragraphs)) {
      wrap.innerHTML = a.paragraphs.map(p => `<p>${p}</p>`).join('');
    }
  }

  if (data.contact) {
    const c = data.contact;
    setText('contact-kicker', c.kicker);
    setText('contact-title', c.title);
    setText('contact-lead', c.lead);
    const wa = document.getElementById('contact-whatsapp');
    if (wa) {
      if (c.whatsapp_number) wa.href = `https://wa.me/${c.whatsapp_number}`;
      if (c.whatsapp_label) wa.textContent = c.whatsapp_label;
    }
    const email = document.getElementById('contact-email');
    if (email) {
      if (c.email) email.href = `mailto:${c.email}`;
      if (c.email_label) email.textContent = c.email_label;
    }
    const card = document.getElementById('contact-card-rows');
    if (card && Array.isArray(c.card_rows)) {
      card.innerHTML = c.card_rows.map(row =>
        `<div class="row"><span class="k">${row.key}</span><span class="v">${row.value}</span></div>`
      ).join('');
    }
  }

  if (data.footer) {
    setText('footer-copyright', data.footer.copyright);
  }
}

function renderServices(data) {
  const list = document.getElementById('services-list');
  if (!list || !data || !Array.isArray(data.items)) return;
  list.innerHTML = data.items.map(s => `
    <div class="service-row">
      <div>
        <div class="icn">${ICONS[s.icon] || ICONS.web}</div>
        <h3>${s.title}</h3>
        <div class="sub">${s.sub}</div>
      </div>
      <div class="desc">
        <p>${s.desc}</p>
        <ul>${(s.tags || []).map(t => `<li>${t}</li>`).join('')}</ul>
      </div>
    </div>
  `).join('');
}

function renderRealisations(data) {
  const grid = document.getElementById('work-grid');
  if (!grid || !data || !Array.isArray(data.items)) return;
  grid.innerHTML = data.items.map(r => {
    const isFait = r.status === 'fait';
    const badge = `<span class="status-badge ${isFait ? 'fait' : 'en-cours'}">${isFait ? 'Fait' : 'En cours'}</span>`;
    return `
    <div class="work-card">
      <div class="card-top">
        <span class="tag">${r.tag}</span>
        ${badge}
      </div>
      <h3>${r.title}</h3>
      <p>${r.desc}</p>
      <span class="loc">${r.loc}</span>
    </div>
  `;
  }).join('');
}

(async function init() {
  const [site, services, realisations] = await Promise.all([
    loadJSON('data/site.json'),
    loadJSON('data/services.json'),
    loadJSON('data/realisations.json')
  ]);
  renderSite(site);
  renderServices(services);
  renderRealisations(realisations);
})();
