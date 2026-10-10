# QueRent — On-Site Documentation Website

**Research title:** QueRent: A Rental Information System for Tenant Billing and Notifications in Salapungan, Angeles City

This is a static, locally runnable website documenting on-site observations of **QuiHut**, an apartment rental business in Salapungan, Angeles City, Pampanga, Philippines. It supports an Information Systems research proposal by presenting the building's exterior and entrance, common interior areas, the existing tenant payment-checking process, and maintenance-fee notices as evidence.

This site is a **documentation and evidence website**, not the operational QueRent system. It contains no real payment processing, tenant accounts, authentication, or notification delivery.

## 1. How to open the site

No build step or server is required.

1. Download or clone this folder.
2. Open `index.html` directly in a modern browser (Chrome, Edge, Firefox, Safari), **or**
3. Serve it locally for the most accurate behavior (recommended, since some browsers restrict local video/autoplay):
   ```
   # from the project folder
   python3 -m http.server 8080
   ```
   Then visit `http://localhost:8080`.

## 2. Directory structure

```
QueRent-Documentation/
├── index.html
├── README.md
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── script.js
    ├── images/
    │   ├── 01-building-exterior.jpg
    │   ├── 02-building-entrance.jpg
    │   ├── 03-tenant-payment-checking.jpg
    │   ├── 04-maintenance-fee-notice-01.jpg
    │   ├── 05-maintenance-fee-notice-02.jpg
    │   └── 06-maintenance-fee-notice-03.jpg
    └── videos/
        ├── 01-building-interior-01.mp4
        ├── 02-building-interior-02.mp4
        └── 03-building-interior-03.mp4
```

The `assets/images/` and `assets/videos/` folders are currently empty placeholders in the delivered project — no files exist there yet. The website detects missing files automatically and displays a styled "pending" placeholder with the expected filename, so the site looks complete and professional even before real evidence is added.

## 3. Adding real on-site evidence

To replace a placeholder with real evidence, add a file with the **exact filename** listed above into the matching folder. No HTML edits are required — the page will automatically display the file once it exists at that path.

| Slot | Exact path | Type |
|---|---|---|
| Building exterior | `assets/images/01-building-exterior.jpg` | Image |
| Building entrance | `assets/images/02-building-entrance.jpg` | Image |
| Interior walkthrough — View 01 | `assets/videos/01-building-interior-01.mp4` | Video |
| Interior walkthrough — View 02 | `assets/videos/02-building-interior-02.mp4` | Video |
| Interior walkthrough — View 03 | `assets/videos/03-building-interior-03.mp4` | Video |
| Tenant payment checking | `assets/images/03-tenant-payment-checking.jpg` | Image |
| Maintenance fee notice — Copy 01 | `assets/images/04-maintenance-fee-notice-01.jpg` | Image |
| Maintenance fee notice — Copy 02 | `assets/images/05-maintenance-fee-notice-02.jpg` | Image |
| Maintenance fee notice — Copy 03 | `assets/images/06-maintenance-fee-notice-03.jpg` | Image |

**Supported media formats**
- Images: JPEG (`.jpg`)
- Videos: MP4 with H.264 video encoding

If your evidence is in another format, either convert it to the formats above or update the matching `src`/`<source>` path in `index.html` consistently.

**No electricity-bill evidence is included or expected.** Electricity bills are excluded from this documentation because they contain confidential AEC information. Do not add an electricity-bill image — no placeholder slot exists for it by design.

## 4. Editing captions and descriptions

All captions, descriptions, and placeholder text live directly in `index.html` as plain text inside `<figcaption>`, placeholder `<p>` tags, and section description paragraphs. Open `index.html` in any text editor, find the relevant section (sections are clearly commented, e.g. `<!-- SECTION 01: BUILDING EXTERIOR -->`), and edit the text directly. No build step is needed — just save and refresh the browser.

## 5. Redacting sensitive images before publication

Before adding a photograph of the tenant payment-checking process or any document-based evidence:

- Crop or blur out tenant names, addresses, phone numbers, account identifiers, and signatures.
- Confirm the image has been approved for documentation by the business before placing it in `assets/images/`.
- Never substitute a fabricated or recreated document for real evidence — leave the slot as a pending placeholder until approved evidence is available.
- Electricity bills must never be added to this website, redacted or otherwise.

## 6. Video playback behavior

Every video on this site is configured with `autoplay muted loop playsinline preload="metadata"`:

- Videos always start muted and never expose an unmute control.
- Videos attempt to autoplay automatically and loop continuously.
- Videos play inline on mobile rather than opening a native fullscreen player.
- Browsers may still block autoplay depending on user settings or device policy. When this happens, the site shows a visible play button over the video frame — selecting it starts playback (still muted). This is expected behavior, not a bug.

## 7. Offline / network notes

- The site uses Google Fonts (Inter) and Font Awesome from a CDN for icons and typography. Both require an internet connection the first time they load.
- If these cannot load (e.g. fully offline), the site falls back to system fonts and remains fully readable and usable. Icons will not render without Font Awesome; no emoji is used as a substitute.

## 8. Privacy and confidentiality reminders

- This site must never include real tenant names, addresses, phone numbers, account identifiers, or signatures.
- Electricity bills are excluded entirely due to confidential AEC information.
- The Research Notes section (bottom of the page) stores entered text **only in the current browser's local storage**. Nothing is uploaded to a server, and no backend exists in this project. Do not enter sensitive tenant data into these fields.
- All photographic and video evidence must be approved for documentation before being placed into `assets/images/` or `assets/videos/`.

## 9. Technical notes

- Built with semantic HTML5, CSS3 (custom properties, Grid, Flexbox), and vanilla JavaScript — no frameworks, no backend, no database.
- Light mode only; no dark mode or theme toggle is implemented.
- Responsive from 320px mobile widths through large desktop, mobile-first.
- Respects `prefers-reduced-motion: reduce`.
- Accessible: skip link, semantic landmarks, visible focus states, keyboard-operable mobile menu and lightbox, ARIA attributes on interactive controls.
