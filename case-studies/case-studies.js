const REVIEW_DATE = '18 September 2026';
const SCALE = '0 absent/untested · 1 materially incomplete · 2 partly effective · 3 usable with small gaps · 4 clearly evidenced and repeatable';

const cases = [
  {
    id: 'member-upload-onboarding', number: '01', title: 'Member Upload & Onboarding Review',
    summary: 'A source-based review of a health-adjacent member upload journey, focusing on format guidance, step continuity, consent prompts and support handoff.',
    industry: 'Health-adjacent technology', skills: ['Workflow QA', 'Documentation', 'Issue tracking'], score: 54,
    context: 'Members need to understand what to upload, what happens next and where to recover when a scan cannot be accepted. The review objective was to test whether the public-facing instructions and visible workflow communicate that journey consistently.',
    scope: ['Static source review of the member CBCT upload page and the newer scan-upload wizard', 'Copy, accepted-format messaging, step numbering, validation guidance and recovery language', 'No uploads, accounts, health records, AI analysis or live storage were used'],
    limitations: 'This was a non-clinical, source-level usability review. It did not validate diagnosis, privacy compliance, production permissions, server configuration or the live member experience.',
    checklist: ['Compare introductory copy, file-picker allow-list and processing logic', 'Trace the visible step number and destination after success', 'Check size/type guidance before submission', 'Confirm consent and recovery messages are visible in the reviewed flow', 'Record only source-verifiable observations'],
    scorecard: [['Instruction consistency',25,2],['Input guidance',20,2],['Journey continuity',20,1],['Consent visibility',20,3],['Recovery support',15,3]],
    tests: [
      ['MU-01','Compare formats named in the heading, drop-zone and picker','The same supported formats are described everywhere','Observed mismatch: intro names DICOM while the picker names PDF/JPG/PNG/ZIP','Verified'],
      ['MU-02','Trace success-step copy','Current and next step numbers should be sequential','Page says Step 3 of 5 but success copy directs the user to Step 5','Verified'],
      ['MU-03','Check pre-upload limits','Users should see applicable size limits before upload','No file-size guidance was found on the reviewed CBCT page','Verified'],
      ['MU-04','Attempt rejected upload and recovery','A safe test file should receive actionable guidance','Not executed; no live upload or account access was used','Not run']
    ],
    issues: [
      ['MU-I01','Verified','High','Accepted-format copy is inconsistent across the same page','Align the intro, picker and processing rules to one approved list.'],
      ['MU-I02','Verified','Medium','Visible step numbering skips from Step 3 to Step 5','Confirm the intended roadmap and update both labels together.'],
      ['MU-I03','Illustrative','Medium','A rejected upload may leave a member unsure whether to retry or contact support','Validate on a safe test account and add a specific recovery route if reproduced.']
    ],
    recommendations: ['Publish one authoritative upload specification beside the picker', 'Add a preflight checklist covering format, maximum size and support route', 'Run the walkthrough with a designated test account and retain redacted screenshots'],
    sop: ['Confirm the approved file specification with the process owner', 'Prepare non-sensitive valid, invalid-type and over-limit fixtures', 'Record page/version and expected outcome before testing', 'Execute without real member data and redact any identifiers', 'Log the result, owner, priority and retest evidence'],
    evidence: ['Public source snapshot: Iedereesfrancis1987/raversus-v3, commit 5ada047', 'Reviewed paths: cbct-upload.html and js/tooth-chart/upload.js'],
    walkthrough: ['Explain the difference between a source observation and a live finding', 'Re-run MU-01 to MU-03 and annotate screenshots without personal data', 'Ask the owner to confirm the authoritative format/step rules', 'Draft revised helper copy and an error-escalation path', 'Record your name, review date and contribution only after completing the checks'],
    download: 'member-upload-review.csv'
  },
  {
    id: 'parts-inventory-data-quality', number: '02', title: 'Parts Inventory Data-Quality Review',
    summary: 'A completeness, uniqueness and reconciliation framework for a browser-based parts register and multi-location stock records.',
    industry: 'Inventory & operations', skills: ['Data quality', 'Reconciliation', 'Root-cause analysis'], score: 52,
    context: 'An inventory record is useful only when part identifiers, stock locations and adjustment history remain complete and reconcilable. The objective was to assess the demo data model and identify controls needed before operational use.',
    scope: ['Static review of the public HTML/JavaScript demo at commit 34826ee', 'Part creation/editing, SKU handling, location quantities, stock adjustment history and bulk-image matching', 'Synthetic browser data only; no warehouse or production records'],
    limitations: 'The application identifies itself as a localStorage demonstration. The review does not treat it as a deployed stock-control system and did not test multi-user concurrency or a backend database.',
    checklist: ['Define mandatory part and stock fields', 'Check identifier uniqueness controls', 'Check numeric boundaries and reorder relationships', 'Trace an adjustment into history', 'Define a count-to-system reconciliation method'],
    scorecard: [['Field completeness',20,3],['Identifier integrity',25,1],['Stock validation',25,2],['Audit trail',20,3],['Reconciliation readiness',10,1]],
    tests: [
      ['PI-01','Inspect required part fields','SKU, name and manufacturer should be mandatory','All three inputs use the required attribute','Verified'],
      ['PI-02','Inspect duplicate-SKU prevention','A second record with the same normalized SKU should be blocked','No duplicate-SKU check was found in addNewPart or updatePart','Verified'],
      ['PI-03','Inspect negative stock input','Stock and threshold inputs should reject negative values','Inputs declare min=0 and parsed values default to zero','Verified'],
      ['PI-04','Reconcile a physical count to system stock','Variance and approval evidence should be retained','Procedure designed below; not executed against real stock','Illustrative']
    ],
    issues: [
      ['PI-I01','Verified','High','SKU uniqueness is not enforced in the reviewed demo logic','Normalize and block duplicates before save; add a duplicate report.'],
      ['PI-I02','Verified','Medium','Reorder point can be lower than minimum level with no relationship check','Define the rule and validate it on create/edit.'],
      ['PI-I03','Illustrative','Medium','Browser-only storage can create divergent copies between users','Before operational use, define a single controlled data source and access model.']
    ],
    recommendations: ['Add uniqueness and cross-field validation before persistence', 'Use a variance log with counted quantity, system quantity, reason, owner and approval', 'Measure completeness, duplicate rate, unexplained variance and overdue corrections'],
    sop: ['Freeze movements for the count window', 'Export the approved stock snapshot', 'Count by SKU and location using two-person verification for material variances', 'Calculate variance and classify the likely cause', 'Approve adjustments and retain the before/after evidence'],
    evidence: ['Public source snapshot: iederees-create/Parts-Inventory, commit 34826ee', 'Reviewed path: index.html; README confirms browser localStorage demo scope'],
    walkthrough: ['Create a 10-row synthetic inventory fixture', 'Apply the completeness and duplicate rules', 'Reconcile two deliberately mismatched counts', 'Write a concise root-cause statement for each variance', 'Retest corrected records and sign the private reviewer checklist'],
    download: 'parts-inventory-review.csv'
  },
  {
    id: 'enquiry-handover', number: '03', title: 'Enquiry Qualification & Handover Review',
    summary: 'A review of a multi-step business-phone enquiry, its review screen and the operating handoff from inbound request to formal quote.',
    industry: 'Business communications', skills: ['Operations support', 'Workflow QA', 'SOP documentation'], score: 90,
    context: 'Exchange Line needs to collect enough information for a useful follow-up without guessing a phone configuration or treating an enquiry as marketing consent. The objective was to inspect the public workflow and document a controlled handoff.',
    scope: ['Public form structure, client/server validation code and published operations documentation', 'Qualification fields, review step, consent basis, ownership and next-action workflow', 'No live enquiry was submitted and no database/customer records were accessed'],
    limitations: 'Source inspection cannot confirm the deployed Edge Function, email delivery, RLS state, response times or staff adoption. Those items remain owner-run acceptance checks.',
    checklist: ['Trace required fields through the review summary', 'Confirm public wording separates requirements from formal pricing', 'Check that inbound requests are not described as marketing consent', 'Map the owner and next action after submission', 'Define failure and overdue-enquiry escalation'],
    scorecard: [['Input quality',20,4],['Expectation setting',20,4],['Consent clarity',20,4],['Handover controls',25,3],['Failure recovery',15,3]],
    tests: [
      ['EH-01','Inspect required qualification fields','Contact, company, need and response preference should be captured','Required controls and a four-step review screen are present','Verified'],
      ['EH-02','Inspect pricing language','The form should not invent a configuration or price','Copy states requirements are confirmed before a formal quote','Verified'],
      ['EH-03','Inspect consent treatment','Inbound request should remain separate from marketing permission','Privacy copy and operations docs make the separation explicit','Verified'],
      ['EH-04','Submit a live enquiry and verify downstream records','One controlled submission should create the expected handoff records','Not run under safe-review rules','Not run']
    ],
    issues: [
      ['EH-I01','Verified','Low','Outcome checkboxes permit an empty selection','Require at least one outcome or explicitly capture “not sure.”'],
      ['EH-I02','Illustrative','High','A saved enquiry could be missed if notification delivery fails','Use dashboard queues/overdue reporting as the source of truth; test notification failure.'],
      ['EH-I03','Illustrative','Medium','A handoff may stall when next-action ownership is unclear','Report records with no owner, next action or follow-up date.']
    ],
    recommendations: ['Add an explicit unknown option or selection rule for desired outcomes', 'Create daily queue and overdue checks independent of email notification', 'Retain a controlled acceptance-test record after each workflow release'],
    sop: ['Review new and overdue inbound requests', 'Validate requirements; do not infer price or configuration', 'Assign owner, next action and follow-up date', 'Prepare a brief from confirmed information only', 'Close the handoff only when outcome and evidence are recorded'],
    evidence: ['Public source snapshot: iederees-create/exchange-line, commit fa23415', 'Reviewed: index.html, public.js, submit-lead function, OPERATIONS.md and DEPLOYMENT.md'],
    walkthrough: ['Use the synthetic CSV row rather than a real prospect', 'Trace every field from intake to the proposed handoff record', 'Identify which controls are preventive, detective and corrective', 'Role-play an overdue enquiry escalation', 'Document your review decisions in the private checklist'],
    download: 'enquiry-handover-review.csv'
  },
  {
    id: 'digital-guide-release', number: '04', title: 'Digital Download Release-Readiness Review',
    summary: 'A packaging and release checklist for a configurable guest-guide template, including placeholder detection, instructions, links and mobile presentation.',
    industry: 'Digital products & hospitality', skills: ['Release readiness', 'Documentation', 'Content QA'], score: 73,
    context: 'A buyer-facing download must be understandable, editable and safe to publish without accidentally leaving fictional contact details or access codes in place. The objective was to inspect the product structure and define a repeatable release gate.',
    scope: ['Static review of the configurable guest-guide source at commit b3868a8', 'Configuration completeness, placeholder content, page structure, no-index state and release packaging', 'No booking-platform listing, purchase, guest stay or real property information'],
    limitations: 'The sample intentionally contains fictional details. Mobile rendering and buyer comprehension must be repeated for each customized delivery.',
    checklist: ['Search for example names, addresses, codes and phone numbers', 'Check that editable content is centralized and documented', 'Verify all navigation targets and FAQ controls', 'Confirm intended indexing and social metadata', 'Open the final package on phone and desktop before delivery'],
    scorecard: [['Placeholder safety',25,3],['Editability',20,4],['Instructions',20,3],['Navigation/accessibility',20,3],['Release evidence',15,1]],
    tests: [
      ['DG-01','Inspect configuration separation','Buyer-editable content should live in one clear file','Content is centralized in site-config.js with editing guidance','Verified'],
      ['DG-02','Search sample for fictional access/contact data','Placeholders should be unmistakable and replaced before release','Example address, lockbox code, Wi-Fi and phone values are present by design','Verified'],
      ['DG-03','Inspect indexing default','Uncustomized sample should not be indexed as a real property','index.html includes noindex','Verified'],
      ['DG-04','Complete buyer-package link and device pass','All packaged files and instructions should work after extraction','Planned; not executed against a final buyer ZIP','Not run']
    ],
    issues: [
      ['DG-I01','Verified','High','The editable sample includes fictional access codes and contact details','Make placeholder replacement a blocking release check.'],
      ['DG-I02','Verified','Medium','No machine-readable release manifest identifies required files/version','Add a manifest or checklist with version and file inventory.'],
      ['DG-I03','Illustrative','Medium','A buyer may publish with noindex still enabled','Make index/noindex choice explicit in delivery instructions.']
    ],
    recommendations: ['Add a pre-release placeholder scanner and signed checklist', 'Ship a one-page quick-start plus rollback copy of the original configuration', 'Measure support questions, missing-file incidents and first-pass acceptance without claiming improvement'],
    sop: ['Duplicate the source package and record a version', 'Replace every placeholder from an approved content sheet', 'Run link, spelling, responsive and accessibility checks', 'Confirm indexing choice and remove internal notes', 'Zip, reopen, compare file inventory and record approval'],
    evidence: ['Public source snapshot: iederees-create/airbnb-guest-welcome-guide-template, commit b3868a8', 'Reviewed: index.html, site-config.js and app.js'],
    walkthrough: ['Customize a copy using wholly fictional property data', 'Run the placeholder search and record every hit/disposition', 'Test the package from a fresh extracted folder', 'Capture mobile/desktop screenshots and a release decision', 'Explain why release evidence matters as much as the checklist'],
    download: 'digital-guide-release-review.csv'
  },
  {
    id: 'quote-calculator', number: '05', title: 'Quote Calculator Rules & Edge-Case Review',
    summary: 'A calculation-focused test design for base rates, discounts, minimum charges, extras, travel and tax using synthetic fixtures.',
    industry: 'Home services', skills: ['Functional QA', 'Data validation', 'Issue tracking'], score: 93,
    context: 'A quote calculator must apply pricing rules in the agreed order and explain that the result is an estimate. The objective was to test representative calculations without submitting an enquiry or implying a real price.',
    scope: ['Local execution of the pure pricing engine at commit 4d48e35', 'Room-mode examples, minimum-charge behavior, extras, travel, tax and invalid configuration bounds', 'Synthetic configuration only; no client prices, bookings or live form submissions'],
    limitations: 'Four focused checks are not exhaustive. Area mode, localization, browser interaction and each buyer’s approved rules need their own acceptance suite.',
    checklist: ['Document the calculation order before testing', 'Hand-calculate expected line items', 'Cover minimum, discounts, extras, travel and tax', 'Test negative and out-of-range inputs', 'Confirm estimate disclosure and no-send demo behavior'],
    scorecard: [['Rule clarity',20,4],['Calculation accuracy',30,4],['Input validation',20,4],['Disclosure',15,4],['Regression coverage',15,2]],
    tests: [
      ['QC-01','Regular: 2 beds, 1 bath, travel and 8% tax','Total 111.24 from documented order','Returned 111.24','Pass'],
      ['QC-02','Weekly deep clean: 3 beds, 2.5 baths, oven','Total 224.42','Returned 224.42','Pass'],
      ['QC-03','Negative counts/extras','Clamp to zero, report errors, apply minimum/travel/tax','Returned 97.20 with validation messages','Pass'],
      ['QC-04','Tax 150% and minimum -10','Clamp to 100% and 0 with visible errors','Both values clamped and errors returned','Pass']
    ],
    issues: [
      ['QC-I01','Verified','Medium','The reviewed repository has no committed automated regression suite','Promote the synthetic vectors into version-controlled unit tests.'],
      ['QC-I02','Illustrative','High','A business may change one rule without updating its worksheet/instructions','Use one approved rules source and a release sign-off.'],
      ['QC-I03','Illustrative','Medium','Locale or rounding expectations may differ by buyer','Confirm currency, tax basis and rounding with the process owner.']
    ],
    recommendations: ['Convert the four executed vectors plus area-mode boundaries into automated tests', 'Require pricing-owner approval for config and calculation-order changes', 'Track quote overrides and customer clarification reasons as a proposed measurement plan'],
    sop: ['Obtain an approved pricing-rule sheet', 'Translate each rule into positive, boundary and invalid test cases', 'Calculate expected results independently', 'Run the engine and compare every line, not only the total', 'Log failures, retest fixes and archive the approved version'],
    evidence: ['Public source snapshot: iederees-create/cleaning-business-instant-quote-calculator, commit 4d48e35', 'Executed locally against pricing-engine.js and sample-config.json on 18 September 2026'],
    walkthrough: ['Recalculate QC-01 manually and explain each line', 'Add one area-mode case and one tax-exclusion case', 'Explain why a passing total can still hide a wrong breakdown', 'Draft a defect with reproducible inputs if any result differs', 'Record your independently executed evidence before claiming participation'],
    download: 'quote-calculator-review.csv'
  },
  {
    id: 'trading-dashboard', number: '06', title: 'Trading Dashboard Data & Disclosure Review',
    summary: 'A reporting-integrity review covering calculations, timestamps, internal routes and prominent demo/risk disclosures—without assessing investment performance.',
    industry: 'Trading education', skills: ['Reporting QA', 'Data consistency', 'Release readiness'], score: 90,
    context: 'A practice dashboard must distinguish demo information from real money, keep calculations consistent and communicate when data was updated. The objective was technical and editorial QA, not investment analysis.',
    scope: ['Local automated tests, production build and internal-route manifest at commit e2f7e46', 'Calculator outputs, date helpers, CSV round-trip, market-data parsing, demo labels and route coverage', 'No live trading, account access, financial advice, strategy validation or profit claims'],
    limitations: 'The review does not certify data-provider uptime, market accuracy, security or suitability. Live WebSocket behavior and every responsive state were outside this source run.',
    checklist: ['Confirm demo/practice labeling near key values and actions', 'Test calculation and CSV helpers with deterministic fixtures', 'Check timestamp/date handling and stale-state communication', 'Validate internal routes and production build', 'Log performance warnings separately from functional failures'],
    scorecard: [['Calculation tests',25,4],['Data-state clarity',20,3],['Disclosure placement',25,4],['Route/build readiness',20,4],['Performance readiness',10,2]],
    tests: [
      ['TD-01','Run repository unit tests','All deterministic calculation/parser tests pass','39 tests across 6 files passed','Pass'],
      ['TD-02','Build production bundle','TypeScript and Vite build complete','Build passed','Pass'],
      ['TD-03','Validate route manifest','All expected internal routes appear in sitemap','12 routes confirmed','Pass'],
      ['TD-04','Review output size','Build should report optimization risks','720.45 kB JS chunk triggered a >500 kB warning','Warning']
    ],
    issues: [
      ['TD-I01','Verified','Medium','The main JavaScript chunk exceeds the build warning threshold','Evaluate route-level code splitting and measure before/after load impact.'],
      ['TD-I02','Illustrative','High','A delayed feed may be mistaken for current data if stale state is unclear','Test disconnect/reconnect and show last-update/stale status beside values.'],
      ['TD-I03','Illustrative','High','Demo values can be misread as income when shared out of context','Keep demo/practice wording attached to screenshots and exports.']
    ],
    recommendations: ['Add explicit stale/disconnected acceptance cases', 'Code-split heavy routes only after measuring the current load profile', 'Review disclosures whenever a new value, screenshot, export or CTA is added'],
    sop: ['Freeze the tested commit and synthetic fixtures', 'Run unit tests, build and route checks', 'Compare displayed labels, timestamps and derived values', 'Classify failures versus warnings and record evidence', 'Release only after critical issues close and disclosures remain visible'],
    evidence: ['Public source snapshot: iederees-create/deriv-affiliate-launchpad-template, commit e2f7e46', 'Executed npm test, npm run build and npm run check:links on 18 September 2026'],
    walkthrough: ['Read one calculator test and explain expected math', 'Trace one timestamp from source to displayed label', 'Test a mocked stale response without connecting a real account', 'Explain why this is reporting QA rather than investment expertise', 'Record your own run output and review notes privately'],
    download: 'trading-dashboard-review.csv'
  },
  {
    id: 'lead-research', number: '07', title: 'Lead Research Provenance & Duplicate-Control Review',
    summary: 'A data-governance demonstration for qualification criteria, duplicate handling, public-source evidence and reviewer confidence.',
    industry: 'Sales operations', skills: ['Data quality', 'Research operations', 'Documentation'], score: 85,
    context: 'A useful prospect list needs consistent criteria and evidence, not just more names. The objective was to turn the existing lead-research blueprint into a reviewable quality-control process using fictional rows.',
    scope: ['Public project methodology and downloadable fictional examples in the NextGenWebs portfolio', 'Required fields, qualification evidence, normalized duplicate keys, source dates and reviewer confidence', 'No scraping, private personal data, outreach or real prospect scoring'],
    limitations: 'All review rows are fictional. Scores prioritize research attention only and do not predict replies, appointments, sales or revenue.',
    checklist: ['Confirm inclusion and exclusion criteria before research', 'Record public source URL and accessed date', 'Normalize company/domain and flag duplicates', 'Tie every score to written evidence', 'Route uncertain rows to human review rather than guessing'],
    scorecard: [['Criteria clarity',25,4],['Evidence provenance',25,3],['Duplicate controls',20,3],['Review confidence',15,3],['Outcome boundaries',15,4]],
    tests: [
      ['LR-01','Review required tracker fields','Every candidate should have criteria, source and decision fields','Methodology defines required evidence and decision notes','Verified'],
      ['LR-02','Apply normalized duplicate key to fictional rows','Same organization/domain should be merged or linked','Procedure and synthetic examples prepared','Illustrative'],
      ['LR-03','Check score-to-evidence consistency','No factor should score without supporting evidence','Reviewer checklist requires evidence per factor','Illustrative'],
      ['LR-04','Check outcome language','No response/revenue guarantee should be presented','Public project states scoring is not an outcome prediction','Verified']
    ],
    issues: [
      ['LR-I01','Illustrative','High','Duplicate companies can appear under different names or URLs','Normalize domain and company name; retain merge decisions.'],
      ['LR-I02','Illustrative','Medium','A score may outlive the public evidence that supported it','Store accessed date and schedule refresh rules.'],
      ['LR-I03','Illustrative','Medium','Researchers may infer missing details to complete a row','Use unknown/not verified and a confidence field.']
    ],
    recommendations: ['Add deterministic duplicate keys and a merge audit column', 'Require evidence URL, accessed date and reviewer confidence', 'Measure duplicate rate, incomplete-row rate and rework—not sales outcomes'],
    sop: ['Confirm the ICP and exclusion rules', 'Research only approved public professional sources', 'Capture evidence and date before scoring', 'Normalize and de-duplicate the batch', 'Second-review uncertain/high-priority rows and record the final decision'],
    evidence: ['Reviewed NextGenWebs Qualified Lead Research project page and sample files at portfolio commit 890a60c', 'Synthetic review materials contain no real names, contacts or private data'],
    walkthrough: ['Create five fictional rows including one duplicate', 'Apply criteria without inventing missing facts', 'Explain two different confidence levels', 'Perform a second-review disagreement and document the decision', 'Keep the completed personal contribution record private'],
    download: 'lead-research-review.csv'
  },
  {
    id: 'signage-publishing', number: '08', title: 'Retail Signage Asset & Publishing Review',
    summary: 'A release gate for imagery, wording, dimensions, proof approval, accessibility and multi-channel publishing assets.',
    industry: 'Retail & creative production', skills: ['Content QA', 'Release readiness', 'Process improvement'], score: 62,
    context: 'Signage and retail content move through brief, design proof, approval and publishing/production. The objective was to inspect the public prototype and design a control that prevents placeholder assets or unapproved wording from reaching production.',
    scope: ['Local source inspection and production build of Aura Signs at commit 823e5a9', 'Public images/alt text, proof workflow concepts, configuration fields and build/lint readiness', 'No client proofs, production files, printing, purchases or approval actions'],
    limitations: 'The prototype contains demo data. Legibility at physical viewing distance, color reproduction, substrate constraints and client approval require production-specific human review.',
    checklist: ['Verify final wording against the approved brief', 'Check dimensions, bleed/safe area and output profile', 'Confirm image rights, resolution and meaningful alt text', 'Test QR/links from the final exported asset', 'Record named proof approval before production/publishing'],
    scorecard: [['Brief completeness',20,3],['Asset readiness',25,2],['Proof approval',25,3],['Accessibility/content',15,3],['Build controls',15,1]],
    tests: [
      ['SG-01','Build the public prototype','Production bundle should compile','Vite build passed','Pass'],
      ['SG-02','Run advertised lint command','Lint should run with a repository-owned configuration','Failed: no ESLint dependency/configuration was available','Blocked'],
      ['SG-03','Inspect public imagery and alt text','Images should have useful alternatives and be identified as demo assets','Alt text exists; source uses stock/demo image URLs','Verified'],
      ['SG-04','Validate print dimensions/QR scan','Final output should match production specification','Not run; no approved production asset was in scope','Not run']
    ],
    issues: [
      ['SG-I01','Verified','Medium','The lint script is not reproducible from the repository configuration','Add and pin ESLint plus a committed configuration, then run in CI.'],
      ['SG-I02','Verified','Medium','Prototype proof/project records include sample content','Block release until demo records and stock placeholders are replaced/approved.'],
      ['SG-I03','Illustrative','High','A visually correct proof may fail at final size or scanning distance','Test a production-size proof and QR code under realistic conditions.']
    ],
    recommendations: ['Create a specification sheet per asset/channel', 'Make proof approval a recorded gate with version/hash', 'Repair the lint toolchain and add a release checklist to CI or handoff'],
    sop: ['Lock the approved brief and asset specification', 'Preflight wording, dimensions, images, links and rights', 'Export a numbered proof and collect explicit approval', 'Run final-size/QR/contrast checks on the approved version', 'Archive source, export, approval and publication record together'],
    evidence: ['Public source snapshot: iederees-create/aura-signs, commit 823e5a9', 'Executed npm run build; npm run lint was blocked by missing repo configuration on 18 September 2026'],
    walkthrough: ['Prepare a fictional promotion brief and specification sheet', 'Run the checklist against one sample asset', 'Record a revision request with exact location and expected fix', 'Retest the numbered proof rather than an unnamed replacement', 'Explain the audit trail in an interview without claiming client delivery'],
    download: 'signage-publishing-review.csv'
  }
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

function scoreRows(rows) {
  return rows.map(([criterion, weight, rating]) => `<tr><td>${escapeHtml(criterion)}</td><td>${weight}%</td><td>${rating}/4</td><td>${Math.round(weight * rating / 4)}%</td></tr>`).join('');
}

function renderCollection() {
  const grid = document.querySelector('#case-grid');
  if (!grid) return;
  const search = document.querySelector('#case-search');
  const industryWrap = document.querySelector('#industry-filters');
  const skillWrap = document.querySelector('#skill-filters');
  const industries = ['All', ...new Set(cases.map((item) => item.industry))];
  const skills = ['All', ...new Set(cases.flatMap((item) => item.skills))];
  let industry = 'All'; let skill = 'All';

  function buttons(values, wrap, type) {
    wrap.innerHTML = values.map((value, index) => `<button type="button" class="filter-chip${index === 0 ? ' active' : ''}" data-${type}="${escapeHtml(value)}">${escapeHtml(value)}</button>`).join('');
    wrap.addEventListener('click', (event) => {
      const button = event.target.closest('button'); if (!button) return;
      wrap.querySelectorAll('button').forEach((item) => item.classList.remove('active')); button.classList.add('active');
      if (type === 'industry') industry = button.dataset.industry; else skill = button.dataset.skill;
      update();
    });
  }

  function update() {
    const query = search.value.trim().toLowerCase();
    const filtered = cases.filter((item) => (industry === 'All' || item.industry === industry) && (skill === 'All' || item.skills.includes(skill)) && (!query || `${item.title} ${item.summary} ${item.industry} ${item.skills.join(' ')}`.toLowerCase().includes(query)));
    grid.innerHTML = filtered.map((item) => `<article class="case-card"><div class="case-meta"><span>${item.number}</span><span>${escapeHtml(item.industry)}</span></div><p class="demo-label">Demonstration case study</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary)}</p><div class="tag-list">${item.skills.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div><div class="case-card-footer"><span>Scope score <strong>${item.score}%</strong></span><a href="case-study.html?id=${encodeURIComponent(item.id)}">Open case study →</a></div></article>`).join('');
    document.querySelector('#result-count').textContent = `${filtered.length} of ${cases.length} case studies shown`;
    document.querySelector('#empty-state').hidden = filtered.length !== 0;
  }

  buttons(industries, industryWrap, 'industry'); buttons(skills, skillWrap, 'skill');
  search.addEventListener('input', update);
  document.querySelector('#clear-filters').addEventListener('click', () => { search.value=''; industry='All'; skill='All'; document.querySelectorAll('.filter-chip').forEach((button) => button.classList.toggle('active', button.textContent === 'All')); update(); });
  update();
}

function list(items, ordered = false) { const tag = ordered ? 'ol' : 'ul'; return `<${tag}>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</${tag}>`; }
function section(title, content, eyebrow = '') { return `<section class="detail-section">${eyebrow ? `<p class="eyebrow">${escapeHtml(eyebrow)}</p>` : ''}<h2>${escapeHtml(title)}</h2>${content}</section>`; }

function renderDetail() {
  const root = document.querySelector('#main.case-detail'); if (!root) return;
  const id = new URLSearchParams(location.search).get('id');
  const item = cases.find((entry) => entry.id === id);
  if (!item) { root.innerHTML = `<section class="detail-hero"><p class="eyebrow">Case study not found</p><h1>Choose a case study from the collection.</h1><a class="button primary" href="index.html">View collection</a></section>`; return; }
  document.title = `${item.title} | Shafeeqah Francis`;
  document.querySelector('meta[name="description"]').setAttribute('content', item.summary);
  const issueRows = item.issues.map((row) => `<tr>${row.map((cell, index) => `<td${index === 1 ? `><span class="status ${cell.toLowerCase()}">${escapeHtml(cell)}</span>` : `>${escapeHtml(cell)}`}</td>`).join('')}</tr>`).join('');
  const testRows = item.tests.map((row) => `<tr>${row.map((cell, index) => `<td${index === 4 ? `><span class="status ${cell.toLowerCase().replace(' ','-')}">${escapeHtml(cell)}</span>` : `>${escapeHtml(cell)}`}</td>`).join('')}</tr>`).join('');
  root.innerHTML = `
    <article>
      <header class="detail-hero"><p class="demo-label">Demonstration case study · not a client engagement</p><p class="eyebrow">${escapeHtml(item.industry)} · ${escapeHtml(item.skills.join(' · '))}</p><h1>${escapeHtml(item.title)}</h1><p class="hero-summary">${escapeHtml(item.summary)}</p><div class="detail-facts"><div><span>Review date</span><strong>${REVIEW_DATE}</strong></div><div><span>Reviewed score</span><strong>${item.score}%</strong></div><div><span>Attribution</span><strong>Checks executed by NextGenWebs/Codex</strong></div></div><div class="disclosure"><strong>Contribution boundary:</strong> this page gives Shafeeqah a guided demonstration to complete. The recorded technical observations and automated results are not presented as her work. No employment, client engagement or business result is implied.</div></header>
      ${section('Business context and review objective', `<p>${escapeHtml(item.context)}</p>`, '01 · Context')}
      ${section('Scope and limitations', `<div class="two-column"><div><h3>Included</h3>${list(item.scope)}</div><div><h3>Limitations</h3><p>${escapeHtml(item.limitations)}</p></div></div>`, '02 · Boundaries')}
      ${section('Operational review checklist', list(item.checklist), '03 · Test plan')}
      ${section('Reusable scorecard', `<p class="note"><strong>Scale:</strong> ${SCALE}. The published score reflects this limited review, not a certification.</p><div class="table-scroll"><table><thead><tr><th>Criterion</th><th>Weight</th><th>Rating</th><th>Weighted result</th></tr></thead><tbody>${scoreRows(item.scorecard)}</tbody><tfoot><tr><th>Total</th><td>100%</td><td></td><th>${item.score}%</th></tr></tfoot></table></div>`, '04 · Scoring')}
      ${section('Test cases and results', `<div class="table-scroll"><table><thead><tr><th>ID</th><th>Check</th><th>Expected</th><th>Actual result</th><th>Status</th></tr></thead><tbody>${testRows}</tbody></table></div>`, '05 · Execution')}
      ${section('Issue register', `<p class="note">Verified means directly observed in the retained source/run. Illustrative means a realistic scenario to test—not an observed defect.</p><div class="table-scroll"><table><thead><tr><th>ID</th><th>Evidence state</th><th>Priority</th><th>Finding/example</th><th>Recommended control</th></tr></thead><tbody>${issueRows}</tbody></table></div>`, '06 · Findings')}
      ${section('Prioritized recommendations', list(item.recommendations, true), '07 · Improvement')}
      ${section('Reusable SOP / process flow', `<div class="process-flow">${item.sop.map((step, index) => `<div><span>${index + 1}</span><p>${escapeHtml(step)}</p></div>`).join('')}</div>`, '08 · Operations')}
      ${section('Evidence references', `<p class="note">Evidence is a source/version reference, not proof that Shafeeqah performed the check.</p>${list(item.evidence)}<p><strong>Review date:</strong> ${REVIEW_DATE}</p>`, '09 · Traceability')}
      ${section('Interview walkthrough for Shafeeqah', `<p>Complete these steps personally, save redacted evidence in the private reviewer file, and then describe exactly what you did.</p>${list(item.walkthrough, true)}`, '10 · Human review')}
      <section class="download-panel no-print"><div><p class="eyebrow">Reusable artifact</p><h2>Download the case CSV</h2><p>Includes the test cases and issue register with evidence-state labels.</p></div><a class="button primary" href="../downloads/${encodeURIComponent(item.download)}" download>Download CSV</a><button class="button secondary print-button" type="button">Print / save PDF</button></section>
    </article>`;
  document.querySelectorAll('.print-button').forEach((button) => button.addEventListener('click', () => window.print()));
  root.focus();
}

document.querySelector('#year') && (document.querySelector('#year').textContent = new Date().getFullYear());
renderCollection(); renderDetail();
