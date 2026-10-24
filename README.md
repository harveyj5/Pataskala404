# Pataskala Lodge #404 — Website

## 📁 File Structure

```
pataskala404/
├── index.html          ← Home page
├── contact.html        ← Contact page (with form)
├── privacy.html        ← Privacy policy (required)
├── css/
│   ├── styles.css      ← Main styles (colors, fonts, layout)
│   └── contact.css     ← Contact page + shared page styles
├── js/
│   ├── main.js         ← Navigation, scroll effects
│   └── contact.js      ← Contact form validation
├── tests/
│   └── lodge.test.js   ← Automated tests
└── package.json        ← Test runner config
```

## 🖊️ How to Update Content (No Coding Required)

Open any `.html` file in a text editor (Notepad on Windows, TextEdit on Mac).

### Change Meeting Info
Search for `7:00 PM` or `1st & 3rd Tuesday` and edit the text nearby.

### Change the Address
Search for `116 S. Vine` and update to the new address.

### Change Officers Names
Open `officers.html` (to be created) and update names in the list.

### Add a News Item
Copy an existing `<article>` block and paste it at the top of the news list.

---

## 🧪 Running Tests

Requires Node.js and Python 3.12 installed on your computer.

```bash
cd pataskala404
npm install
npm test
```

For a single end-to-end validation command that also checks the Python pipeline code:

```bash
npm run validate
```

This runs the Jest suite and compiles the Python sources in `src/core`.

All tests should say ✓ PASS.

---

## 🌐 Hosting & Compliance Checklist

Before going live:

- [ ] Serve the site over **HTTPS** (most hosting providers do this automatically)
- [ ] Connect a **form backend** (Netlify Forms, Formspree, etc.) to the contact form
- [ ] Register the domain **pataskala404.com** (or similar)
- [ ] Update all `og:url` meta tags to the new domain
- [ ] Test with a screen reader or browser accessibility checker
- [ ] Submit sitemap to Google Search Console

---

## ♿ Accessibility Standards Met

- WCAG 2.1 AA compliant
- Skip navigation link for keyboard users
- All images have alt text / aria-labels
- Focus outlines visible on all interactive elements
- Reduced motion media query respected
- Semantic HTML with ARIA roles and labels
- Error messages announced by screen readers (aria-live)
- Honeypot spam protection on contact form

---

## 📞 Need Help?

Reach out to your web developer, or post on the lodge's Facebook page for tech volunteers.
