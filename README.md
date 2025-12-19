# SolarSys - Solar Lead Platform - Solar Lead Acquisition Platform

A next-generation solar lead acquisition platform designed for the Brazilian market. Built with React, TypeScript, and deployed on Cloudflare Pages with Supabase backend.

## 🌟 Features

- **Intelligent Lead Qualification**: Automatic qualification based on Lei 14.300 regulations
- **Visual Storytelling**: Minimalist line art with smooth SVG animations
- **WhatsApp Integration**: Pre-formatted messages for seamless sales handoff
- **Admin Dashboard**: Lead management with filtering, sorting, and UTM tracking
- **Brazilian Localization**: Full Portuguese interface with proper currency and phone formatting
- **Edge-First Architecture**: Deployed on Cloudflare Pages for global performance
- **Secure by Design**: Row Level Security (RLS) with Supabase
- **PWA Ready**: Service worker and manifest for offline capabilities

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Cloudflare account (for deployment)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd solarsys

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to Cloudflare Pages
- `npm run deploy:preview` - Deploy preview to Cloudflare Pages

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, Shadcn UI, Framer Motion
- **State Management**: Zustand
- **Forms**: React Hook Form
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Cloudflare Pages
- **Testing**: Vitest, Fast-check (Property-Based Testing)

## 📊 Project Structure

```
solarsys/
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── lib/            # Utilities and services
│   ├── stores/         # Zustand stores
│   ├── hooks/          # Custom React hooks
│   ├── tests/          # Test files
│   └── types/          # TypeScript types
├── functions/          # Cloudflare Functions
├── public/            # Static assets
├── supabase/          # Database migrations
└── .kiro/specs/       # Feature specifications
```

## 🚢 Deployment

### Automated Deployment (GitHub Actions)

1. Push code to GitHub
2. Configure GitHub secrets (see [DEPLOYMENT.md](DEPLOYMENT.md))
3. Push to `main` branch to deploy to production
4. Create PR to deploy preview

### Manual Deployment (Wrangler)

```bash
# Build and deploy
npm run deploy

# Or deploy preview
npm run deploy:preview
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 📋 Deployment Checklist

Before deploying to production, review [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md).

## 🧪 Testing

The project uses property-based testing with Fast-check:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📈 Performance

- **Bundle Size**: ~160KB gzipped total
- **First Contentful Paint**: < 1.5s
- **Lighthouse Score**: > 90
- **Code Splitting**: Optimized chunks for vendor, UI, forms, API

## 🔒 Security

- Row Level Security (RLS) with Supabase
- HTTPS only
- Content Security Policy headers
- XSS protection
- Session isolation

## 🌍 Localization

- Full Brazilian Portuguese interface
- Brazilian Real (R$) currency formatting
- Brazilian phone number validation (DDD format)
- CEP postal code validation

## 📝 Documentation

- [Deployment Guide](DEPLOYMENT.md)
- [Deployment Checklist](DEPLOYMENT_CHECKLIST.md)
- [Supabase Setup](SUPABASE_SETUP.md)
- [Feature Specifications](.kiro/specs/solar-lead-platform/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is proprietary and confidential.

## 🆘 Support

For issues and questions:
- Check the documentation
- Review GitHub Issues
- Contact the development team

---

Built with ❤️ for the Brazilian solar market

🚀 **Status**: Ready for deployment!

✅ **GitHub Secrets**: Configured
✅ **Cloudflare Pages**: Connected
