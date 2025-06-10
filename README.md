# Medusa Admin Dashboard

This is the static build of the Medusa Admin Dashboard, configured for production at shop.mediabox.co/app.

## Configuration

- **API Server**: https://shop.mediabox.co
- **Admin URL**: https://shop.mediabox.co/app

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