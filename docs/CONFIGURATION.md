# Configuration Guide

This document describes all configuration options for the Nyembotech application.

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | `AIza...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | `nyembotech-prod` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | `project.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging ID | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | `1:123:web:abc` |
| `FIREBASE_ADMIN_PROJECT_ID` | Firebase Admin project ID | `nyembotech-prod` |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Service account email | `firebase-adminsdk@...` |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Service account private key | `-----BEGIN PRIVATE KEY-----\n...` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `LOG_LEVEL` | Logging level (debug, info, warn, error) | `info` |
| `SENTRY_DSN` | Sentry error tracking DSN | - |
| `NEXT_PUBLIC_SENTRY_DSN` | Client-side Sentry DSN | - |

## Firebase Configuration

### Firestore Rules

Deploy Firestore security rules:
```bash
firebase deploy --only firestore:rules
```

### Firestore Indexes

Deploy composite indexes for multi-tenant queries:
```bash
firebase deploy --only firestore:indexes
```

### Authentication

The application uses Firebase Authentication with:
- Email/Password authentication
- Custom claims for roles (`admin`, `staff`, `customer`)
- Organization-based multi-tenancy

## Rate Limiting

Rate limits are configured in `/lib/rate-limit.ts`:

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| AI Endpoints | 10 requests | 1 minute |
| General API | 100 requests | 1 minute |
| Auth Endpoints | 5 requests | 1 minute |

For production with multiple instances, upgrade to Redis-based rate limiting.

## Caching

In-memory caching is configured in `/lib/cache.ts`:

| Cache | TTL | Max Size |
|-------|-----|----------|
| Context Cache | 15 min | 500 entries |
| Translation Cache | 24 hours | 1000 entries |
| Insights Cache | 15 min | 200 entries |

## AI Configuration

### Models Used

| Route | Model | Purpose |
|-------|-------|---------|
| `/api/agent` | gpt-4o | Chat agent |
| `/api/insights` | gpt-4o-mini | Insights generation |
| `/api/translate` | gpt-4o-mini | Translation |
| `/api/architect` | gpt-4o | Architecture assistant |

### Cost Optimization

To reduce costs:
1. Use `gpt-4o-mini` for non-critical tasks
2. Enable caching (reduces API calls by ~30%)
3. Implement FAQ detection for longer cache TTL

## Multi-Tenancy

Data isolation is enforced through:
1. Firestore rules with `organizationId` checks
2. Query-time filtering in hooks
3. Composite indexes for efficient scoped queries

### Tenant-Scoped Collections
- `customers`
- `projects`
- `tickets`
- `activity_log`
- `invoices`

### Global Collections
- `users`
- `organizations`
- `content`
- `blog_posts`

## Localization

Supported locales:
- `en` - English (default)
- `sw` - Swahili (Kiswahili)
- `de` - German

Configure in `middleware.ts` and add translations to `/messages/`.
