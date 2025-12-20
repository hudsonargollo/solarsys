# SolarSys Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

## Pre-Deployment

### Code Quality
- [ ] All tests passing (`npm run test`)
- [ ] Build successful (`npm run build`)
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Linting passes (`npm run lint`)

### Environment Setup
- [ ] `.env` file configured locally
- [ ] Supabase project created and configured
- [ ] Database migrations applied
- [ ] HSP data seeded in database
- [ ] RLS policies enabled and tested

### GitHub Setup
- [ ] Code pushed to GitHub repository
- [ ] Repository is public or has proper access
- [ ] Branch protection rules configured (optional)
- [ ] GitHub Actions enabled

### Cloudflare Setup
- [ ] Cloudflare account created
- [ ] Domain added to Cloudflare (if using custom domain)
- [ ] API token created with Pages:Edit permissions
- [ ] Account ID obtained

## GitHub Secrets Configuration

Add these secrets to your GitHub repository:

- [ ] `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token
- [ ] `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
- [ ] `VITE_SUPABASE_URL` - Your Supabase project URL
- [ ] `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Initial Deployment

### Option 1: Manual Deployment with Wrangler

```bash
# 1. Install dependencies
npm install

# 2. Build the application
npm run build

# 3. Login to Cloudflare
npx wrangler login

# 4. Create Pages project (first time only)
npx wrangler pages project create solarsys

# 5. Deploy
npm run deploy
```

### Option 2: Automatic Deployment via GitHub

```bash
# 1. Commit and push to main branch
git add .
git commit -m "Initial deployment"
git push origin main

# 2. Check GitHub Actions tab for deployment status
# 3. Wait for deployment to complete
# 4. Visit your Cloudflare Pages URL
```

## Post-Deployment Verification

### Functionality Tests
- [ ] Homepage loads correctly
- [ ] Simulador flow works end-to-end
- [ ] CEP lookup functioning
- [ ] Lead qualification working
- [ ] WhatsApp integration working
- [ ] Results page displays correctly
- [ ] Admin panel accessible (with auth)
- [ ] Database operations working

### Performance Tests
- [ ] Page load time < 3 seconds
- [ ] Lighthouse score > 90
- [ ] Mobile responsiveness verified
- [ ] All animations smooth
- [ ] No console errors

### Security Tests
- [ ] HTTPS enabled
- [ ] Security headers present
- [ ] RLS policies enforced
- [ ] Anonymous users can't access admin
- [ ] Session isolation working

### SEO & Analytics
- [ ] Meta tags present
- [ ] Open Graph tags configured
- [ ] Sitemap generated (if applicable)
- [ ] Analytics tracking working
- [ ] UTM parameters captured

## Custom Domain Setup (Optional)

If using custom domain `solarsys.clubemkt.digital`:

- [ ] Domain added to Cloudflare Pages
- [ ] DNS records configured
- [ ] SSL certificate active
- [ ] Domain accessible via HTTPS
- [ ] Redirects working (www to non-www, etc.)

## Monitoring Setup

- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Uptime monitoring setup
- [ ] Alert notifications configured

## Documentation

- [ ] README.md updated with deployment info
- [ ] Environment variables documented
- [ ] API endpoints documented (if any)
- [ ] Deployment process documented

## Rollback Plan

In case of issues:

```bash
# 1. Check previous deployments
npx wrangler pages deployment list --project-name=solarsys

# 2. Rollback to previous version via Cloudflare dashboard
# Or redeploy previous commit:
git revert HEAD
git push origin main
```

## Production Checklist

Before announcing to users:

- [ ] All features tested in production
- [ ] Performance acceptable
- [ ] No critical bugs
- [ ] Support documentation ready
- [ ] Monitoring alerts configured
- [ ] Backup strategy in place
- [ ] Team trained on deployment process

## Continuous Deployment

For ongoing deployments:

- [ ] Feature branches deploy to preview
- [ ] Main branch deploys to production
- [ ] Automated tests run before deployment
- [ ] Deployment notifications configured
- [ ] Rollback procedure documented

## Notes

- Production URL: `https://solarsys.pages.dev` (or custom domain)
- Preview URLs: Generated for each PR
- Build time: ~2-3 minutes
- Deployment time: ~30 seconds
- Last updated: 2025-12-20
- Enhanced UI: Slider controls and animated buttons deployed
- New Landing: Modern design with Framer Motion animations

## Support Contacts

- Cloudflare Support: https://dash.cloudflare.com/support
- Supabase Support: https://supabase.com/support
- GitHub Support: https://support.github.com