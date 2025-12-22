# Deployment Guide

This document provides a step-by-step deployment checklist for Nyembotech.

## Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Set all required environment variables (see CONFIGURATION.md)
- [ ] Verify Firebase project is configured correctly
- [ ] Confirm OpenAI API key has sufficient quota
- [ ] Set up Sentry project for error tracking

### 2. Database Preparation
- [ ] Run any pending migrations
- [ ] Deploy Firestore rules: `firebase deploy --only firestore:rules`
- [ ] Deploy Firestore indexes: `firebase deploy --only firestore:indexes`
- [ ] Verify multi-tenant data isolation

### 3. Security Verification
- [ ] Audit Firestore rules for public exposure
- [ ] Verify API authentication is enforced
- [ ] Check rate limiting configuration
- [ ] Review CORS settings

### 4. Build Verification
```bash
# Run full build
npm run build

# Run tests
npm run test:run

# Check for TypeScript errors
npx tsc --noEmit
```

## Deployment Steps

### Vercel Deployment

1. **Connect Repository**
   - Link GitHub repository to Vercel
   - Configure production branch (usually `main`)

2. **Environment Variables**
   - Add all required environment variables in Vercel dashboard
   - Ensure `FIREBASE_ADMIN_PRIVATE_KEY` is properly escaped

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Post-Deployment Verification

- [ ] Verify homepage loads correctly
- [ ] Test user authentication (login/logout)
- [ ] Test admin dashboard access
- [ ] Verify AI chat widget responds
- [ ] Check error tracking in Sentry
- [ ] Confirm analytics are tracking

## Rollback Procedure

1. **Identify Issue**
   - Check Sentry for errors
   - Review Vercel deployment logs

2. **Rollback in Vercel**
   - Go to Deployments tab
   - Click "..." on previous working deployment
   - Select "Promote to Production"

3. **Database Rollback (if needed)**
   - Restore from Firestore backup
   - Revert Firestore rules if changed

## Monitoring

### Health Check Endpoint
```
GET /api/health
```

Returns status of:
- Firebase connection
- OpenAI API
- Overall system health

### Key Metrics to Monitor
- Response times (target: <200ms for API routes)
- Error rates (target: <1%)
- AI API usage and costs
- Cache hit rates

## Emergency Contacts

| Role | Contact |
|------|---------|
| DevOps Lead | devops@nyembotech.com |
| Backend Lead | backend@nyembotech.com |
| On-Call | oncall@nyembotech.com |

## Common Issues

### 1. Firebase Connection Errors
- Verify `FIREBASE_ADMIN_PRIVATE_KEY` is correctly formatted
- Check Firebase project status

### 2. OpenAI Rate Limits
- Monitor usage in OpenAI dashboard
- Enable caching to reduce API calls
- Consider upgrading API tier

### 3. Build Failures
- Clear `.next` cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check for TypeScript errors

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-12 | Initial deployment guide |
