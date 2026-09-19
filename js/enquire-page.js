(function () {
  const SITE = window.SF_SITE;
  const enquiry = window.SFEnquiry;
  if (!SITE || !enquiry || !document.getElementById('enquiry-form')) return;

  const form = document.getElementById('enquiry-form');
  const steps = [...form.querySelectorAll('.form-step')];
  const indicators = [...document.querySelectorAll('.step-list li')];
  const statusEl = document.getElementById('form-status');
  const reviewList = document.getElementById('review-list');
  const successPanel = document.getElementById('success-panel');
  const failPanel = document.getElementById('fail-panel');
  let current = 0;
  let lastData = null;
  let lastReference = null;
  const params = new URLSearchParams(location.search);
  const storageKey = 'sf-enquiry-draft';

  function idempotencyKey() {
    const existing = sessionStorage.getItem('sf-enquiry-idemp');
    if (existing) return existing;
    const key = (crypto.randomUUID && crypto.randomUUID()) || `sf-${Date.now()}`;
    sessionStorage.setItem('sf-enquiry-idemp', key);
    return key;
  }

  function showStep(index) {
    current = Math.max(0, Math.min(steps.length - 1, index));
    steps.forEach((step, i) => { step.hidden = i !== current; });
    indicators.forEach((item, i) => item.classList.toggle('active', i === current));
    document.getElementById('previous-step').hidden = current === 0;
    document.getElementById('next-step').hidden = current === steps.length - 1;
    document.getElementById('submit-enquiry').hidden = current !== steps.length - 1;
  }

  function collect() {
    const data = new FormData(form);
    return {
      path: data.get('path') || '',
      service: data.get('service') || '',
      role: data.get('role') || '',
      description: data.get('description') || '',
      timing: data.get('timing') || '',
      budget: data.get('budget') || '',
      project_url: data.get('project_url') || '',
      contact_name: data.get('contact_name') || '',
      email: data.get('email') || '',
      phone: data.get('phone') || '',
      preferred_contact: data.get('preferred_contact') || '',
      website: data.get('website') || '',
      idempotency_key: idempotencyKey(),
      privacy_version: SITE.privacyVersion,
      source_path: location.pathname.replace(/index\.html$/, ''),
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      is_synthetic: Boolean(window.SFSite?.isSynthetic),
    };
  }

  function syncPathFields() {
    const path = form.path.value;
    document.getElementById('project-fields').hidden = path !== 'project';
    document.getElementById('employment-fields').hidden = path !== 'employment';
    form.service.required = path === 'project';
    form.role.required = path === 'employment';
  }

  function renderReview(data) {
    const rows = [
      ['Path', enquiry.labelFor(enquiry.PATHS, data.path)],
      [data.path === 'employment' ? 'Role' : 'Service', data.path === 'employment' ? data.role : enquiry.labelFor(enquiry.SERVICES, data.service)],
      ['Timing', enquiry.labelFor(enquiry.TIMING, data.timing)],
      ['Budget note', data.budget || 'Not provided'],
      ['Public link', data.project_url || 'None'],
      ['Description', data.description],
      ['Name', data.contact_name],
      ['Email', data.email],
      ['Phone', data.phone || 'Not provided'],
      ['Preferred contact', enquiry.labelFor(enquiry.CONTACT_METHODS, data.preferred_contact)],
    ];
    reviewList.innerHTML = rows.map(([label, value]) => `<li><span>${label}</span>${escapeHtml(value)}</li>`).join('');
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }

  function showErrors(errors) {
    form.querySelectorAll('.field-error').forEach((node) => { node.textContent = ''; });
    Object.entries(errors).forEach(([field, message]) => {
      const node = form.querySelector(`[data-error="${field}"]`);
      if (node) node.textContent = message;
    });
  }

  function persist() {
    sessionStorage.setItem(storageKey, JSON.stringify(collect()));
  }

  function restore() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
      if (!saved) return;
      Object.entries(saved).forEach(([key, value]) => {
        if (form.elements[key] && value) form.elements[key].value = value;
      });
      syncPathFields();
    } catch (error) {
      /* keep the blank form */
    }
  }

  function briefActions(data, reference, saved) {
    const text = enquiry.briefText(data, reference);
    const wa = enquiry.whatsappUrl(SITE.whatsappE164, text);
    document.querySelectorAll('[data-copy-brief]').forEach((button) => {
      button.onclick = async () => {
        await navigator.clipboard.writeText(text);
        button.textContent = 'Brief copied';
      };
    });
    document.querySelectorAll('[data-download-brief]').forEach((button) => {
      button.onclick = () => {
        const blob = new Blob([text], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${reference || 'enquiry-brief'}.txt`;
        link.click();
      };
    });
    document.querySelectorAll('[data-open-whatsapp]').forEach((link) => {
      link.href = wa;
      link.onclick = () => window.SFSite?.track('whatsapp_click');
    });
    const note = document.getElementById('whatsapp-send-note');
    if (note) {
      note.textContent = saved
        ? 'Opening WhatsApp prepares a message. It does not send it, and it is not a substitute for the saved enquiry.'
        : 'The enquiry was not saved. You can still open WhatsApp with this brief as a fallback.';
    }
  }

  form.addEventListener('change', () => {
    syncPathFields();
    persist();
  });
  form.addEventListener('input', persist);

  document.getElementById('next-step').addEventListener('click', () => {
    const result = enquiry.validate(collect());
    const needed = current === 0 ? ['path'] : current === 1 ? ['service', 'role', 'description', 'timing', 'project_url'] : ['contact_name', 'email', 'phone', 'preferred_contact'];
    const stepErrors = Object.fromEntries(Object.entries(result.errors).filter(([key]) => needed.includes(key)));
    showErrors(stepErrors);
    if (Object.keys(stepErrors).length) return;
    if (current === 2) renderReview(result.data);
    showStep(current + 1);
  });
  document.getElementById('previous-step').addEventListener('click', () => showStep(current - 1));
  document.getElementById('edit-review').addEventListener('click', () => showStep(0));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const result = enquiry.validate(collect());
    showErrors(result.errors);
    if (!result.ok) {
      statusEl.className = 'form-status error';
      statusEl.textContent = 'Please check the highlighted fields.';
      return;
    }
    lastData = result.data;
    const button = document.getElementById('submit-enquiry');
    button.disabled = true;
    statusEl.className = 'form-status';
    statusEl.textContent = 'Saving your enquiry…';
    window.SFSite?.track('enquiry_start');
    try {
      const response = await fetch(`${SITE.supabaseUrl}${SITE.enquiryFunctionPath}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          apikey: SITE.supabaseAnonKey,
          authorization: `Bearer ${SITE.supabaseAnonKey}`,
        },
        body: JSON.stringify(result.data),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Save failed');
      lastReference = payload.reference || payload.submission_id;
      sessionStorage.removeItem('sf-enquiry-idemp');
      sessionStorage.removeItem(storageKey);
      form.hidden = true;
      failPanel.hidden = true;
      successPanel.hidden = false;
      document.getElementById('saved-reference').textContent = lastReference;
      briefActions(result.data, lastReference, true);
      window.SFSite?.track('enquiry_saved');
      statusEl.textContent = '';
    } catch (error) {
      statusEl.className = 'form-status error';
      statusEl.textContent = 'We could not save this enquiry. Your answers are still here. You can retry or use WhatsApp as a fallback.';
      failPanel.hidden = false;
      briefActions(result.data, null, false);
      button.disabled = false;
    }
  });

  restore();
  syncPathFields();
  showStep(0);
  window.SFSite?.track('enquiry_start');
})();
