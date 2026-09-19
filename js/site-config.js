/**
 * Public site configuration only. No service-role keys.
 * Theme is applied immediately to avoid a light/dark flash.
 */
(function (global) {
  const SITE = Object.freeze({
    siteId: 'shafeeqah-portfolio',
    displayName: 'Shafeeqah Francis',
    linkedinUrl: 'https://www.linkedin.com/in/shafeeqa-francis-465984211/',
    githubUrl: 'https://github.com/shafeeqahfrancis-gif',
    whatsappDisplay: '+27 61 092 2970',
    whatsappE164: '27610922970',
    liveOrigin: 'https://shafeeqahfrancis-gif.github.io',
    supabaseUrl: 'https://sijvvbozaufzpjirijhb.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpanZ2Ym96YXVmenBqaXJpamhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMzY3NTMsImV4cCI6MjEwMDkxMjc1M30.MPHqlZuOySK56JZh_OBpFe79I-V0Zy6puI_Kw7bcx8Q',
    enquiryFunctionPath: '/functions/v1/submit-shafeeqah-enquiry',
    eventFunctionPath: '/functions/v1/record-shafeeqah-event',
    privacyVersion: '2026-09-19',
    themeStorageKey: 'sf-theme',
    consentStorageKey: 'sf-analytics-consent',
    portraitSrc: 'assets/shafeeqah-francis-portrait-100x100.jpeg',
    portraitWidth: 100,
    portraitHeight: 100,
    portraitAlt: 'Portrait of Shafeeqah Francis, quality assurance and operations professional',
    affiliates: Object.freeze({
      make: 'https://www.make.com/en/register?pc=nextgenwebs2026',
      systeme: 'https://systeme.io/?sa=sa0281022468eb30b58bf030d6588013c2783110a0',
      elevenlabs: 'https://try.elevenlabs.io/fb6nmetrrxow',
      deriv: 'https://t.deriv.link?t=VQGBGPUYGJDZ',
    }),
  });

  try {
    const mode = localStorage.getItem(SITE.themeStorageKey) || 'system';
    const prefersDark = global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = mode === 'dark' || (mode !== 'light' && prefersDark) ? 'dark' : 'light';
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themeMode = mode;
  } catch (error) {
    document.documentElement.dataset.theme = 'light';
    document.documentElement.dataset.themeMode = 'system';
  }

  global.SF_SITE = SITE;
})(typeof window !== 'undefined' ? window : globalThis);
