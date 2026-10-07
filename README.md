# ResumeForge

ResumeForge is a local-first resume workbench built with React and Vite. It helps users write, analyze, tailor, design, preview, and export professional resumes without sending private resume content to a server.

## Current Product Surface

- Dashboard with local resume library, duplicate/delete actions, and resume health rollups
- Guided resume editor with autosave and live A4 preview
- Four resume templates with accent color controls
- STAR + Impact writing assistant that never fabricates metrics or experience
- Resume health analyzer for content, structure, impact, ATS, and readability
- Job-description matcher with truthful matches, potential gaps, and tailored-copy creation
- Typography controls for font, body size, line height, spacing, and margins
- Print-to-PDF export using the same browser-rendered resume preview

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run lint
npm run build
```

Resume data is stored in `localStorage` under `resumeforge_library_v1`.
