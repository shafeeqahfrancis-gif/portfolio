/**
 * Enquiry validation and brief helpers. Browser + Node.
 * Does not invent pricing or treat a WhatsApp click as a saved enquiry.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SFEnquiry = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const SERVICES = [
    { id: 'qa-workflow', label: 'QA and workflow reviews' },
    { id: 'sop-docs', label: 'SOP and process documentation' },
    { id: 'data-quality', label: 'Data-quality / spreadsheet reviews' },
    { id: 'reporting', label: 'Reporting and issue tracking' },
    { id: 'release-readiness', label: 'Release-readiness reviews' },
    { id: 'define-project', label: 'Help defining a project' },
  ];
  const TIMING = [
    { id: 'exploring', label: 'Exploring options' },
    { id: 'one-month', label: 'Within one month' },
    { id: 'this-month', label: 'This month' },
    { id: 'flexible', label: 'Flexible / not sure' },
  ];
  const PATHS = [
    { id: 'project', label: 'Project / service enquiry' },
    { id: 'employment', label: 'Employment / interview enquiry' },
  ];
  const CONTACT_METHODS = [
    { id: 'email', label: 'Email' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'either', label: 'Either' },
  ];

  const strip = (value, max) => {
    if (typeof value !== 'string') return '';
    return value.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').slice(0, max);
  };
  const emailOk = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const urlOk = (value) => {
    if (!value) return true;
    try {
      const parsed = new URL(value);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  function labels() {
    return { SERVICES, TIMING, PATHS, CONTACT_METHODS };
  }

  function labelFor(list, id) {
    return (list.find((item) => item.id === id) || {}).label || id || '';
  }

  function normalize(input) {
    const path = input.path === 'employment' ? 'employment' : input.path === 'project' ? 'project' : '';
    return {
      path,
      service: path === 'project' ? strip(input.service, 80) : '',
      role: path === 'employment' ? strip(input.role, 120) : '',
      description: strip(input.description, 1500),
      timing: strip(input.timing, 40),
      budget: strip(input.budget, 80),
      project_url: strip(input.project_url, 500),
      contact_name: strip(input.contact_name, 120),
      email: strip(input.email, 254).toLowerCase(),
      phone: strip(input.phone, 40),
      preferred_contact: strip(input.preferred_contact, 20),
      website: strip(input.website, 200),
      idempotency_key: strip(input.idempotency_key, 80),
      privacy_version: strip(input.privacy_version, 40),
      source_path: strip(input.source_path, 300),
      utm_source: strip(input.utm_source, 150),
      utm_medium: strip(input.utm_medium, 150),
      utm_campaign: strip(input.utm_campaign, 150),
      is_synthetic: Boolean(input.is_synthetic),
    };
  }

  function validate(input) {
    const data = normalize(input);
    const errors = {};
    if (data.website) errors.form = 'Unable to submit.';
    if (!data.path) errors.path = 'Choose whether this is a project enquiry or an employment enquiry.';
    if (data.path === 'project' && !SERVICES.some((item) => item.id === data.service)) {
      errors.service = 'Choose the service that best matches the work.';
    }
    if (data.path === 'employment' && data.role.length < 2) {
      errors.role = 'Add the role or type of opportunity.';
    }
    if (data.description.length < 12) errors.description = 'Add a short description of the work or role.';
    if (!TIMING.some((item) => item.id === data.timing)) errors.timing = 'Choose a timing option.';
    if (!urlOk(data.project_url)) errors.project_url = 'Use a full http(s) link, or leave this blank.';
    if (data.contact_name.length < 2) errors.contact_name = 'Add your name.';
    if (!emailOk(data.email)) errors.email = 'Add a valid email address.';
    if (data.phone && data.phone.length < 8) errors.phone = 'Check the phone number, or leave it blank.';
    if (!CONTACT_METHODS.some((item) => item.id === data.preferred_contact)) {
      errors.preferred_contact = 'Choose a preferred contact method.';
    }
    return { ok: Object.keys(errors).length === 0, errors, data };
  }

  function briefText(data, reference) {
    const serviceLine = data.path === 'employment'
      ? `Role: ${data.role}`
      : `Service: ${labelFor(SERVICES, data.service)}`;
    const lines = [
      'Shafeeqah Francis enquiry',
      reference ? `Reference: ${reference}` : 'Reference: pending save',
      `Path: ${labelFor(PATHS, data.path)}`,
      serviceLine,
      `Timing: ${labelFor(TIMING, data.timing)}`,
      data.budget ? `Budget note: ${data.budget}` : 'Budget: not provided',
      data.project_url ? `Public link: ${data.project_url}` : 'Public link: none',
      '',
      'Description:',
      data.description,
      '',
      `Name: ${data.contact_name}`,
      `Email: ${data.email}`,
      data.phone ? `Phone: ${data.phone}` : 'Phone: not provided',
      `Preferred contact: ${labelFor(CONTACT_METHODS, data.preferred_contact)}`,
      '',
      'Scope, availability and any quotation are agreed after review. This message does not accept a job or set a price.',
    ];
    return lines.join('\n');
  }

  function whatsappUrl(e164, text) {
    return `https://wa.me/${e164}?text=${encodeURIComponent(text)}`;
  }

  return { SERVICES, TIMING, PATHS, CONTACT_METHODS, normalize, validate, briefText, whatsappUrl, labelFor };
});
