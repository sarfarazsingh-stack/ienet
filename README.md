# IE Alumni Connect

**Search & connect with IE University alumni by location, company, and role.**

A full-stack Next.js platform that enables students to discover and contact alumni while respecting privacy preferences and enabling controlled introductions.

---

## ✨ Features

- 🔍 **Smart Search** - Find alumni by company, role, location, graduation year
- 🔐 **Privacy-First** - Alumni control what information they share
- 📧 **Email Relay** - Contact requests without exposing personal info
- 👤 **Profile Management** - Alumni can update their profiles and preferences
- 📊 **Admin Dashboard** - CSV upload, staging, and bulk invite system
- 🚀 **Modern Stack** - Next.js 14, TypeScript, MongoDB, NextAuth, Tailwind

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Auth**: NextAuth v5 (email magic links)
- **Styling**: Tailwind CSS + shadcn/ui
- **Email**: Nodemailer (SMTP)
- **Monitoring**: Sentry
- **Testing**: Vitest + Supertest
- **Deployment**: DigitalOcean App Platform

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm (or npm/yarn)
- MongoDB Atlas account (or local MongoDB)
- SMTP email provider (e.g., SendGrid, Postmark, Gmail)

### Local Development

```bash
# Clone the repository
git clone https://github.com/sarfarazsingh-stack/ienet.git
cd ienet

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net` |
| `JWT_SECRET` | Random secret (32+ chars) | `openssl rand -base64 32` |
| `NEXTAUTH_SECRET` | Random secret for NextAuth | `openssl rand -base64 32` |
| `SMTP_HOST` | Your SMTP provider | `smtp.sendgrid.net` |
| `SMTP_USER` | SMTP username | `apikey` |
| `SMTP_PASS` | SMTP password/API key | Your API key |
| `EMAIL_FROM` | Sender email | `noreply@yourdomain.com` |
| `SENTRY_DSN` | (Optional) Sentry project DSN | `https://...` |
| `NEXTAUTH_URL` | App URL (prod) | `https://app.yourdomain.com` |

---

## 📦 Project Structure

```
ie-alumni-connect/
├── app/
│   ├── api/              # API routes
│   │   ├── alumni/       # Alumni CRUD
│   │   ├── contact-requests/
│   │   ├── admin/        # Admin endpoints
│   │   └── auth/         # NextAuth
│   ├── search/           # Search page
│   ├── alumni/[id]/      # Profile pages
│   ├── admin/            # Admin dashboard
│   ├── dashboard/        # User dashboard
│   └── layout.tsx        # Root layout
├── models/               # Mongoose schemas
│   ├── User.ts
│   ├── Alumni.ts
│   └── ContactRequest.ts
├── lib/                  # Utilities
│   ├── db.ts            # MongoDB connection
│   ├── auth.ts          # Auth helpers
│   ├── email.ts         # Email templates
│   ├── rate-limit.ts    # Rate limiting
│   └── api-helpers.ts   # API middleware
├── components/           # React components
│   └── ui/              # shadcn/ui components
├── scripts/
│   └── seed.ts          # Seed database
└── __tests__/           # Test files
```

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test -- --coverage

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

---

## 🌱 Seeding Data

Populate the database with sample alumni:

```bash
pnpm seed
```

This creates 25 diverse alumni profiles for testing.

---

## 🚢 Deployment (DigitalOcean)

1. **Create a DigitalOcean App** from this GitHub repo
2. **Set environment variables** in DO dashboard
3. **Connect MongoDB Atlas** (whitelist DO IP ranges)
4. **Configure custom domain** (CNAME to DO hostname)
5. **Enable HTTPS** (automatic with DO)

See `do-app.yaml` for the App Spec configuration.

### DNS Configuration (Namecheap)

For `app.yourdomain.com`:
```
Type: CNAME
Host: app
Value: your-app.ondigitalocean.app
TTL: Automatic
```

For email relay (SPF/DKIM):
```
Type: TXT
Host: @
Value: v=spf1 include:_spf.yoursmtpprovider.com ~all
```

---

## 🔐 Authentication Flow

1. User enters email on `/signin`
2. NextAuth sends magic link via SMTP
3. User clicks link → authenticated session
4. JWT contains `userId` and `role`
5. Protected routes check session

---

## 📧 Contact Request Flow

1. Student searches for alumni
2. Student clicks "Request Intro" → sends message
3. Alumni receives email with Accept/Decline links
4. Links are JWT-signed and expire in 7 days
5. If **Accepted**: Student receives contact info (per privacy settings)
6. If **Declined**: Student notified, no info shared

---

## 👥 User Roles

- **Student**: Can search alumni and send contact requests (5/day limit)
- **Alumni**: Can manage profile, accept/decline requests
- **Admin**: Can upload CSV, create alumni, view all data

---

## 🐛 Error Tracking

Sentry is configured for both client and server:

- Errors in API routes → Sentry
- Client exceptions → Sentry
- Unhandled promise rejections → Sentry

Set `SENTRY_DSN` to enable.

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

---

## 🙋 Support

- Open an issue for bug reports
- Email: support@yourdomain.com (update this)
- Docs: (add link to wiki/docs)

---

**Built with ❤️ for IE University**