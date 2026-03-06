# 🌍 Global Resume Builder

A production-ready, white-label SaaS resume builder built with **Next.js 14**, **Supabase**, **TailwindCSS**, and **TypeScript**.

---

## ✨ Features

- **3 Beautiful Templates** — Modern, Minimal, Professional
- **Full Resume Builder** — Personal info, experience, education, skills, projects, certifications, languages
- **PDF Export** — High-quality PDF via Puppeteer
- **Public Resume Links** — `yourdomain.com/resume/your-slug`
- **Dashboard** — Create, edit, duplicate, delete resumes
- **Authentication** — Email/password via Supabase Auth
- **PWA** — Installable, offline-capable
- **White-Label Ready** — Change brand in `/config/brand.ts`
- **Row-Level Security** — Full Supabase RLS policies
- **Type-Safe** — Full TypeScript coverage
- **Vercel-Ready** — Deploy in one click

---

## 📁 Project Structure

```
global-resume-builder/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── auth/
│   │   ├── login/page.tsx        # Login
│   │   ├── signup/page.tsx       # Sign up
│   │   └── forgot-password/      # Password reset
│   ├── dashboard/page.tsx        # User dashboard
│   ├── builder/[id]/page.tsx     # Resume editor
│   ├── resume/[slug]/page.tsx    # Public resume
│   └── api/
│       └── pdf/[id]/route.ts     # PDF generation
├── components/
│   ├── resume/
│   │   ├── PersonalInfoForm.tsx
│   │   ├── SectionsEditor.tsx
│   │   ├── TemplateSelector.tsx
│   │   └── ResumePreviewPane.tsx
│   └── templates/
│       ├── ModernTemplate.tsx
│       ├── MinimalTemplate.tsx
│       └── ProfessionalTemplate.tsx
├── config/
│   └── brand.ts                  # ⭐ White-label configuration
├── hooks/
│   └── useAuth.tsx               # Auth context & hooks
├── lib/
│   ├── supabase.ts               # Supabase client
│   └── resume.ts                 # Resume data layer
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── types/
│   └── index.ts                  # TypeScript types
├── utils/
│   └── sanitize.ts               # Input validation
└── public/
    ├── sw.js                     # Service worker
    └── manifest.json             # PWA manifest
```

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/yourname/global-resume-builder.git
cd global-resume-builder
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the Supabase dashboard, go to **SQL Editor**
3. Run the contents of `supabase/migrations/001_initial_schema.sql`
4. Enable Email auth in **Authentication → Providers**

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🎨 White-Label Configuration

To rebrand the entire application, edit **`/config/brand.ts`**:

```typescript
export const brand = {
  appName: "Your Brand Name",
  companyName: "Your Company Inc.",
  theme: {
    primary: "#FF6B00",   // Your brand color
  },
  // ... more options
};
```

That's it — the entire app updates automatically.

---

## 🗄️ Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | Extends Supabase auth users |
| `resumes` | Resume metadata (title, template, slug) |
| `personal_info` | Contact and summary info |
| `resume_sections` | Sections (experience, education, etc.) |
| `section_items` | Items within each section (JSONB) |
| `templates` | Available resume templates |

All tables have **Row Level Security (RLS)** enabled.

---

## 📄 PDF Export

PDF generation uses **Puppeteer** server-side. The API route:
1. Verifies user authentication
2. Fetches resume from Supabase
3. Opens a headless Chromium browser
4. Navigates to the print-optimized resume page
5. Generates A4 PDF
6. Returns as binary stream

For production, consider using **Browserless.io** or **AWS Lambda** for Puppeteer hosting.

---

## 🌐 Deployment on Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

```bash
# Or via CLI
npm i -g vercel
vercel --prod
```

### Vercel Environment Variables

Add these in your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL` (your Vercel domain)

---

## 🔒 Security

- ✅ Supabase Row Level Security on all tables
- ✅ Input sanitization with DOMPurify
- ✅ Email & password validation
- ✅ Secure HTTP headers (CSP, X-Frame-Options, etc.)
- ✅ CSRF protection via Supabase auth tokens
- ✅ Service role key never exposed to client

---

## 📱 PWA (Progressive Web App)

The app is fully installable as a PWA:
- Service Worker with offline caching
- App manifest
- Background sync for offline edits
- "Add to Home Screen" support on iOS/Android

---

## 🏗️ Scalability Notes

- **Database**: Supabase scales automatically with connection pooling via PgBouncer
- **PDF Generation**: Move to a dedicated microservice or queue system for high traffic
- **CDN**: All static assets are served via Vercel Edge Network
- **Images**: Supabase Storage with CDN for resume thumbnails
- **Search**: PostgreSQL `pg_trgm` extension for fast text search

---

## 📝 Adding a New Template

1. Create `/components/templates/YourTemplate.tsx`
2. Add to `/components/resume/ResumePreviewPane.tsx`
3. Add to `/components/resume/TemplateSelector.tsx`
4. Insert into Supabase `templates` table

---

## 📞 Support

- Email: support@globalresumebuilder.com
- Documentation: docs.globalresumebuilder.com

---

## 📄 License

MIT — Free to use, modify, and sell.
