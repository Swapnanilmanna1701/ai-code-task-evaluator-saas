# TaskEval - AI-Powered Code Evaluation Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.0.7-black" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.0.0-blue" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4.0-38bdf8" alt="Tailwind" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</div>

## 📋 Overview

TaskEval is a production-ready SaaS application that provides AI-powered code evaluation and feedback. Submit your code, get instant analysis with scores, strengths, and actionable improvements. Built with Next.js 16, TypeScript, Supabase, and Google Gemini AI.

## ✨ Features

- 🔐 **Authentication** - Secure email/password authentication with Better Auth
- 📝 **Code Submission** - Submit coding tasks for AI evaluation
- 🤖 **AI Analysis** - Powered by Google Gemini for intelligent code review
- 📊 **Detailed Reports** - Score (0-100), strengths, and improvement suggestions
- 💳 **Payment Integration** - Stripe integration for premium features
- 📜 **Report History** - Access all past evaluations
- 🎨 **Modern UI** - Beautiful, responsive interface with dark/light theme
- 🔒 **Database Security** - Row-level security with Turso/Supabase

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.x or higher
- **Bun** (recommended) or npm/yarn/pnpm
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/taskeval.git
cd taskeval
```

2. **Install dependencies**
```bash
# Using bun (recommended)
bun install

# Or using npm
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory and add the following variables:

```env
# Database Configuration (Turso)
TURSO_CONNECTION_URL=your_turso_connection_url_here
TURSO_AUTH_TOKEN=your_turso_auth_token_here

# Authentication (Better Auth)
BETTER_AUTH_SECRET=your_better_auth_secret_here
BETTER_AUTH_URL=http://localhost:3000

# AI API (Google Gemini)
GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key_here

# Payment Processing (Stripe) - Optional
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Set up the database**
```bash
# Push database schema
bun run db:push

# Or using npm
npm run db:push
```

5. **Run the development server**
```bash
# Using bun
bun run dev

# Or using npm
npm run dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🔑 Environment Variables Reference

### Required Variables

| Variable | Description | How to Get |
|----------|-------------|------------|
| `TURSO_CONNECTION_URL` | Turso database connection URL | Create a database at [turso.tech](https://turso.tech) |
| `TURSO_AUTH_TOKEN` | Turso authentication token | Generate from Turso dashboard |
| `BETTER_AUTH_SECRET` | Secret key for authentication | Generate using: `openssl rand -base64 32` |
| `GOOGLE_GEMINI_API_KEY` | Google Gemini AI API key | Get from [Google AI Studio](https://makersuite.google.com/app/apikey) |

### Optional Variables

| Variable | Description | Required For |
|----------|-------------|--------------|
| `STRIPE_SECRET_KEY` | Stripe secret API key | Payment processing |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Payment processing |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Payment webhooks |
| `BETTER_AUTH_URL` | Base URL for auth callbacks | Production deployment |
| `NEXT_PUBLIC_APP_URL` | Public app URL | Production deployment |

## 📦 Getting API Keys

### 1. Turso Database (Required)

1. Visit [turso.tech](https://turso.tech) and create an account
2. Create a new database
3. Copy the `TURSO_CONNECTION_URL` from dashboard
4. Generate an authentication token and copy `TURSO_AUTH_TOKEN`

### 2. Google Gemini AI (Required)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key
5. Copy the key as `GOOGLE_GEMINI_API_KEY`

### 3. Better Auth Secret (Required)

Generate a secure random string:
```bash
openssl rand -base64 32
```
Copy the output as `BETTER_AUTH_SECRET`

### 4. Stripe (Optional - for payments)

1. Create account at [stripe.com](https://stripe.com)
2. Go to Developers → API keys
3. Copy the **Secret key** as `STRIPE_SECRET_KEY`
4. Copy the **Publishable key** as `STRIPE_PUBLISHABLE_KEY`
5. Set up webhooks and copy the secret as `STRIPE_WEBHOOK_SECRET`

## 🛠️ Available Scripts

```bash
# Development
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint

# Database
bun run db:push      # Push schema to database
bun run db:studio    # Open Drizzle Studio
bun run db:generate  # Generate migrations
bun run db:migrate   # Run migrations
```

## 🏗️ Project Structure

```
taskeval/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (auth)/            # Authentication pages
│   │   │   ├── login/         # Login page
│   │   │   └── signup/        # Signup page
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   │   └── dashboard/     
│   │   │       ├── submit/    # Task submission
│   │   │       ├── task/      # Task details
│   │   │       ├── reports/   # Report history
│   │   │       └── payment/   # Payment pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── tasks/         # Task management
│   │   │   ├── evaluations/   # AI evaluation
│   │   │   └── payments/      # Payment processing
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/                # Shadcn UI components
│   │   └── demo/              # Demo components
│   ├── db/                    # Database
│   │   ├── schema.ts          # Drizzle schema
│   │   └── index.ts           # Database client
│   ├── lib/                   # Utilities
│   │   ├── auth.ts            # Auth configuration
│   │   └── auth-client.ts     # Auth client
│   └── hooks/                 # Custom React hooks
├── drizzle/                   # Database migrations
├── public/                    # Static assets
├── .env                       # Environment variables
├── middleware.ts              # Next.js middleware
├── drizzle.config.ts          # Drizzle configuration
├── next.config.ts             # Next.js configuration
└── package.json               # Dependencies
```

## 🔐 Authentication

TaskEval uses [Better Auth](https://www.better-auth.com/) for secure authentication:

- Email/password authentication
- Session management
- Protected routes via middleware
- Secure password hashing

## 🤖 AI Integration

Powered by **Google Gemini API**:

- Code quality analysis
- Scoring algorithm (0-100)
- Identifies strengths
- Suggests improvements
- Supports 15+ programming languages

## 💾 Database

Using **Turso** (libSQL) with **Drizzle ORM**:

- Type-safe database queries
- Automatic migrations
- Row-level security
- Edge-ready performance

## 🎨 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn UI + Radix UI
- **Database:** Turso (libSQL) + Drizzle ORM
- **Authentication:** Better Auth
- **AI:** Google Gemini
- **Payments:** Stripe
- **Deployment:** Vercel

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Update these in your production environment:
```env
BETTER_AUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 📝 Usage

1. **Sign Up** - Create an account
2. **Submit Code** - Upload your coding task
3. **Get Evaluation** - AI analyzes your code instantly
4. **View Results** - See score, strengths, and improvements
5. **Upgrade** - Unlock detailed reports with premium
6. **Track Progress** - Access all past evaluations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues

**Database connection failed**
- Verify `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN` are correct
- Check if database exists in Turso dashboard

**AI evaluation not working**
- Ensure `GOOGLE_GEMINI_API_KEY` is valid
- Check API quota in Google AI Studio

**Authentication errors**
- Regenerate `BETTER_AUTH_SECRET`
- Clear browser cookies and try again

**Build errors**
- Delete `node_modules` and `.next` folders
- Run `bun install` again
- Check Node.js version (18.x or higher)

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review documentation

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Better Auth](https://www.better-auth.com/)
- [Turso](https://turso.tech/)
- [Google Gemini](https://ai.google.dev/)
- [Vercel](https://vercel.com/)

---

<div align="center">
  Made with ❤️ by Swapnanil
</div>
