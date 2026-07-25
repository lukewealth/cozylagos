# Cozy Lagos - Dev-to-Agent Management Loop System

## Overview
This document defines the agentic workflow for managing the Cozy Lagos luxury hospitality platform. It establishes a continuous loop between human developers and AI agents to track changes, identify bugs, understand architecture, fix issues, and automate responses.

## Project Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: MongoDB Atlas + IndexedDB (hybrid)
- **Authentication**: JWT + Firebase Auth
- **Analytics**: Vercel Analytics + Firebase Analytics
- **Deployment**: Vercel

### Directory Structure
```
cozylagoss/
├── api/                    # Vercel serverless API endpoints
│   ├── auth/[...path].ts   # Authentication endpoints
│   ├── admin/[...path].ts  # Admin operations
│   ├── crm/[...path].ts    # CRM tickets & notifications
│   ├── provider/[...path].ts # Service provider management
│   ├── users.ts            # User CRUD
│   ├── listings.ts         # Property listings
│   ├── bookings.ts         # Booking management
│   ├── services.ts         # VIP services
│   ├── staff.ts            # Staff management
│   ├── assets.ts           # Asset management
│   ├── transactions.ts     # Financial transactions
│   ├── experiences.ts      # Experience catalog
│   └── health.ts           # Health check
├── src/
│   ├── components/         # React components
│   ├── portals/            # Dashboard portals
│   ├── stores/             # Zustand state stores
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities & services
│   │   ├── firebase.ts     # Firebase configuration
│   │   ├── firebaseAuth.ts # Firebase auth service
│   │   ├── mongodb.ts      # MongoDB connection
│   │   ├── security.ts     # JWT, encryption, validation
│   │   ├── middleware.ts   # API middleware
│   │   ├── syncEngine.ts   # Hybrid DB sync
│   │   └── imageManager.ts # Image resolution
│   ├── services/           # API client
│   └── data/               # Static data
├── public/assets/images/   # Local image assets
│   ├── explore/            # Primary images
│   ── secondary/          # Transition images
└── AGENTS.md               # This file
```

## Dev-to-Agent Management Loop

### Phase 1: Track Changes
```
Developer Action → Git Commit → Agent Analysis → Change Log Update
```

**Agent Responsibilities:**
- Monitor git commits and pull requests
- Analyze code changes for patterns
- Update CHANGELOG.md automatically
- Identify breaking changes
- Track dependency updates

**Commands:**
```bash
# View recent changes
git log --oneline -20

# Analyze specific commit
git show <commit-hash>

# Track file changes
git diff --stat main
```

### Phase 2: Identify Bugs
```
Code Analysis → Bug Detection → Issue Creation → Priority Assignment
```

**Agent Workflow:**
1. Run build checks: `npm run build`
2. Run type checks: `npm run lint`
3. Run tests: `npm run test:run`
4. Analyze error patterns
5. Create GitHub issues with context

**Bug Categories:**
- **Critical**: Build failures, security vulnerabilities
- **High**: Runtime errors, data corruption
- **Medium**: UI/UX issues, performance problems
- **Low**: Code style, minor improvements

### Phase 3: Understand Architecture
```
Codebase Scan → Dependency Graph → Architecture Map → Documentation Update
```

**Architecture Components:**
1. **Frontend Layer**: React components with responsive design
2. **API Layer**: Vercel serverless functions with JWT auth
3. **Database Layer**: MongoDB Atlas + IndexedDB hybrid
4. **Auth Layer**: Firebase Auth + JWT tokens
5. **Sync Layer**: 30-second bidirectional sync

**Key Flows:**
- User books property → API creates booking → MongoDB stores → IndexedDB caches
- Admin sends notification → CRM API processes → Email service triggers
- Provider updates service → Cloud sync → Local IndexedDB updates

### Phase 4: Fix Bugs
```
Issue Analysis → Root Cause → Fix Implementation → Test Verification → Deploy
```

**Fix Process:**
1. Reproduce the bug
2. Identify root cause
3. Implement fix with minimal changes
4. Run tests to verify
5. Build and deploy
6. Monitor for regressions

**Example Fix Workflow:**
```bash
# 1. Check build status
npm run build

# 2. Run tests
npm run test:run

# 3. Fix the issue
# Edit relevant files...

# 4. Verify fix
npm run build && npm run test:run

# 5. Commit and push
git add -A && git commit -m "fix: <description>" && git push origin main
```

### Phase 5: Automate Responses
```
Trigger Event → Agent Detection → Automated Action → Notification
```

**Automation Rules:**
- **Build Failure**: Auto-create issue, notify team
- **Test Failure**: Auto-rollback, create bug report
- **Security Alert**: Immediate notification, auto-patch if possible
- **Performance Drop**: Analyze bundle size, optimize images
- **Dependency Update**: Auto-test, create PR if passing

## Business Goals

### Primary Objectives
1. **Luxury Experience**: Provide premium hospitality services in Lagos
2. **Seamless Booking**: Frictionless property and service reservations
3. **Provider Empowerment**: Tools for service providers to manage offerings
4. **Admin Control**: Comprehensive platform management
5. **Mobile-First**: Responsive design across all devices

### Success Metrics
- Booking conversion rate
- Provider onboarding time
- Admin task completion time
- Mobile user satisfaction
- Platform uptime (99.9% target)

## Automated Workflows

### Daily Checks
```bash
# Morning health check
npm run build && npm run test:run

# Dependency audit
npm audit

# Bundle size check
npm run build && ls -lh dist/assets/
```

### Pre-Deploy Checklist
- [ ] Build passes without errors
- [ ] All tests passing
- [ ] No critical security vulnerabilities
- [ ] Bundle size within limits (< 2MB)
- [ ] Mobile responsive verified
- [ ] API endpoints functional

### Post-Deploy Verification
- [ ] Vercel deployment successful
- [ ] Health check endpoint responds
- [ ] User flows working
- [ ] No console errors
- [ ] Analytics tracking active

## Code Standards

### TypeScript
- Strict mode enabled
- No `any` types without justification
- Proper interface definitions
- Type-safe API responses

### React
- Functional components only
- Hooks for state management
- Proper error boundaries
- Lazy loading for routes

### API Design
- RESTful endpoints
- JWT authentication
- Rate limiting
- Input validation
- Error handling

### Security
- Password hashing (scrypt)
- JWT token expiration
- CORS configuration
- Input sanitization
- SQL injection prevention

## Agent Commands

### Analysis Commands
```bash
# Analyze codebase structure
find src -type f -name "*.tsx" | wc -l

# Check test coverage
npm run test:coverage

# Analyze bundle size
npm run build && npx source-map-explorer dist/assets/*.js
```

### Fix Commands
```bash
# Auto-fix linting issues
npm run lint -- --fix

# Update dependencies safely
npm update

# Clean build cache
rm -rf dist node_modules/.cache
```

### Monitoring Commands
```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs <deployment-url>

# Check analytics
# (Via Vercel dashboard or Firebase console)
```

## Integration Points

### Firebase Services
- **Authentication**: User login/registration
- **Analytics**: User behavior tracking
- **Firestore**: Real-time data sync
- **Storage**: Image and file uploads

### MongoDB Collections
- `users` - User accounts
- `listings` - Property listings
- `bookings` - Booking records
- `transactions` - Financial transactions
- `services` - VIP services
- `staff` - Staff members
- `assets` - Physical assets
- `tickets` - CRM support tickets
- `notifications` - Push notifications

### Vercel Functions
- `/api/auth/*` - Authentication
- `/api/admin/*` - Admin operations
- `/api/crm/*` - CRM and notifications
- `/api/provider/*` - Provider management
- `/api/*` - Core CRUD operations

## Continuous Improvement

### Feedback Loop
1. Monitor user feedback
2. Analyze usage patterns
3. Identify pain points
4. Implement improvements
5. Measure impact
6. Iterate

### Performance Optimization
- Image optimization (WebP/AVIF)
- Code splitting
- Lazy loading
- Caching strategies
- CDN utilization

### Security Updates
- Regular dependency audits
- Security patch application
- Penetration testing
- Compliance checks

---

**Last Updated**: 2024
**Maintained By**: Dev-to-Agent Management System
**Version**: 1.0.0
