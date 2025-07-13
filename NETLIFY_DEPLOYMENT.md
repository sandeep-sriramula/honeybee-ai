# 🚀 Netlify Deployment Guide

## Setting Up Environment Variables in Netlify

### 1. **Deploy to Netlify**
```bash
# First, make sure your repo is public and pushed to GitHub
git add .
git commit -m "Prepare for public deployment"
git push origin main
```

### 2. **Configure Environment Variables in Netlify Dashboard**

#### Method A: Via Netlify Dashboard
1. Go to [Netlify](https://netlify.com) and sign in
2. Click "New site from Git"
3. Connect your GitHub account
4. Select your `honeybee-ai` repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Before deploying, click "Advanced build settings"
7. Add environment variables:
   ```
   Key: VITE_GOOGLE_SCRIPT_URL
   Value: https://script.google.com/macros/s/AKfycbwNc0WUJ99mH8ngz0hY3laIbrryvkSkwz8N97qEN6A0521lD1lpLbeFVqd-tgaYE90t/exec
   
   Key: VITE_API_URL
   Value: https://honeybee-ai.onrender.com
   ```

#### Method B: Via Site Settings (After Deployment)
1. Go to your site dashboard
2. Click "Site settings"
3. Navigate to "Environment variables"
4. Click "Add variable"
5. Add your environment variables one by one

### 3. **Netlify Build Process**
When Netlify builds your site:
1. ✅ Pulls code from GitHub (without `.env` file)
2. ✅ Uses environment variables from Netlify dashboard
3. ✅ Runs `npm run build` with those variables
4. ✅ Deploys the built site

### 4. **Verification**
After deployment, your app will:
- ✅ Use environment variables from Netlify (not your local `.env`)
- ✅ Work exactly like your local version
- ✅ Keep sensitive data secure (not in Git)

## 🔧 **Build Configuration**

### netlify.toml (Optional but Recommended)
Create this file in your project root for better control:

```toml
[build]
  command = "cd frontend && npm ci && npm run build"
  publish = "frontend/dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### package.json Scripts
Make sure your `package.json` has the build script:
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## 🚀 **Quick Deployment Steps**

1. **Push to GitHub** (your `.env` stays local)
2. **Connect to Netlify**
3. **Add environment variables in Netlify dashboard**
4. **Deploy**

Your sensitive data never touches Git, but Netlify still has access to build your app properly!

## 🔄 **For Updates**
When you update environment variables:
- Update in Netlify dashboard
- Trigger a new deploy (or it will auto-deploy on next Git push)

This way you get:
- ✅ **Security**: No secrets in Git
- ✅ **Functionality**: App works in production  
- ✅ **Convenience**: Automatic deployments from Git
