# Varad Paradkar — Portfolio

Personal site for [Varad Paradkar](https://www.linkedin.com/in/vparadkar), a software engineer
working on real-time, data-intensive web applications — React front ends, RESTful APIs, and the
streaming pipelines behind them.

**Live:** <https://vradcar.github.io/>

## Stack

Hand-written HTML, CSS, and JavaScript. No framework, no bundler, no build step — the repository
is what GitHub Pages serves.

- **One stylesheet**, token driven. Dark and light themes are two full declarations of the same
  custom properties, so neither is a patch over the other.
- **Inline SVG sprite** for icons instead of an icon font, which removes a render-blocking
  external stylesheet.
- **No images in the layout** beyond the portrait; section backdrops are CSS gradients and masks.
- **Progressive enhancement**: with JavaScript blocked the page is still complete and readable.
  Scroll reveals are gated behind a `.js` class, and the GitHub section stays hidden unless its
  request succeeds.

## Structure

```
.
├── index.html        # All content and the icon sprite
├── css/style.css     # Tokens, layout, components, responsive rules
├── js/main.js        # Theme, nav, scrollspy, reveals, GitHub fetch
├── resume.pdf        # Linked from the header and hero
├── public/images/
│   └── varad-pfp.jpg # Portrait, also used as the Open Graph image
└── package.json      # Metadata and a local-server script only; no dependencies
```

## Running locally

Any static server works, since there is nothing to compile:

```bash
npm start                  # → http://localhost:8000
python -m http.server 8000 # no Node required
```

## Behaviour worth knowing

**Theme.** An inline script in `<head>` stamps `data-theme` on `<html>` before first paint, so the
chosen theme never flashes. It follows the operating system until the visitor clicks the toggle;
after that their choice is kept in `localStorage`. Every read and write is wrapped in `try`/`catch`
because storage throws in private windows.

**GitHub section.** `js/main.js` pulls the six most recently pushed repositories from the public
GitHub API, skipping forks, archived repositories, and the ones already described by hand on the
page (`GH_SKIP`). Results are cached in `localStorage` for six hours, which keeps repeat visits off
the API's 60-requests-per-hour unauthenticated limit. Cards are built with `createElement` and
`textContent` rather than `innerHTML`, so repository descriptions can't inject markup. If the
request fails for any reason the section simply stays hidden.

**Accessibility.** Skip link, a real focus-visible ring, `aria-expanded` on the menu button,
`aria-current` driven by a scroll observer, labelled icon-only links, and a
`prefers-reduced-motion` block that disables reveals and smooth scrolling.

## Updating content

Everything is in `index.html`, in section order: hero, about, experience, projects, research,
contact. Each is plain markup — editing a bullet means editing a `<li>`.

- **Experience and projects** use the same `.card` primitive, so adding an entry is copying a
  sibling and changing the text. The timeline connector and the filled first marker are CSS, with
  no per-item classes to keep in sync.
- **Colours** live in the `:root` and `[data-theme='light']` token blocks at the top of
  `css/style.css`. Changing `--accent` in both re-themes the whole site.
- **Résumé**: replace `resume.pdf` at the repository root. The filename is lower-case and
  referenced that way in two places; GitHub Pages is case-sensitive even though Windows is not.

## License

MIT — see [LICENSE](LICENSE).
