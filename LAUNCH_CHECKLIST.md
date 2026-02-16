# CHAOS Landing Page - Launch Checklist

Quick reference for getting the landing page live.

---

## ✅ Already Done

- [x] Landing page built (`/app/page.tsx`)
- [x] Waitlist form component created
- [x] Production build tested and passing
- [x] Mobile-responsive design
- [x] Dark mode support
- [x] SEO metadata configured
- [x] Accessible markup
- [x] Documentation written

---

## 🔴 CRITICAL (Do Before Public Launch)

### 1. Backend Integration
- [ ] Create waitlist API endpoint: `/app/api/waitlist/route.ts`
  ```typescript
  // Example structure:
  export async function POST(request: NextRequest) {
    const { name, email } = await request.json()
    // TODO: Save to database
    // TODO: Send confirmation email
    return NextResponse.json({ success: true })
  }
  ```
- [ ] Connect to database (Dolt or PostgreSQL)
- [ ] Set up email service (SendGrid or Mailgun)
- [ ] Test form submission end-to-end
- [ ] Update `waitlist-form.tsx` to call API instead of console.log

### 2. Content Review
- [ ] Update GitHub link (currently placeholder)
  - Line 40 in `page.tsx`: `href="https://github.com/hargabyte/chaos"`
  - Change to actual repo URL
- [ ] Update Discord link (line 473)
  - `href="https://discord.gg/openclaw"` → your actual invite
- [ ] Update Twitter link (line 474)
  - `href="https://twitter.com/chaos_memory"` → your actual account
- [ ] Add real logo/favicon
  - Replace text logo with image
  - Add `favicon.ico` to `/public`
- [ ] Review all copy for tone and accuracy

### 3. Deployment
- [ ] Choose hosting platform (Vercel recommended)
- [ ] Deploy to production
  ```bash
  cd /home/hargabyte/chaos-portal
  vercel --prod
  ```
- [ ] Configure custom domain
- [ ] Verify SSL certificate
- [ ] Test on production URL

---

## 🟡 IMPORTANT (Week 1)

### 4. Legal Pages
- [ ] Complete Terms of Service (`/app/terms/page.tsx`)
- [ ] Complete Privacy Policy (`/app/privacy/page.tsx`)
- [ ] Add cookie consent banner (if using analytics)

### 5. Analytics Setup
- [ ] Add Google Analytics or Plausible
- [ ] Configure conversion tracking (form submissions)
- [ ] Set up Google Search Console
- [ ] Submit sitemap

### 6. Testing
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Test on tablet
- [ ] Run Lighthouse audit (target: 95+)
- [ ] Ask 3-5 people for feedback

---

## 🟢 NICE TO HAVE (Month 1)

### 7. Content Enhancements
- [ ] Record demo video (2-3 minutes)
- [ ] Add "How It Works" section
- [ ] Create FAQ page
- [ ] Start collecting testimonials

### 8. Optimization
- [ ] Set up A/B testing (different headlines)
- [ ] Test CTA button variations
- [ ] Add exit-intent popup (optional)
- [ ] Optimize images (when added)

---

## Quick Deploy Commands

### Test Locally First
```bash
cd /home/hargabyte/chaos-portal
npm run build   # Should pass with no errors
npm run dev     # Visit http://localhost:3000
```

### Deploy to Vercel (Fastest)
```bash
npm install -g vercel  # One-time install
vercel login           # One-time login
vercel --prod          # Deploy!
```

### Alternative: Cloudflare Pages
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Pages → Create project → Connect Git
3. Select repo, set build command: `npm run build`
4. Deploy!

---

## Post-Launch Monitoring

### First 24 Hours
- [ ] Check error logs (Vercel dashboard or server logs)
- [ ] Monitor form submissions
- [ ] Watch analytics (visitors, bounce rate)
- [ ] Fix any issues immediately

### First Week
- [ ] Track conversion rate (visitors → signups)
- [ ] Read user feedback/emails
- [ ] Adjust copy if needed
- [ ] Share in communities (OpenClaw Discord, Product Hunt)

### First Month
- [ ] Analyze which sections get most engagement
- [ ] Test different pricing presentations
- [ ] Start planning features based on waitlist feedback
- [ ] Begin beta invites to early signups

---

## Environment Variables Reference

Add to Vercel/Cloudflare dashboard or `.env.local`:

```env
# Required when backend is ready
DATABASE_URL=postgresql://user:pass@host/chaos
SENDGRID_API_KEY=SG.xxxxx
FROM_EMAIL=noreply@chaos.dev

# Optional (analytics)
NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_API_URL=https://api.chaos.dev

# Production flag
NODE_ENV=production
```

---

## Rollback Plan

If something breaks:

### Vercel
```bash
vercel rollback [deployment-url]
```

### Git
```bash
git revert HEAD
git push
```

### Restore old page.tsx
```bash
# Original just redirected to /login:
# import { redirect } from 'next/navigation'
# export default function Home() { redirect('/login') }
```

---

## Success Metrics (Track These)

### Conversion Funnel
1. **Visitors** → How many people visit the page?
2. **Scroll Depth** → Do they read past hero?
3. **Form Starts** → Do they click in the form?
4. **Form Submissions** → Do they complete it?
5. **Confirmation** → Do they see success message?

### Target Metrics (Week 1)
- **Visitors**: 100+
- **Bounce Rate**: < 60%
- **Avg. Session**: > 1:30
- **Conversion Rate**: > 2%
- **Signups**: 50+

---

## Common Issues & Fixes

### Build Fails
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Form Doesn't Work
- Check browser console
- Verify `waitlist-form.tsx` has `'use client'` at top
- Test API endpoint directly

### Styling Broken
- Clear browser cache
- Check `globals.css` is imported in `layout.tsx`
- Verify Tailwind config

### Slow Load Time
- Run `npm run build` and check bundle size
- Optimize images (use Next.js Image component)
- Enable compression in `next.config.ts`

---

## Need Help?

### Documentation
- **Technical**: See `LANDING_PAGE_README.md`
- **Design**: See `DESIGN_DESCRIPTION.md`
- **Deploy**: See `DEPLOYMENT_GUIDE.md`
- **Overview**: See `PROJECT_SUMMARY.md`

### External Resources
- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs
- Tailwind CSS: https://tailwindcss.com/docs

---

## Final Check Before Launch

```bash
# 1. Build succeeds
npm run build

# 2. No TypeScript errors
npm run build 2>&1 | grep error

# 3. Test locally
npm run dev
# Visit http://localhost:3000
# - Fill out form
# - Click all links
# - Test on mobile (Chrome DevTools)

# 4. Review this checklist one more time

# 5. Deploy!
vercel --prod
```

---

## 🚀 YOU'RE READY TO LAUNCH!

Everything is built. The landing page is production-ready.

**Next action**: Complete the critical items above, then deploy.

**Remember**: 
- Done is better than perfect
- You can iterate after launch
- Real user feedback > speculation
- Ship it and learn!

---

*Good luck with the launch!* 🎉
