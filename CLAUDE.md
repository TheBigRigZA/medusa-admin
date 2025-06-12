# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static build of the Medusa Admin Dashboard, configured for production deployment at shop.mediabox.co/app. It contains pre-built JavaScript and CSS assets that form the complete admin interface.

## Architecture

- **Purpose**: Static hosting of Medusa Admin UI
- **Backend API**: https://shop.mediabox.co (separate repository)
- **Deployment**: DigitalOcean App Platform (auto-deploys from main branch)
- **Build Type**: Pre-compiled static assets (not a development environment)

## Key Commands

### Local Testing
```bash
npm install
npm run serve
```
This serves the static files locally at http://localhost:8080

### Production Deployment
Deployment is automatic - pushing to main branch triggers DigitalOcean rebuild.

## Important Notes

### Static Build Repository
- This repo contains only built assets, not source code
- The `/assets/` directory contains all compiled JavaScript and CSS files
- The `index.html` file is the entry point that loads the main JavaScript bundle
- Do NOT edit files in `/assets/` directly - they are generated files

### Admin Customizations
- Brand customizations (logos, colors, text) need to be applied during the build process
- The customization script (patch-admin.js) should be run AFTER the Medusa build but BEFORE deployment
- See `admin-customization-setup.md` for detailed customization workflow

### File Structure
- `index.html`: Main entry point with script/style references
- `assets/`: All compiled JavaScript, CSS, and font files
- `package.json`: Simple configuration for serving static files
- `README.md`: Deployment and configuration documentation

## Development Workflow

Since this is a static build repository:
1. **DO NOT** modify assets directly
2. **DO** update the main Medusa server build process if changes are needed
3. Copy new builds from the main medusa-server repository
4. Commit and push to trigger automatic deployment

## Troubleshooting

- If admin interface doesn't load: Check that `index.html` script references match actual asset filenames
- If customizations are missing: Ensure patch script runs during build process in the source repository
- For API issues: Check the backend server at https://shop.mediabox.co