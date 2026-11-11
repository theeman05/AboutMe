# AboutMe

Static portfolio for Ethan Hartman. Two HTML pages, one stylesheet, two scripts. No build step and no package manager.

Live site: https://theeman05.github.io/AboutMe/

## Layout

- `index.html` is the portfolio: hero, featured projects, experience, gallery, contact.
- `archive.html` is the full project table. It links back to `index.html`.
- `assets/css/style.css` is the only stylesheet. Colors, type, and spacing live in `:root`.
- `js/scripts.js` runs on the home page only: scroll reveals, lightbox, project modals, hero video, email copy.
- `js/footer.js` injects the shared footer into `#footer-placeholder`. Both pages include that element and this script.
- `assets/images/`, `assets/videos/`, and `assets/files/` are committed and served as-is.

## How to work

- Edit the HTML, CSS, and JS directly. Open `index.html` in a browser, or serve the repo root with any static server.
- A push to `main` deploys the whole repository through `.github/workflows/deploy.yml` (GitHub Pages). Do not add a build output or ignore files the site needs.
- Keep new pages on the same dark palette and `cta-button` styles. Reuse classes before adding new ones.
- Hero video swaps at `1024px` in `js/scripts.js` (landscape above, portrait below). CSS layout breakpoints are `900px`, `768px`, and `600px`.
- Featured-project and gallery copy that opens in a modal belongs in `data-title` and `data-content` on `.project-modal-trigger`. `data-content` is HTML.
- An image inside `.project-modal-trigger` must not also open the lightbox. `scripts.js` already skips those clicks.
- Scroll-in motion uses any class containing `reveal-`. The observer adds and removes `is-visible`.
- New pages that need the footer must include `#footer-placeholder` and `js/footer.js`.
- `archive.html` loads Inter from Google Fonts. `index.html` does not. Match the page you are editing.
- Check the changed page in a browser before calling UI work done. Home and archive share `style.css` and the footer, so a shared change needs both pages.

## Leave alone

- Do not restructure into a framework or add a bundler unless asked.
- Do not rewrite modal HTML into a separate data file unless asked.
- Large media is part of the deploy. Prefer compressed images already used here (`.webp` thumbs, short mp4s) over new uncompressed files.
