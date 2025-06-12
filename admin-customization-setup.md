# Admin Customization Setup Guide

## The Issue
The admin customizations (patch-admin.js) are not being applied because the admin panel is built in a separate repository.

## Architecture Overview
```
medusa-server (this repo)
├── Backend API only
├── Admin disabled
└── patch-admin.js (can't run here)

medusa-admin (separate repo)
├── Admin UI build
├── Deploys to Digital Ocean static site
└── Needs patch-admin.js here
```

## Steps to Fix Admin Customizations

### 1. In the Admin Repository (TheBigRigZA/medusa-admin)

1. **Copy these files from medusa-server to medusa-admin:**
   ```bash
   - patch-admin.js
   - assets/logo-login.png
   - assets/logo-header.png  
   - assets/favicon.ico
   ```

2. **Update package.json in admin repo:**
   ```json
   {
     "scripts": {
       "build": "medusa build && node patch-admin.js"
     }
   }
   ```

3. **Update the build command in Digital Ocean:**
   - Current: `yarn install && NODE_OPTIONS='--max-old-space-size=2048' npx medusa build`
   - New: `yarn install && NODE_OPTIONS='--max-old-space-size=2048' npx medusa build && node patch-admin.js`

### 2. What the Patch Script Does

- **Welcome Text**: Changes "Welcome to Medusa" to "Welcome to The Mediabox Global Ecommerce Store Admin Portal"
- **Login Logo**: Replaces default Medusa logo with Mediabox logo
- **Header Logo**: Updates navigation bar logo
- **Color Scheme**: Applies Mediabox brand colors (#df3d58)
- **Favicon**: Updates browser tab icon

### 3. Testing Locally

In the admin repo:
```bash
# Build admin with customizations
yarn build

# Check the output for success messages
# Look for: "✅ Mediabox branding customizations applied successfully!"
```

### 4. Deployment

Once the patch script is in the admin repo:
1. Commit and push changes
2. Digital Ocean will automatically rebuild
3. Customizations will be applied during build
4. Check https://shop.mediabox.co/app for branded admin

## Current Status

- ❌ Customizations NOT working (script in wrong repo)
- ✅ Server API working fine
- ✅ Admin panel accessible but with default Medusa branding

## Next Steps

1. Clone the admin repository
2. Move customization files there
3. Update build process
4. Deploy and verify branding is applied