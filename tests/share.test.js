const test = require('node:test');
const assert = require('node:assert/strict');
const share = require('../js/share.js');

test('canonical URLs stay on the public GitHub Pages origin', () => {
  assert.equal(share.canonicalUrl('case-studies/quote-calculator.html'), 'https://shafeeqahfrancis-gif.github.io/portfolio/case-studies/quote-calculator.html');
  assert.equal(share.canonicalUrl('https://example.com/x'), 'https://example.com/x');
});

test('share links include the page URL and do not invent results', () => {
  const links = share.links('case-studies/quote-calculator.html', 'Quote Calculator Rules', 'Synthetic fixtures only.');
  assert.match(links.linkedin, /linkedin\.com\/sharing\/share-offsite\/\?url=/);
  assert.match(links.x, /text=Quote%20Calculator/);
  assert.match(links.whatsapp, /wa\.me\/\?text=/);
  assert.match(links.post, /not a client engagement/);
  assert.doesNotMatch(links.post, /revenue|hired|% conversion/i);
});
