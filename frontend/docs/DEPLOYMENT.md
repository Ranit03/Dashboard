# Deployment Guide

This guide covers deploying BlockDAG Scan++ to various platforms and environments.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- Environment variables configured

## Environment Variables

Create environment files for different stages:

### `.env.local` (Development)
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_WS_URL=ws://localhost:8080
NODE_ENV=development
```

### `.env.production` (Production)
```env
NEXT_PUBLIC_APP_URL=https://blockdag-scan.com
NEXT_PUBLIC_API_URL=https://api.blockdag-scan.com
NEXT_PUBLIC_WS_URL=wss://ws.blockdag-scan.com
NODE_ENV=production
ANALYZE=false
```

### `.env.staging` (Staging)
```env
NEXT_PUBLIC_APP_URL=https://staging.blockdag-scan.com
NEXT_PUBLIC_API_URL=https://api-staging.blockdag-scan.com
NEXT_PUBLIC_WS_URL=wss://ws-staging.blockdag-scan.com
NODE_ENV=production
```

## Build Process

### Local Build
```bash
# Install dependencies
npm install

# Type check
npm run type-check

# Run tests
npm run test:ci

# Build for production
npm run build

# Start production server
npm run start
```

### Docker Build
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:8080/api
      - NEXT_PUBLIC_WS_URL=ws://api:8080
    depends_on:
      - api
    restart: unless-stopped

  api:
    image: blockdag-api:latest
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
    restart: unless-stopped
```

## Platform Deployments

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and deploy
   vercel login
   vercel --prod
   ```

2. **Environment Variables**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add production environment variables
   - Redeploy after adding variables

3. **Build Configuration**
   ```json
   // vercel.json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "framework": "nextjs",
     "functions": {
       "app/**/*.tsx": {
         "maxDuration": 30
       }
     },
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           },
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           }
         ]
       }
     ]
   }
   ```

### Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18

2. **Netlify Configuration**
   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [build.environment]
     NODE_VERSION = "18"
   
   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "DENY"
       X-Content-Type-Options = "nosniff"
       Referrer-Policy = "strict-origin-when-cross-origin"
   ```

### AWS (EC2 + CloudFront)

1. **EC2 Setup**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Clone and build
   git clone <repository>
   cd frontend
   npm install
   npm run build
   
   # Use PM2 for process management
   npm install -g pm2
   pm2 start npm --name "blockdag-frontend" -- start
   pm2 startup
   pm2 save
   ```

2. **CloudFront Configuration**
   - Origin: EC2 instance
   - Caching: Cache static assets, bypass for API calls
   - SSL: Use AWS Certificate Manager

### Google Cloud Platform

1. **App Engine**
   ```yaml
   # app.yaml
   runtime: nodejs18
   
   env_variables:
     NODE_ENV: production
     NEXT_PUBLIC_API_URL: https://api.blockdag-scan.com
   
   handlers:
   - url: /_next/static
     static_dir: .next/static
     expiration: 1y
   
   - url: /.*
     script: auto
   ```

2. **Cloud Run**
   ```bash
   # Build and deploy
   gcloud builds submit --tag gcr.io/PROJECT_ID/blockdag-frontend
   gcloud run deploy --image gcr.io/PROJECT_ID/blockdag-frontend --platform managed
   ```

## Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm run analyze

# Check for unused dependencies
npx depcheck

# Optimize images
npx next-optimized-images
```

### CDN Configuration
```nginx
# nginx.conf for CDN
server {
    listen 80;
    server_name blockdag-scan.com;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Cache static assets
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Cache images
    location ~* \.(jpg|jpeg|png|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring & Logging

### Health Checks
```typescript
// pages/api/health.ts
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  })
}
```

### Error Tracking
```typescript
// Sentry configuration
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
})
```

### Performance Monitoring
```typescript
// Web vitals reporting
export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics service
    analytics.track('web-vital', {
      name: metric.name,
      value: metric.value,
      id: metric.id,
    })
  }
}
```

## Security Considerations

### Content Security Policy
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      connect-src 'self' wss: https:;
    `.replace(/\s{2,}/g, ' ').trim()
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

### Environment Security
- Never commit `.env` files
- Use secrets management for production
- Rotate API keys regularly
- Enable HTTPS everywhere
- Implement rate limiting

## Rollback Strategy

### Blue-Green Deployment
1. Deploy to staging environment
2. Run smoke tests
3. Switch traffic gradually
4. Monitor metrics
5. Rollback if issues detected

### Database Migrations
- Always backward compatible
- Test rollback procedures
- Backup before deployment
- Monitor after deployment

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **Memory Issues**
   ```bash
   # Increase Node.js memory
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

3. **TypeScript Errors**
   ```bash
   # Check types
   npm run type-check
   
   # Fix common issues
   npm run lint --fix
   ```

### Performance Issues
- Check bundle analyzer output
- Monitor Core Web Vitals
- Optimize images and fonts
- Enable compression
- Use CDN for static assets

### Deployment Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] DNS records updated
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Backup strategy in place
- [ ] Rollback plan tested
- [ ] Performance benchmarks met
- [ ] Security headers configured
- [ ] Error tracking enabled
