# Medusa Admin Dashboard

This is the static build of the Medusa Admin Dashboard, deployed separately from the API server.

## Configuration

- **API Server**: https://medusa-server-rnupj.ondigitalocean.app
- **Admin URL**: Will be provided after deployment

## Deployment

This site is automatically deployed to DigitalOcean App Platform when changes are pushed to the main branch.

## Local Testing

```bash
npm install
npm run serve
```

Then visit http://localhost:8080

## Updating

To update the admin dashboard:

1. Build new version in the main medusa-server repository
2. Copy the built files to this repository
3. Commit and push to trigger deployment