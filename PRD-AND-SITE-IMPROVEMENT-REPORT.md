# Pataskala Lodge #404 Website
## Product Requirements Document, Content Instructions, and Improvements Report

**Prepared:** October 24, 2026  
**Status:** Draft for lodge review; recommendations are not implementation approval  
**Product:** Public information and membership website for Pataskala Lodge #404, Free & Accepted Masons of Ohio

> This report evaluates the repository and visible site structure. Lodge history, eligibility rules, officer names, charitable claims, meeting details, and other organizational facts have not been independently verified. The lodge should approve those claims before publication. This is a product and engineering assessment, not legal advice or a formal accessibility certification.

## 1. Executive Summary

The site has a strong visual identity, a clear home-page message, a coherent set of pages, and useful foundations for keyboard access and responsive design. It already covers the main visitor journeys: learning about Freemasonry, finding meeting information, contacting the lodge, and expressing interest in membership.

The largest gaps are not visual polish; they are trust and operational readiness:

1. **Forms do not yet provide a dependable, verified submission path.** The contact form reports success locally without sending data. The petition form contains a placeholder Formspree endpoint.
2. **The petition collects substantial personal information.** The privacy page describes a narrower contact-only data flow and does not explain the petition data, service providers, access, retention, or deletion.
3. **Some public-facing information is visibly incomplete or time-sensitive.** Officer names remain placeholders, calendar special events end in May 2026, and the calendar map and gallery use placeholders.
4. **Accessibility claims exceed the evidence.** The site has good accessibility patterns, but the linked accessibility page is absent, and gold text on white has an estimated contrast ratio of 2.63:1, below the 4.5:1 WCAG AA requirement for normal text.
5. **Content governance is missing.** The site needs a named lodge owner and a recurring review process for schedules, officers, forms, photos, policy, and factual claims.

**Recommendation:** Keep the present design direction. Before promoting the site, confirm content with lodge leadership, decide whether the online petition is appropriate, connect and test the forms or remove their success-shaped placeholders, align the privacy notice with actual processing, refresh the calendar and leadership details, and conduct a focused accessibility and mobile QA pass.

## 2. Product Overview

### 2.1 Product vision

Provide an accurate, welcoming, accessible, and maintainable public website that helps community members understand Pataskala Lodge #404, find verified meeting and contact information, learn how to visit or inquire about membership, and see the lodge’s community role.

### 2.2 Product goals

- Make essential lodge information easy to find on desktop and mobile.
- Explain Freemasonry and local lodge participation in clear, respectful language.
- Provide a reliable path for contact and membership inquiries.
- Present accurate, current leadership, meeting, event, history, and charity information.
- Establish a privacy-conscious, accessible, low-maintenance static site.
- Give designated lodge volunteers clear instructions for routine content updates.

### 2.3 Success measures

Baseline analytics are not configured or verified. Do not add tracking without a privacy decision. Initial success can be measured through manual acceptance checks and service operations:

- A visitor can locate the next meeting date, time, and address within one minute.
- A prospective member can understand the next step without submitting unnecessary sensitive information.
- Test contact and membership inquiries reach the designated lodge recipient and receive an acknowledgement.
- No placeholder content, dead internal links, or past-dated events remain on launch pages.
- Required pages pass keyboard, mobile, link, and automated accessibility checks; any remaining exceptions are documented and assigned.
- A named content owner reviews dates and people at least quarterly and before each lodge-year transition.

## 3. Users and Primary Journeys

### Visitor groups

1. **Community visitor:** Wants to understand the lodge, its community involvement, and how to contact it.
2. **Prospective member:** Wants accurate eligibility information, a non-pressured way to ask questions, and clear next steps.
3. **Mason or visiting Mason:** Wants current meeting details, visitor expectations, location, and lodge contacts.
4. **Lodge volunteer/content editor:** Needs to update events, officers, photos, policies, and contact routing without accidentally publishing stale or sensitive information.

### Core journeys

- Home → What is Freemasonry? → How to Join → Contact or approved membership inquiry.
- Home → Calendar → meeting logistics → map/directions or contact to arrange a visit.
- Home → Charity / History / Gallery → understand local lodge activity and verify information.
- Any page → Contact → submit message → receive an honest confirmation and follow-up path.
- Volunteer → update a controlled source of truth → preview → validate links/accessibility → publish.

## 4. Current Product Inventory

The repository contains a static HTML/CSS/JavaScript site, Jest tests, and a small Python pipeline area. Public website pages include:

- Home (`index.html`)
- Freemasonry overview (`freemasonry.html`)
- Membership / petition (`join.html`, `join-thankyou.html`)
- Officers (`officers.html`)
- Calendar (`calendar.html`)
- History (`history.html`)
- Charity (`charity.html`)
- Gallery (`gallery.html`)
- Contact (`contact.html`)
- Privacy (`privacy.html`)
- Dashboard (`dashboard/index.html`)

Shared styling is primarily in `css/styles.css` with page-specific CSS files. Browser behavior is in `js/`. The content model is static files; no CMS or production backend is evident in the repository.

## 5. Product Requirements

### P0 — Required for a trustworthy public launch

#### P0.1 Accurate, approved public content
- Lodge leadership must approve meeting cadence, season, address, visitor rules, officer names/terms, membership requirements, historical claims, charity claims, and contact details.
- Replace all bracketed names and illustrative figures with approved content or remove them.
- Distinguish verified historical facts from interpretation; provide sources for specific dates, numbers, and claims where practical.
- Remove or clearly label any sample/demo content that is not an actual event, photograph, award, or activity.
- Review sensitive eligibility language with the Grand Lodge of Ohio or the lodge’s authorized source before publication; do not rely on unverified paraphrases.

#### P0.2 Contact workflow
- Contact form validates required fields accessibly.
- A valid submission is delivered to a lodge-controlled recipient through an approved service or backend.
- The visitor receives success feedback only after the service confirms receipt; failed or unavailable delivery must show an error and preserve entered data.
- State a realistic response expectation or explain an alternate contact route, subject to lodge approval.
- Protect the endpoint with provider-side spam controls, rate limits, and server-side validation. A client-side honeypot is supplemental only.

#### P0.3 Membership inquiry and petition data
- Lodge leadership decides whether a full petition should be submitted online or whether the site should collect only a low-sensitivity expression of interest.
- Collect only the information needed for the approved step. Do not transmit full birth date, home address, employment, spouse, or declarations to a third party until the lodge has explicitly approved the process, service, access controls, retention, and privacy notice.
- If the form remains online, use a real, lodge-owned endpoint; remove the placeholder Formspree ID; test successful, rejected, and network-failure behavior; and verify thank-you routing.
- Do not describe the membership form as operational until a real end-to-end delivery test passes.

#### P0.4 Privacy notice
- Describe each active form, data categories, purpose, recipients/service providers, retention, contact route for deletion/correction, and any relevant processing outside the lodge.
- Align the notice with actual form fields and configured services. In particular, reconcile the current contact-only description with the detailed petition form.
- Publish only statements that the lodge can operationally honor.

#### P0.5 Current events and leadership
- Remove past special events or replace them with lodge-approved future dates.
- Make the event list useful beyond the currently hard-coded special-event window; set a process to update it on a regular schedule.
- Update the officer term, names, and roles or clearly state that the page is being updated.
- Include a review date or “last updated” signal for time-sensitive information.

#### P0.6 Accessibility and functional links
- Resolve every internal link, including the footer’s Accessibility link; create an accessibility statement if the lodge chooses to link one, or remove the dead link.
- Meet WCAG 2.2 AA as the recommended target (or document the agreed target); do not claim conformance until a defined audit supports it.
- Ensure normal text meets 4.5:1 contrast and large text meets 3:1. Gold on white currently measures approximately 2.63:1 and should not be used for normal-size text.
- Verify keyboard operation, visible focus, zoom/reflow, labels and error announcement, reduced-motion handling, headings, and meaningful image alternatives.

### P1 — Strongly recommended

- Replace gallery placeholder cards with authorized real photos, captions, dates, and useful alt text. Obtain consent for identifiable individuals and avoid publishing private ritual or member information.
- Replace the map placeholder with a direct map/directions link or an approved privacy-conscious map embed.
- Add page-specific social preview metadata, canonical URLs, a sitemap, and production-domain configuration when the final domain is confirmed.
- Provide a concise “Plan a visit” path with visitor/prospective-member distinctions and a way to ask questions before arriving.
- Review content density and page length on small screens; keep high-value actions easy to reach.
- Add a lightweight publishing checklist and content owner to the repository documentation.

### P2 — Optional enhancements

- Add event export (calendar subscription or downloadable event) once dates are maintained reliably.
- Add a simple, privacy-reviewed analytics or inquiry-count measure only if the lodge needs it.
- Add a lightweight content-management workflow if volunteer updates become error-prone; avoid adding a backend/CMS without a clear owner and security plan.
- Consider performance improvements such as self-hosting fonts and using optimized, responsive images if real photography is added.

## 6. Functional Requirements and Acceptance Criteria

### Navigation and page shell
- Every public page has a descriptive title, one primary page heading, shared navigation, a skip link, and a usable footer.
- Current navigation state is identified visually and programmatically.
- At narrow viewport widths, all navigation links remain reachable by keyboard and touch; Escape closes an open mobile menu and focus returns to the toggle.
- Internal links resolve to existing pages; external links are identified appropriately and use safe target behavior.

### Calendar
- Meeting schedule and season match lodge-approved source information.
- All event dates are future-dated at publication or explicitly marked as past/history.
- Event details include title, local date, time, location, and visitor guidance where approved.
- Calendar controls have accessible names, update the displayed month, and work using keyboard input.
- A visible no-events state is accurate and does not imply the calendar is broken.

### Contact form
- Required fields have programmatic labels and understandable inline errors.
- Invalid submission focuses the first invalid field and does not send data.
- Successful delivery is confirmed by the server/provider before success messaging.
- Failure preserves user-entered values and gives a usable alternate route.
- A real test submission is received by the designated lodge contact before launch.

### Membership inquiry
- The lodge approves the scope, purpose, endpoint, data fields, privacy text, recipient, and retention before enabling submission.
- The user can ask a question without being forced to complete a full petition.
- Validation handles invalid dates and future birth dates correctly; legal eligibility rules are confirmed by the lodge.
- Conditional fields appear only when applicable, and behavior remains accessible.

### Content and media
- No visible placeholder names, fake metrics, sample event labels, or empty image cards remain unless explicitly labeled as placeholders.
- Every photograph has a truthful caption, permissions approval, and appropriate alternative text.
- Facts with meaningful legal, membership, financial, or historical consequences are approved by an authorized lodge reviewer.

### Quality and release checks
- `npm test` passes.
- `npm run validate` passes (Jest suite plus Python syntax compile).
- Manual checks cover desktop and mobile, keyboard-only navigation, form success/failure, internal links, and a screen-reader spot check.
- Automated accessibility tooling reports no unresolved critical/serious issues; manual review remains required.

## 7. Content and Maintenance Instructions

### Before editing
1. Confirm the information with the designated lodge officer or approved record.
2. Identify every page or script that repeats the information (for example, meeting time/address appears on home, contact, calendar, and event details).
3. Do not publish personal contact details, names, photographs, or petition information without authorization.
4. Make a small change, preview the affected page, and run the validation command.

### Routine updates
- **Meeting schedule/address:** Update all visible copies and calendar/event details; test links and directions.
- **Calendar events:** Update `js/calendar.js` special-event data; remove expired events; verify date/month indexing and display.
- **Officers:** Update `officers.html` only with approved current names and term; review the page at each annual transition.
- **Charity/history claims:** Confirm claims with lodge records; replace unsupported numbers or specifics with sourced/approved language.
- **Gallery:** Add authorized image files, compress appropriately, use descriptive alt text, and ensure captions match the image.
- **Forms:** Coordinate changes with the endpoint owner; test a controlled submission, failure response, notification, and privacy text before release.
- **Privacy/accessibility statements:** Update alongside data-flow or accessibility changes; never treat a statement as a substitute for actual controls.

### Release checklist
- [ ] Lodge owner approved the change and factual claims.
- [ ] No stale dates, placeholder names, demo copy, or broken links.
- [ ] Forms tested end-to-end, or clearly marked non-operational and not displaying false success.
- [ ] Privacy notice matches the exact data flow.
- [ ] Keyboard and mobile checks pass.
- [ ] Color contrast and screen-reader behavior checked for affected content.
- [ ] `npm run validate` passes.
- [ ] Production domain, HTTPS, social metadata, and hosting configuration are correct.

## 8. Prioritized Improvements Report

Priority scale: **P0** launch blocker or material trust/privacy risk; **P1** significant quality improvement; **P2** optional enhancement.

| Priority | Area | Current evidence | Recommended change | Outcome |
|---|---|---|---|---|
| P0 | Contact form | `js/contact.js` shows a success message and resets the form without a network submission; `contact.html` has no configured backend action. | Connect and test a real delivery service, or remove the false success behavior and provide a direct contact method. | Visitors are not misled; inquiries reach the lodge. |
| P0 | Petition endpoint | `join.html` contains `https://formspree.io/f/YOUR_FORMSPREE_ID`. | Replace only after approval with a real endpoint and complete end-to-end testing; otherwise disable submission and explain the alternative. | Membership inquiries do not disappear into a placeholder endpoint. |
| P0 | Petition privacy | The form asks for birth date, street address, phone, email, employment, spouse name, prior application, and declarations; the privacy notice describes only contact-form data. | Decide whether to use a low-sensitivity interest form or an approved secure petition workflow; align notice, service, access, and retention. | Lower exposure of personal data and accurate visitor expectations. |
| P0 | Officer page | `officers.html` displays `[Name]` placeholders and a 2025–2026 term. | Obtain approval for names and current term or replace with a clearly labeled update notice. | The public page appears maintained and credible. |
| P0 | Calendar | `js/calendar.js` special events end in May 2026; review date is Oct 2026. | Remove expired events, confirm the regular schedule, and create an event-update owner/process. | Visitors see useful, current event information. |
| P0 | Accessibility claim | README claims WCAG 2.1 AA; footer references missing `accessibility.html`; gold on white is about 2.63:1. | Fix link and contrast, run automated plus manual checks, and soften/remove conformance claims until substantiated. | More inclusive use and credible accessibility statements. |
| P1 | Gallery | `gallery.html` displays illustrative placeholder cards/captions instead of actual photographs. | Add approved photographs and truthful metadata or temporarily replace the gallery with an honest notice. | Stronger authenticity and community connection. |
| P1 | Directions | `calendar.html` includes a map placeholder. | Add a direct directions link or a properly configured embed after verifying the address. | Easier visit planning. |
| P1 | Content accuracy | `history.html`, `charity.html`, and `freemasonry.html` make specific historical, charitable, membership, and statistical claims. | Have an authorized reviewer validate each claim; cite authoritative sources or remove unsupported precision. | Reduced reputational and factual risk. |
| P1 | SEO/deployment | Production domain is not confirmed; metadata includes a `pataskala404.com` social URL on the home page; no release evidence for hosting is present. | Confirm domain, HTTPS hosting, canonical/social URLs, sitemap, and production link validation. | Correct search and social sharing, secure delivery. |
| P2 | Content maintenance | Repeated facts are embedded directly in several HTML/JS files; README inventory and maintenance guidance are stale/incomplete. | Refresh README and add a simple source-of-truth/update checklist; consider centralizing repeated facts if updates remain error-prone. | Fewer inconsistent edits. |
| P2 | Resilience/performance | Web fonts are loaded from Google Fonts; image optimization becomes important once real photos are added. | Consider self-hosted fonts and responsive compressed images based on hosting/privacy/performance needs. | More predictable loading, especially on mobile. |

## 9. Implementation Plan

### Phase 0 — Lodge decisions (do not code around unknown policy)
- Appoint content owner and approver.
- Approve membership eligibility wording, visitor guidance, officers, history, charity statements, meeting calendar, and location.
- Decide form provider, responsible recipient, data minimization, privacy/retention, and whether a full petition is collected online.
- Confirm production domain and hosting owner.

### Phase 1 — Trust and launch blockers
- Replace form placeholders with approved, tested workflows or disable them with honest alternatives.
- Update privacy and accessibility content to match reality.
- Refresh current dates and officer information; remove fake/sample gallery content.
- Resolve dead links, map placeholder, metadata, and contrast issues.

### Phase 2 — QA and release
- Run project validation, link checks, keyboard/mobile checks, form delivery/failure tests, contrast checks, and manual assistive-technology spot checks.
- Obtain final lodge approval.
- Deploy over HTTPS; test production URLs and form recipient in a controlled manner.

### Phase 3 — Ongoing improvement
- Quarterly content check and annual officer/calendar review.
- Track form delivery failures and update needs without collecting unnecessary visitor analytics.
- Reassess whether a CMS or event feed is justified by actual maintenance burden.

## 10. Risks, Dependencies, and Open Decisions

### Risks
- A false-success or placeholder form can lose inquiries and harm trust.
- Collecting petition data through an unapproved third-party endpoint can expose sensitive personal information.
- Stale dates, placeholder officers, or unsupported claims can undermine credibility.
- Accessibility claims without conformance evidence create avoidable legal and reputational risk.
- External font or map services may affect privacy, reliability, or performance.

### Dependencies
- Lodge approval for public facts and eligibility language.
- A named, monitored recipient for inquiries.
- Approved form service/backend and its account owner.
- Confirmed domain, host, and deployment process.
- Approved photographs and permissions, if photos are used.

### Decisions required from lodge leadership
1. Should `join.html` collect a full petition, or only an initial inquiry?
2. Which officer/person is responsible for receiving and responding to messages?
3. What response-time expectation can the lodge meet?
4. Which officers and special events should be published for the current lodge year?
5. Which historical, charitable, and membership statements have approved source records?
6. Is a public accessibility statement desired, and who will maintain it?
7. Which domain and hosting provider are official?
8. Who owns quarterly content and pre-release approval?

## 11. Review Basis and Limitations

This assessment is based on the repository’s static site and source files, including `index.html`, `contact.html`, `join.html`, `officers.html`, `calendar.html`, `history.html`, `charity.html`, `freemasonry.html`, `gallery.html`, `privacy.html`, the shared CSS/JavaScript, tests, and README. The home page was visually inspected in a browser. Existing Jest tests cover selected JavaScript logic but do not establish full production form delivery, all-page link health, WCAG conformance, or the accuracy of lodge claims.

No changes to site functionality are authorized by this report. Treat recommendations as a backlog for review and approval.
