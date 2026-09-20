(function () {
  const SITE = window.SF_SITE;
  if (!SITE) return;

  const scriptEl = document.querySelector('script[src*="js/site.js"]');
  const ROOT = new URL('../', new URL(scriptEl ? scriptEl.src : './js/site.js', document.baseURI));
  const pageId = document.body?.dataset.page || 'public';
  const params = new URLSearchParams(location.search);
  const isSynthetic = params.get('synthetic') === '1' || sessionStorage.getItem('sf-synthetic') === '1';
  if (params.get('synthetic') === '1') sessionStorage.setItem('sf-synthetic', '1');

  const yearNodes = document.querySelectorAll('#year, [data-year]');
  yearNodes.forEach((node) => { node.textContent = String(new Date().getFullYear()); });

  function url(path) {
    return new URL(path.replace(/^\//, ''), ROOT).href;
  }

  function pageContext() {
    const title = document.title.replace(/\s+\|.*/, '');
    const caseId = params.get('id');
    if (pageId === 'case-study' && caseId) return `case study ${caseId}`;
    if (pageId === 'case-collection') return 'the case-study collection';
    if (pageId === 'enquire') return 'the enquiry form';
    if (pageId === 'resources') return 'the resources page';
    if (pageId === 'privacy') return 'the privacy page';
    if (pageId === 'work-sample') return title || 'a work sample';
    return title || 'the portfolio home page';
  }

  function waMessage() {
    return [
      `Hello Shafeeqah, I am writing from ${pageContext()} on your public portfolio.`,
      `Page: ${location.href.split('#')[0]}`,
      'I would like to discuss a QA/operations enquiry or an employment conversation.',
    ].join('\n');
  }

  function track(eventType, extra) {
    const consent = localStorage.getItem(SITE.consentStorageKey);
    if (consent === 'denied') return;
    const payload = {
      site_id: SITE.siteId,
      event_name: eventType,
      path: location.pathname.replace(/index\.html$/, ''),
      page_id: pageId,
      resource_key: extra?.case_study_id || extra?.affiliate || params.get('id') || pageId,
      idempotency_key: (crypto.randomUUID && crypto.randomUUID()) || String(Date.now()),
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      is_synthetic: isSynthetic,
      // No names, emails, phones, or form contents.
    };
    fetch(`${SITE.supabaseUrl}${SITE.eventFunctionPath}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        apikey: SITE.supabaseAnonKey,
        authorization: `Bearer ${SITE.supabaseAnonKey}`,
      },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }

  function setTheme(mode) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = mode === 'dark' || (mode !== 'light' && prefersDark) ? 'dark' : 'light';
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themeMode = mode;
    localStorage.setItem(SITE.themeStorageKey, mode);
    document.querySelectorAll('[data-theme-option]').forEach((button) => {
      const active = button.getAttribute('data-theme-option') === mode;
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function renderChrome() {
    const headerHost = document.getElementById('site-chrome-header');
    const footerHost = document.getElementById('site-chrome-footer');
    const nav = [
      ['index.html#about', 'Profile'],
      ['index.html#capabilities', 'Capabilities'],
      ['index.html#projects', 'Work samples'],
      ['case-studies/', 'Case studies'],
      ['resources.html', 'Resources'],
      ['enquire.html', 'Enquire', 'nav-cta'],
    ];
    if (headerHost) {
      headerHost.innerHTML = `
        <header class="site-header">
          <a class="brand" href="${url('index.html')}" aria-label="Shafeeqah Francis home">
            <img class="brand-portrait" src="${url(SITE.portraitSrc)}" width="38" height="38" alt="" />
            <span>Shafeeqah Francis</span>
          </a>
          <div class="header-tools">
            <div class="theme-control" role="group" aria-label="Colour theme">
              <button type="button" data-theme-option="light">Light</button>
              <button type="button" data-theme-option="dark">Dark</button>
              <button type="button" data-theme-option="system">System</button>
            </div>
            <div class="header-share">
              <button type="button" aria-expanded="false" aria-controls="header-share-panel">Share</button>
              <div class="share-panel" id="header-share-panel" hidden></div>
            </div>
            <button class="menu-button" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
          </div>
          <nav id="site-nav" aria-label="Primary navigation">
            ${nav.map(([href, label, cls]) => `<a class="${cls || ''}" href="${url(href)}">${label}</a>`).join('')}
          </nav>
        </header>`;
    }
    if (footerHost) {
      footerHost.innerHTML = `
        <footer class="site-footer">
          <div>
            <p>© <span data-year></span> Shafeeqah Francis</p>
            <p>Quality assurance · Compliance · Operations</p>
          </div>
          <nav aria-label="Footer">
            <a href="${SITE.linkedinUrl}" target="_blank" rel="noopener" data-track="linkedin_click">LinkedIn</a>
            <a href="${url('enquire.html')}" data-track="enquiry_start">Enquire</a>
            <a href="${url('privacy.html')}">Privacy</a>
            <a href="${url('resources.html')}">Resources</a>
            <a href="https://wa.me/${SITE.whatsappE164}" data-track="whatsapp_click" data-wa="footer">WhatsApp ${SITE.whatsappDisplay}</a>
          </nav>
        </footer>
        <div class="page-share no-print" id="page-share"></div>`;
    }
    document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = String(new Date().getFullYear()); });
    setTheme(localStorage.getItem(SITE.themeStorageKey) || 'system');
  }

  function bindChrome() {
    const menuButton = document.querySelector('.menu-button');
    const navigation = document.querySelector('#site-nav');
    menuButton?.addEventListener('click', () => {
      const open = navigation.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    navigation?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navigation.classList.remove('open');
        menuButton?.setAttribute('aria-expanded', 'false');
      });
    });
    document.querySelectorAll('[data-theme-option]').forEach((button) => {
      button.addEventListener('click', () => setTheme(button.getAttribute('data-theme-option')));
    });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if ((localStorage.getItem(SITE.themeStorageKey) || 'system') === 'system') setTheme('system');
    });
    const shareToggle = document.querySelector('.header-share > button');
    const sharePanel = document.querySelector('#header-share-panel');
    shareToggle?.addEventListener('click', () => {
      const open = sharePanel.hidden;
      sharePanel.hidden = !open;
      shareToggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (event) => {
      if (!sharePanel || sharePanel.hidden) return;
      if (event.target.closest('.header-share')) return;
      sharePanel.hidden = true;
      shareToggle?.setAttribute('aria-expanded', 'false');
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && sharePanel && !sharePanel.hidden) {
        sharePanel.hidden = true;
        shareToggle?.setAttribute('aria-expanded', 'false');
        shareToggle?.focus();
      }
    });
  }

  function currentShare() {
    const title = document.title;
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
    const pageUrl = canonical || location.href.split('#')[0];
    return { title, summary: description, url: pageUrl };
  }

  function renderShare() {
    if (!window.SFShare) return;
    const payload = currentShare();
    window.SFShare.mount(document.getElementById('header-share-panel'), { ...payload, compact: true });
    window.SFShare.mount(document.getElementById('page-share'), payload);
    window.SFShare.mount(document.getElementById('home-share'), payload);
  }

  function renderWhatsApp() {
    if (document.querySelector('.wa-float')) return;
    const link = document.createElement('a');
    link.className = 'wa-float';
    link.href = `https://wa.me/${SITE.whatsappE164}?text=${encodeURIComponent(waMessage())}`;
    link.target = '_blank';
    link.rel = 'noopener';
    link.dataset.track = 'whatsapp_click';
    link.dataset.wa = 'float';
    link.setAttribute('aria-label', `WhatsApp Shafeeqah about ${pageContext()}`);
    link.innerHTML = '<span aria-hidden="true">WA</span><span class="wa-float-label">WhatsApp</span>';
    document.body.appendChild(link);
  }

  function renderConsent() {
    if (localStorage.getItem(SITE.consentStorageKey) || document.querySelector('.consent-banner')) return;
    const banner = document.createElement('div');
    banner.className = 'consent-banner';
    banner.innerHTML = `
      <p>This site records page and button events to understand public use. It does not send form contents, names, phone numbers or emails in those events.</p>
      <div>
        <button type="button" data-consent="granted">Allow analytics events</button>
        <button type="button" class="secondary" data-consent="denied">Decline</button>
      </div>`;
    document.body.appendChild(banner);
    banner.addEventListener('click', (event) => {
      const choice = event.target.getAttribute?.('data-consent');
      if (!choice) return;
      localStorage.setItem(SITE.consentStorageKey, choice);
      banner.remove();
      if (choice === 'granted') track('page_view');
    });
  }

  function bindTracking() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('[data-track]');
      if (!target) return;
      const extra = {};
      if (target.dataset.affiliate) extra.affiliate = target.dataset.affiliate;
      if (target.dataset.case) extra.case_study_id = target.dataset.case;
      track(target.dataset.track, extra);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

  renderChrome();
  bindChrome();
  renderShare();
  renderWhatsApp();
  renderConsent();
  bindTracking();
  if (localStorage.getItem(SITE.consentStorageKey) === 'granted') track('page_view');
  else if (!localStorage.getItem(SITE.consentStorageKey) && !document.querySelector('.consent-banner')) track('page_view');

  window.SFSite = { url, track, waMessage, isSynthetic, pageContext, setTheme, renderShare, currentShare };
})();
