# CHAOS Landing Page - Deployment Guide

## Quick Start

The landing page is production-ready and can be deployed immediately.

## Local Development

```bash
cd /home/hargabyte/chaos-portal
npm install          # Install dependencies (if needed)
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Test production build
npm start            # Run production server
```

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

Vercel is built by the Next.js team and offers zero-config deployment.

#### Step-by-Step:

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project directory**
   ```bash
   cd /home/hargabyte/chaos-portal
   vercel
   ```
   - First time: Follow prompts to create project
   - Subsequent deploys: Just run `vercel` again

4. **Production deployment**
   ```bash
   vercel --prod
   ```

#### Vercel Dashboard Setup:
- Connect GitHub repo for automatic deploys
- Set custom domain in Settings → Domains
- Configure environment variables (when backend is ready)

**Cost**: Free for hobby projects, $20/mo for Pro

---

### Option 2: Cloudflare Pages

Great performance and generous free tier.

#### Step-by-Step:

1. **Connect Git Repository**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Pages → Create a project → Connect to Git
   - Select your `chaos-portal` repository

2. **Configure Build Settings**
   - Framework preset: **Next.js**
   - Build command: `npm run build`
   - Build output directory: `.next`
   - Root directory: `/`

3. **Environment Variables** (add later)
   - Add any required env vars in Pages settings

4. **Custom Domain**
   - Add in Pages → Custom domains
   - Cloudflare handles SSL automatically

**Cost**: Free up to 500 builds/month

---

### Option 3: Railway

Simple deployment with database support (good for when you add backend).

#### Step-by-Step:

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and initialize**
   ```bash
   railway login
   cd /home/hargabyte/chaos-portal
   railway init
   ```

3. **Deploy**
   ```bash
   railway up
   ```

4. **Set environment variables**
   ```bash
   railway variables set NODE_ENV=production
   ```

5. **Add custom domain**
   ```bash
   railway domain
   ```

**Cost**: $5/month starter plan

---

### Option 4: Self-Hosted (Hetzner VPS)

For full control and cost optimization.

#### Step-by-Step:

1. **Build production bundle**
   ```bash
   npm run build
   ```

2. **Copy to server** (replace with your server IP)
   ```bash
   rsync -avz --exclude 'node_modules' \
     /home/hargabyte/chaos-portal/ \
     user@your-server.com:/var/www/chaos-portal/
   ```

3. **On server: Install dependencies**
   ```bash
   ssh user@your-server.com
   cd /var/www/chaos-portal
   npm install --production
   ```

4. **Run with PM2** (process manager)
   ```bash
   npm install -g pm2
   pm2 start npm --name "chaos-portal" -- start
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx** (example config)
   ```nginx
   server {
       listen 80;
       server_name chaos.yourdomain.com;
       
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

6. **Enable HTTPS with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d chaos.yourdomain.com
   ```

**Cost**: ~$5-10/month for VPS

---

## Environment Variables

### Current (Optional)
```env
NODE_ENV=production
```

### Future (When Backend is Ready)
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/chaos

# Email
SENDGRID_API_KEY=your_key_here
FROM_EMAIL=noreply@chaos.dev

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX

# API
NEXT_PUBLIC_API_URL=https://api.chaos.dev
```

---

## Custom Domain Setup

### DNS Configuration

Point your domain to your deployment:

#### For Vercel:
```
Type: CNAME
Name: @ (or www)
Value: cname.vercel-dns.com
```

#### For Cloudflare Pages:
```
Type: CNAME
Name: @
Value: your-project.pages.dev
```

#### For Self-Hosted:
```
Type: A
Name: @
Value: YOUR_SERVER_IP

Type: CNAME
Name: www
Value: yourdomain.com
```

---

## Post-Deployment Checklist

### Immediate (Day 1)
- [ ] Verify landing page loads correctly
- [ ] Test on mobile device
- [ ] Test all links work
- [ ] Test waitlist form (check console logs)
- [ ] Verify SEO meta tags (View Page Source)
- [ ] Check SSL certificate is valid
- [ ] Test dark mode toggle

### Week 1
- [ ] Set up Google Analytics or Plausible
- [ ] Configure Google Search Console
- [ ] Submit sitemap.xml
- [ ] Test with Lighthouse (aim for 95+ scores)
- [ ] Monitor error logs

### Month 1
- [ ] Implement waitlist backend API
- [ ] Set up email confirmation flow
- [ ] Add real testimonials (if available)
- [ ] Create demo video and embed
- [ ] Start A/B testing CTAs

---

## Monitoring & Analytics

### Recommended Tools

1. **Vercel Analytics** (if using Vercel)
   - Already integrated, just enable in dashboard
   - Shows Core Web Vitals

2. **Google Analytics 4**
   - Add to `app/layout.tsx`:
   ```typescript
   <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
   <Script id="google-analytics">
     {`
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'G-XXXXXXXXXX');
     `}
   </Script>
   ```

3. **Plausible** (privacy-friendly alternative)
   - Add script tag to layout
   - No cookies, GDPR compliant

4. **Sentry** (error tracking)
   - Install: `npm install @sentry/nextjs`
   - Configure in `next.config.ts`

---

## Performance Optimization

### Before Launch
- [x] Build passes without errors
- [x] No console warnings
- [x] Static pages pre-rendered
- [ ] Add image optimization (when images added)
- [ ] Configure caching headers

### After Launch
- [ ] Monitor Core Web Vitals
- [ ] Check bundle size: `npm run build` (should be < 200KB)
- [ ] Run Lighthouse audit (target 95+ on all metrics)
- [ ] Test on slow 3G connection

---

## Rollback Plan

If something goes wrong:

### Vercel
```bash
vercel rollback [deployment-url]
```

### Cloudflare Pages
- Go to dashboard → Deployments
- Click "Rollback" on previous deployment

### Self-Hosted
```bash
# Keep a backup of working version
cd /var/www
tar -czf chaos-portal-backup.tar.gz chaos-portal/

# To restore
tar -xzf chaos-portal-backup.tar.gz
pm2 restart chaos-portal
```

---

## Security Considerations

### Headers (add to next.config.ts)
```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
      ],
    },
  ]
}
```

### Rate Limiting
- Implement when backend API is added
- Use Vercel's built-in rate limiting or Cloudflare's
- Limit waitlist submissions to 3 per IP per hour

### HTTPS Only
- All platforms provide automatic HTTPS
- Ensure `next.config.ts` has `compress: true`

---

## Troubleshooting

### Build fails with "Module not found"
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Form doesn't submit
- Check browser console for errors
- Verify `waitlist-form.tsx` is in `/components`
- Ensure form is marked `'use client'`

### Styling looks broken
- Verify `globals.css` is imported in `layout.tsx`
- Check Tailwind config in `tailwind.config.ts`
- Clear browser cache

### Page not found on deployment
- Ensure `page.tsx` is in `/app` directory
- Check `next.config.ts` for any route rewrites
- Verify build output shows `/` route

---

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **Cloudflare Pages**: https://developers.cloudflare.com/pages
- **Railway Docs**: https://docs.railway.app

---

## Summary

**Recommended Path for MVP Launch:**

1. **Quick test**: Deploy to Vercel (5 minutes)
2. **Get feedback**: Share with beta users
3. **Iterate**: Update based on feedback
4. **Scale**: Move to self-hosted if traffic grows

**Most Important**: Ship it! The landing page is production-ready. Don't overthink it. Deploy, collect emails, iterate based on real user feedback.

---

**Need help?** Contact Simon or Hargabyte Software
**Last updated**: February 16, 2026
