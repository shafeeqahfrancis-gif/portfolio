/**
 * Share helpers for the public portfolio. Browser + Node.
 * LinkedIn/Facebook unfurl OG tags; X/WhatsApp also carry a written brief.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SFShare = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const LIVE_BASE = 'https://shafeeqahfrancis-gif.github.io/portfolio/';

  function canonicalUrl(path) {
    if (!path) return LIVE_BASE;
    if (/^https?:/i.test(path)) return path.split('#')[0];
    const clean = String(path).replace(/^\//, '').replace(/index\.html$/, '');
    return new URL(clean, LIVE_BASE).href;
  }

  function shareText(title, summary) {
    const bits = [title, summary].filter(Boolean).map((value) => String(value).trim());
    return bits.join(' — ');
  }

  function linkedInPost(title, summary, url) {
    return [
      title,
      '',
      summary,
      '',
      'This is a demonstration from my QA and operations portfolio, not a client engagement.',
      url,
    ].join('\n');
  }

  function links(url, title, summary) {
    const page = canonicalUrl(url);
    const text = shareText(title, summary);
    const encodedUrl = encodeURIComponent(page);
    const encodedText = encodeURIComponent(text);
    const encodedBoth = encodeURIComponent(`${text}\n${page}`);
    return {
      url: page,
      text,
      post: linkedInPost(title, summary, page),
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedBoth}`,
      email: `mailto:?subject=${encodeURIComponent(title || 'Shafeeqah Francis portfolio')}&body=${encodedBoth}`,
    };
  }

  function setMeta(name, content, property) {
    if (typeof document === 'undefined' || !content) return;
    const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
    let node = document.head.querySelector(selector);
    if (!node) {
      node = document.createElement('meta');
      if (property) node.setAttribute('property', property);
      else node.setAttribute('name', name);
      document.head.appendChild(node);
    }
    node.setAttribute('content', content);
  }

  function applyPageMeta({ title, description, url, image, imageAlt }) {
    if (typeof document === 'undefined') return;
    if (title) document.title = title;
    setMeta('description', description);
    setMeta(null, title, 'og:title');
    setMeta(null, description, 'og:description');
    setMeta(null, url, 'og:url');
    setMeta(null, image, 'og:image');
    setMeta(null, imageAlt || title, 'og:image:alt');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }

  function barMarkup(prefix, urls, compact) {
    const native = compact ? '' : '<button type="button" class="share-native" data-share-native hidden>Device</button>';
    return `
      <div class="share-bar${compact ? ' compact' : ''}" data-share-root="${prefix}">
        <p class="share-label">${compact ? 'Share' : 'Share this page'}</p>
        <div class="share-actions">
          ${native}
          <a class="share-btn" data-share-network="linkedin" href="${urls.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
          <a class="share-btn" data-share-network="x" href="${urls.x}" target="_blank" rel="noopener">X</a>
          <a class="share-btn" data-share-network="facebook" href="${urls.facebook}" target="_blank" rel="noopener">Facebook</a>
          <a class="share-btn" data-share-network="whatsapp" href="${urls.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>
          <a class="share-btn" data-share-network="email" href="${urls.email}">Email</a>
          <button type="button" class="share-btn" data-share-copy="link">Copy link</button>
          <button type="button" class="share-btn" data-share-copy="post">Copy LinkedIn text</button>
        </div>
        <p class="share-status" role="status"></p>
      </div>`;
  }

  function bindBar(root, urls, title) {
    if (!root) return;
    const status = root.querySelector('.share-status');
    const native = root.querySelector('[data-share-native]');
    if (native && typeof navigator !== 'undefined' && navigator.share) {
      native.hidden = false;
      native.addEventListener('click', async () => {
        try {
          await navigator.share({ title, text: urls.text, url: urls.url });
          if (window.SFSite) window.SFSite.track('share_click', { affiliate: 'native' });
        } catch (error) { /* cancelled */ }
      });
    }
    root.querySelectorAll('[data-share-network]').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.SFSite) window.SFSite.track('share_click', { affiliate: link.dataset.shareNetwork });
      });
    });
    root.querySelectorAll('[data-share-copy]').forEach((button) => {
      button.addEventListener('click', async () => {
        const kind = button.getAttribute('data-share-copy');
        const value = kind === 'post' ? urls.post : urls.url;
        try {
          await navigator.clipboard.writeText(value);
          if (status) status.textContent = kind === 'post' ? 'LinkedIn text copied.' : 'Link copied.';
          if (window.SFSite) window.SFSite.track('share_click', { affiliate: kind === 'post' ? 'copy_post' : 'copy_link' });
        } catch (error) {
          if (status) status.textContent = 'Copy was blocked. Select the link and copy it manually.';
        }
      });
    });
  }

  function mount(host, { url, title, summary, compact }) {
    if (!host) return;
    const urls = links(url, title, summary);
    host.innerHTML = barMarkup(url, urls, compact);
    bindBar(host, urls, title);
  }

  return { LIVE_BASE, canonicalUrl, shareText, linkedInPost, links, applyPageMeta, mount };
});
