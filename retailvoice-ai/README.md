# RetailVoice AI

retailvoice-ai/
  frontend/   index.html, css/style.css, js/app.js   (your app, split from the single HTML file; behaviour unchanged)
  database/   DATABASE.md (localStorage schema), sample_bills.json (demo data)
  report_assets/  diagrams, plots and app screenshots used in the report

No backend is needed: speech-to-text is the browser Web Speech API and data is stored in localStorage.

Run: open frontend/index.html in Chrome (or serve it: cd frontend; python -m http.server 8000).
Voice needs Chrome + internet + mic permission. On a phone, host it over HTTPS or use localhost.
