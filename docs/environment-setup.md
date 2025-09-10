# Environment Variables Setup Guide

This guide explains how to configure environment variables for the "La Lunetterie du Coin" application across different environments.

## Quick Start

1. **Development**: Copy `.env.example` to `.env.local` and fill in your development values
2. **Production**: Use `.env.production.template` as reference for Vercel environment variables

## Environment Files

### `.env.example` - Development Reference

Contains all available environment variables with example values for local development.

### `.env.production.template` - Production Reference

Template for production environment variables. Use this to configure your production hosting platform (Vercel, Netlify, etc.).

### `.env.local` - Your Local Development (Git-ignored)

Your actual development environment variables. This file is automatically ignored by Git.

## Required Environment Variables

### Core Application

```bash
NODE_ENV=production                    # Environment mode
VITE_APP_ENV=production               # App-specific environment flag
VITE_PUBLIC_URL=https://your-domain.com # Your public domain
```

### Analytics & Monitoring (Production)

```bash
# Plausible Analytics - Lightweight, privacy-friendly
VITE_ANALYTICS_DOMAIN=your-domain.com

# Sentry Error Monitoring - Critical for production
VITE_SENTRY_DSN=https://key@sentry.io/project
VITE_SENTRY_ENVIRONMENT=production
```

### External Integrations

```bash
# Formspree - Contact form backend
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your-id
```

## Vercel Deployment Setup

### 1. Environment Variables in Vercel Dashboard

Navigate to your Vercel project → Settings → Environment Variables:

**Production Variables:**

- `VITE_SENTRY_DSN` → Production Sentry DSN
- `VITE_ANALYTICS_DOMAIN` → `www.lalunetterieducoin.fr`
- `VITE_FORMSPREE_ENDPOINT` → Your Formspree form endpoint
- `VITE_PUBLIC_URL` → `https://www.lalunetterieducoin.fr`

**Preview Variables:**

- Same as production but with preview domain
- `VITE_PUBLIC_URL` → `https://your-preview.vercel.app`

### 2. Build-time Variables (Automatic)

These are automatically set during deployment:

```bash
VITE_BUILD_TIME          # Set by Vercel build process
VITE_COMMIT_HASH         # Git commit hash
VITE_VERSION             # From package.json
```

## Security Best Practices

### ❌ Never Commit These

- `.env.local`
- `.env.production`
- Any file containing actual API keys or secrets

### ✅ Safe to Commit

- `.env.example`
- `.env.production.template`
- This documentation

### Environment Variable Naming

- Prefix with `VITE_` for client-side variables
- Use `UPPER_CASE_WITH_UNDERSCORES`
- Group by functionality (analytics, monitoring, etc.)

## Monitoring & Health Checks

For production monitoring scripts:

```bash
ALERT_EMAIL=admin@lalunetterieducoin.fr
ALERT_WEBHOOK=https://your-webhook-url.com
MONITORING_INTERVAL=300000  # 5 minutes
```

## Validation

The application automatically validates required environment variables on startup:

- Development: Validates in `src/lib/env.ts`
- Production: Additional checks for critical variables

## Environment-Specific Behavior

### Development

- Sentry disabled (unless DSN provided)
- Analytics disabled
- Detailed error messages
- Hot module replacement

### Production

- Sentry enabled with error tracking
- Analytics enabled
- Optimized bundles
- Error boundaries active

## Troubleshooting

### Common Issues

1. **"Environment variable not found"**
   - Check variable name spelling (case-sensitive)
   - Ensure `VITE_` prefix for client-side variables
   - Verify environment file is properly loaded

2. **Sentry not working**
   - Verify `VITE_SENTRY_DSN` format
   - Check environment mode (`production` required)
   - Confirm project permissions in Sentry

3. **Analytics not tracking**
   - Verify `VITE_ANALYTICS_DOMAIN` matches your domain exactly
   - Check domain is configured in Plausible dashboard

### Debug Commands

```bash
# Check current environment variables
pnpm dev --debug

# Validate environment setup
node -e "console.log(process.env)" | grep VITE_
```

## Migration Guide

### From v0.x to v1.x

If upgrading from an older version:

1. Add new required variables: `VITE_APP_ENV`, `VITE_PUBLIC_URL`
2. Update Sentry configuration with new `VITE_SENTRY_ENVIRONMENT`
3. Add health check variables for monitoring scripts

### Platform-Specific Setup

#### Vercel

- Use Dashboard Environment Variables
- Automatic build-time variable injection
- Preview deployments get separate environment

#### Netlify

- Configure in Site Settings → Environment Variables
- Use netlify.toml for build configuration

#### Custom Hosting

- Set environment variables in your deployment pipeline
- Ensure all VITE\_ variables are available at build time
