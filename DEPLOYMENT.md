# SolarSys Deployment Guide

This guide covers deploying the SolarSys application to Cloudflare Pages using Wrangler and GitHub Actions.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Supabase Project**: Set up your Supabase database
4. **Node.js 18+**: For local development and testing

## Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd solarsys
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## Manual Deployment with Wrangler

### 1. Install Wrangler globally (optional)
```bash
npm install -g wrangler
```

### 2. Authenticate with Cloudflare
```bash
wrangler login
```

### 3. Create Cloudflare Pages project
```bash
wrangler pages project create solarsys
```

### 4. Deploy manually
```bash
npm run deploy
```

## Automated Deployment with GitHub Actions

### 1. Set up GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add:

- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### 2. Get Cloudflare API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use "Cloudflare Pages:Edit" template
4. Select your account and zone
5. Copy the token to GitHub secrets

### 3. Get Cloudflare Account ID

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your domain
3. Copy the Account ID from the right sidebar

### 4. Automatic Deployment

Once secrets are configured:
- Push to `main` branch → deploys to production
- Create pull request → deploys preview
- Push to `develop` branch → deploys to staging

## Environment Variables

### Required for Production:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Optional:
- `VITE_ANALYTICS_ID`: For analytics tracking
- `VITE_DEV_MODE`: Development mode flag

## Custom Domain Setup

1. **Add domain to Cloudflare Pages**:
   ```bash
   wrangler pages domain add solarsys.clubemkt.digital --project-name=solarsys
   ```

2. **Update DNS records**:
   - Add CNAME record pointing to your Pages domain
   - Or use Cloudflare's automatic DNS setup

## Monitoring and Analytics

The application includes:
- **Performance monitoring**: Built-in performance metrics
- **Error tracking**: Comprehensive error boundaries
- **Analytics**: Ready for Google Analytics integration
- **PWA features**: Service worker and manifest

## Build Optimization

The build is optimized for:
- **Code splitting**: Separate chunks for vendor, UI, forms, API, and utils
- **Tree shaking**: Removes unused code
- **Minification**: Terser optimization
- **Gzip compression**: Automatic on Cloudflare
- **Edge caching**: Static assets cached globally

## Troubleshooting

### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Environment Issues
```bash
# Check environment variables
wrangler pages secret list --project-name=solarsys
```

### Deployment Issues
```bash
# Check deployment status
wrangler pages deployment list --project-name=solarsys
```

## Performance Metrics

Expected performance:
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Bundle size**: ~160KB gzipped total

## Security Features

- **CSP headers**: Content Security Policy
- **HTTPS only**: Automatic HTTPS redirect
- **XSS protection**: Built-in browser protection
- **CSRF protection**: Supabase RLS policies
- **Rate limiting**: Cloudflare built-in protection

## Support

For deployment issues:
1. Check GitHub Actions logs
2. Review Cloudflare Pages dashboard
3. Check Supabase logs
4. Verify environment variables