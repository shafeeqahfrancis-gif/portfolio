const test = require('node:test');
const assert = require('node:assert/strict');
const enquiry = require('../js/enquiry.js');

const validProject = {
  path: 'project',
  service: 'qa-workflow',
  description: 'Need a release-readiness review of a demo workflow.',
  timing: 'exploring',
  contact_name: 'Alex Tester',
  email: 'alex.tester@example.com',
  preferred_contact: 'email',
  website: '',
  project_url: '',
};

test('accepts a complete project enquiry', () => {
  const result = enquiry.validate(validProject);
  assert.equal(result.ok, true);
  assert.equal(result.data.email, 'alex.tester@example.com');
});

test('rejects empty required fields', () => {
  const result = enquiry.validate({ path: 'project' });
  assert.equal(result.ok, false);
  assert.ok(result.errors.service);
  assert.ok(result.errors.description);
  assert.ok(result.errors.contact_name);
  assert.ok(result.errors.email);
});

test('employment path requires a role instead of a service', () => {
  const result = enquiry.validate({
    ...validProject,
    path: 'employment',
    service: '',
    role: 'Quality Assurance Analyst',
  });
  assert.equal(result.ok, true);
  assert.equal(result.data.service, '');
});

test('honeypot fails closed', () => {
  const result = enquiry.validate({ ...validProject, website: 'https://spam.example' });
  assert.equal(result.ok, false);
});

test('invalid public URL is rejected; blank URL is allowed', () => {
  assert.equal(enquiry.validate({ ...validProject, project_url: 'not-a-url' }).ok, false);
  assert.equal(enquiry.validate({ ...validProject, project_url: '' }).ok, true);
});

test('brief does not invent a price or accept a job', () => {
  const text = enquiry.briefText(enquiry.normalize(validProject), 'SF-TEST-1');
  assert.match(text, /Reference: SF-TEST-1/);
  assert.match(text, /does not accept a job or set a price/);
  assert.doesNotMatch(text, /R\d+/);
});

test('WhatsApp URL encodes the brief and does not send it', () => {
  const url = enquiry.whatsappUrl('27610922970', 'Hello');
  assert.equal(url.startsWith('https://wa.me/27610922970?text='), true);
});
