# Deployment Guide

## Prerequisites

Before deploying, ensure you have:

1. All API keys configured in Supabase Edge Functions
2. Authentication settings configured in Supabase
3. Database migrations applied
4. Edge functions tested locally

## Deployment Steps

### 1. Build the Application

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### 2. Deploy to Lovable

Click the "Publish" button in the Lovable editor to deploy your application.

### 3. Configure Production Settings

#### Supabase Authentication URLs

In Supabase Dashboard > Authentication > URL Configuration:

- **Site URL**: Set to your production URL (e.g., `https://your-app.lovable.app`)
- **Redirect URLs**: Add your production URL

#### API Keys Verification

Verify all Edge Function secrets are set:
```bash
supabase secrets list
```

### 4. Post-Deployment Checklist

- [ ] Test authentication flow (sign up, sign in, sign out)
- [ ] Verify all widgets load correctly
- [ ] Test voice commands
- [ ] Confirm API integrations work
- [ ] Check mobile responsiveness
- [ ] Test PWA installation
- [ ] Verify offline functionality

## Custom Domain Setup

1. Go to Project Settings in Lovable
2. Navigate to Domains section
3. Add your custom domain
4. Update DNS records as instructed
5. Update Supabase Auth redirect URLs

## Monitoring

### Application Monitoring

- Check browser console for errors
- Monitor Network tab for failed requests
- Use Lighthouse for performance audits

### Backend Monitoring

- View Edge Function logs in Supabase Dashboard
- Monitor database performance
- Check API usage and rate limits

### Performance Metrics to Track

- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Cumulative Layout Shift (CLS)**: < 0.1

## Troubleshooting Production Issues

### Authentication Issues
1. Verify Site URL and Redirect URLs in Supabase
2. Check that email confirmation is disabled for testing
3. Ensure JWT secrets are properly configured

### API Failures
1. Check Edge Function logs for errors
2. Verify all API keys are set correctly
3. Check rate limits haven't been exceeded

### Performance Issues
1. Enable caching in your hosting provider
2. Verify service worker is registered
3. Check bundle size and code splitting

## Rollback Procedure

If issues occur after deployment:

1. Use Lovable's version history to revert changes
2. Or restore from the last working commit:
   ```bash
   git revert HEAD
   git push
   ```

## Security Checklist

Before going live:

- [ ] All API keys stored in Edge Functions (not client-side)
- [ ] RLS policies enabled on all tables
- [ ] Authentication required for protected routes
- [ ] CORS configured correctly
- [ ] Rate limiting implemented
- [ ] Input validation on all user inputs
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection (no dangerouslySetInnerHTML with user content)

## Optimization Checklist

- [ ] Images optimized and lazy-loaded
- [ ] Code splitting implemented
- [ ] Service worker caching enabled
- [ ] Database queries optimized
- [ ] API responses cached
- [ ] CDN configured for static assets

## Support

For deployment issues:
- Check [Lovable Documentation](https://docs.lovable.dev)
- Visit [Supabase Documentation](https://supabase.com/docs)
- Open an issue on GitHub
