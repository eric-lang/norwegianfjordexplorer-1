# Deployment

This is a static Astro site. No server adapter or runtime environment variables are required.

## Build settings

- Node.js: 24.x
- Package manager: pnpm 11.25.0
- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm build`
- Output directory: `dist`
- Project root: repository root

Vercel and Netlify support importing the GitHub repository with these settings. Deployment from GitHub Pages needs its Pages workflow and the site's final URL/base path configured first.

The GitHub workflow checks and builds pushes to `main` and pull requests. It does not publish the site.

## Assets and integrations

All website images and the Lofoten stock video are included under `public/`. The original Figma file, decoded design archive, local caches, and dependencies are excluded from Git. Keep those original design files on this device.

The contact form prepares a message in the visitor's email app; it does not submit to a backend. Book Now links call the onboard number. The documentary embeds Vimeo after a visitor clicks Play.

The blog link remains a placeholder. Some copy and prices are draft/reference content, and the original font files have not been supplied. The final footer from the design has not yet been built.

## Local checks

Run `pnpm check` and `pnpm build` before pushing. Run `pnpm preview` to preview the built site.
