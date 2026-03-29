# CLAUDE.md for BuildMyRide

## What This Is
When working with this codebase, prioritize shipping over perfection. This is an FYP with a 2-month deadline. Ask clarifying questions before making architectural changes. Never refactor working code unless asked.

## About This Project
BuildMyRide is a web-based car customization platform with two core modules:
1. **3D Configurator** — Users build custom cars by swapping parts on a 3D model (React Three Fiber)
2. **AI Image Modifier** — Users upload car photos, AI segments the car (SAM), and users modify individual parts (color, wrap, tint)

Additional features: community gallery, user auth, draft auto-save, AI-powered part recommendations.

## Tech Stack
- **Frontend:** Next.js 14+ (App Router), React Three Fiber (Three.js), MUI (Material UI v5), Framer Motion
- **Forms:** React Hook Form + Zod (via @hookform/resolvers/zod)
- **Backend:** Node.js + Express (separate server, not Next.js API routes)
- **Database:** MongoDB Atlas (connection string in .env)
- **ODM:** Mongoose
- **Auth:** JWT (`jsonwebtoken`) + `bcryptjs` (salt: 12)
- **Image Storage:** Cloudinary
- **AI/ML:** Replicate API (SAM for segmentation), custom recommendation engine
- **Package Manager:** npm

## Architecture Decision: Why Separate Express Backend?
Next.js handles the frontend + SSR. Express handles all API logic separately. This keeps concerns clean:
- Next.js: pages, routing, SSR for gallery/public pages, React components
- Express: REST API, auth, database, file uploads, AI processing
- Frontend calls Express API via `NEXT_PUBLIC_API_URL` env var

## Frontend Architecture: Feature-Based with Thin App Router

The `app/` directory handles ONLY routing — page files are thin wrappers that import and render feature components. All actual logic, components, hooks, API calls, and types live OUTSIDE `app/` in feature modules or shared folders.

**Rule: If it's not a route definition, it doesn't belong in `app/`.**

## Project Structure
```
BuildMyRide/
├── client/                          # Next.js frontend
│   ├── app/                         # ROUTING ONLY — thin page files
│   │   ├── layout.jsx               # Root layout (ThemeProvider + AnimatePresence)
│   │   ├── page.jsx                 # Landing → imports from features/landing
│   │   ├── loading.jsx              # Global loading state
│   │   ├── error.jsx                # Global error boundary
│   │   ├── (auth)/
│   │   │   ├── login/page.jsx       # → imports LoginPage from features/auth
│   │   │   └── register/page.jsx    # → imports RegisterPage from features/auth
│   │   ├── configurator/
│   │   │   └── page.jsx             # → imports ConfiguratorPage from features/configurator
│   │   ├── modifier/
│   │   │   └── page.jsx             # → imports ModifierPage from features/modifier
│   │   ├── gallery/
│   │   │   ├── page.jsx             # → imports GalleryPage from features/gallery
│   │   │   └── [id]/page.jsx        # → imports BuildDetailPage from features/gallery
│   │   └── dashboard/
│   │       ├── page.jsx             # → imports DashboardPage from features/dashboard
│   │       ├── drafts/page.jsx      # → imports DraftsPage from features/dashboard
│   │       ├── sessions/page.jsx    # → imports SessionsPage from features/dashboard
│   │       └── settings/page.jsx    # → imports SettingsPage from features/dashboard
│   │
│   ├── features/                    # FEATURE MODULES — all logic lives here
│   │   ├── auth/
│   │   │   ├── components/          # LoginForm, RegisterForm, AuthLayout, PasswordStrength
│   │   │   ├── api/                 # login(), register(), refreshToken(), logout()
│   │   │   ├── hooks/               # useAuth, useAuthGuard, useLoginForm
│   │   │   └── schemas/             # loginSchema, registerSchema (Zod)
│   │   │
│   │   ├── configurator/
│   │   │   ├── components/          # CarCanvas, PartSelector, ColorPicker, PartPanel, BuildSummary
│   │   │   ├── api/                 # fetchCarModel(), fetchParts(), saveConfiguration()
│   │   │   ├── hooks/               # useConfigurator, usePartSwap, useAutoSaveDraft
│   │   │   └── schemas/             # saveConfigSchema, bodyColorSchema (Zod)
│   │   │
│   │   ├── modifier/
│   │   │   ├── components/          # ImageUploader, SegmentCanvas, ModificationPanel, BeforeAfter
│   │   │   ├── api/                 # uploadImage(), runSegmentation(), saveModifiedImage()
│   │   │   ├── hooks/               # useImageSession, useSegmentation, useCanvasOverlay
│   │   │   └── schemas/             # imageUploadSchema, modificationSchema (Zod)
│   │   │
│   │   ├── gallery/
│   │   │   ├── components/          # GalleryGrid, BuildCard, BuildDetail, LikeButton, FilterBar
│   │   │   ├── api/                 # fetchGallery(), likeBuild(), shareToGallery()
│   │   │   ├── hooks/               # useGalleryFeed, useInfiniteScroll, useLike
│   │   │   └── schemas/             # shareToGallerySchema, galleryFilterSchema (Zod)
│   │   │
│   │   ├── dashboard/
│   │   │   ├── components/          # BuildsList, DraftsList, SessionsList, SettingsForm, Sidebar
│   │   │   ├── api/                 # fetchMyBuilds(), deleteBuild(), updateProfile()
│   │   │   ├── hooks/               # useMyBuilds, useDrafts, useProfile
│   │   │   └── schemas/             # updateProfileSchema, changePasswordSchema (Zod)
│   │   │
│   │   └── landing/
│   │       ├── components/          # Hero, FeatureSplit, HowItWorks, GalleryPreview, CTASection
│   │       └── hooks/               # useScrollAnimation
│   │
│   ├── components/                  # SHARED components used across features
│   │   ├── layout/                  # Navbar, Footer, PageWrapper (Framer Motion transitions)
│   │   └── ui/                      # MotionCard, LoadingSpinner, ConfirmDialog, EmptyState
│   │
│   ├── hooks/                       # SHARED hooks used across features
│   │   ├── useApi.js                # Centralized axios instance + interceptors (base URL, auth headers, token refresh — ALL backend calls go through this)
│   │   └── useMediaQuery.js         # Responsive breakpoint hook
│   │
│   ├── store/                       # SHARED state (React Context)
│   │   └── AuthContext.jsx          # Auth state provider (wraps app, contains JSX)
│   │
│   ├── theme/                       # MUI theme configuration
│   │   ├── theme.js                 # Dark theme definition (pure config, no JSX)
│   │   └── ThemeRegistry.jsx        # MUI + Next.js App Router SSR setup (contains JSX)
│   │
│   ├── utils/                       # SHARED utilities
│   │   ├── constants.js             # App-wide constants (part types, enums)
│   │   ├── formatters.js            # Date, number formatters
│   │   └── validation.js            # Shared Zod schemas (reused across features)
│   │
│   ├── public/
│   │   └── models/                  # .glb 3D model files
│   ├── next.config.js
│   └── package.json
│
├── server/                          # Express backend
│   ├── src/
│   │   ├── controllers/             # Route handlers
│   │   ├── models/                  # Mongoose schemas
│   │   ├── routes/                  # Express routes
│   │   ├── middleware/              # Auth, error handling, validation
│   │   ├── services/                # Business logic (AI, recommendations)
│   │   ├── utils/                   # Helpers
│   │   └── config/                  # DB connection, cloudinary, env
│   ├── package.json
│   └── .env                         # NEVER commit this
├── CLAUDE.md                        # This file
├── .gitignore
└── README.md
```

## Page File Pattern (Thin Router)

Every page file in `app/` follows this exact pattern — import and render, nothing else:

```jsx
// app/configurator/page.jsx
import ConfiguratorPage from '@/features/configurator/components/ConfiguratorPage';

export const metadata = { title: 'Configurator | BuildMyRide' };

export default function Page() {
  return <ConfiguratorPage />;
}
```

For pages that need SSR data (like gallery):
```jsx
// app/gallery/page.jsx
import GalleryPage from '@/features/gallery/components/GalleryPage';

export const metadata = { title: 'Gallery | BuildMyRide' };

export default async function Page({ searchParams }) {
  // Server-side data fetching goes here if needed
  return <GalleryPage filters={searchParams} />;
}
```

**ALL component logic, state, effects, and UI live in the feature module — never in the page file.**

## Feature Module Rules

1. **Each feature is self-contained.** A feature's `components/`, `api/`, `hooks/`, and `schemas/` folders contain everything that feature needs.
2. **Features never import from other features.** If two features need the same thing, it goes in the shared `components/`, `hooks/`, or `utils/` at the root level.
3. **API layer per feature.** Each feature has its own `api/` folder with functions that call the Express backend. These use the shared `useApi` hook/axios instance from `hooks/useApi.js`.
4. **Zod schemas per feature.** Each feature has a `schemas/` folder containing Zod validation schemas for its forms. These are used with `react-hook-form` via `@hookform/resolvers/zod`. No standalone type files — this is plain JS, not TypeScript.
5. **One "Page" component per feature.** e.g., `features/auth/components/LoginPage.jsx` is the full login page component. The `app/` page file just imports and renders it.

### Zod + React Hook Form Pattern
```jsx
// features/auth/schemas/loginSchema.js
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
```

```jsx
// features/auth/components/LoginForm.jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../schemas/loginSchema';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(loginSchema),
});
```

**Rule:** All form validation goes through Zod schemas — never manual validation logic in components. Backend also validates independently (don't trust the client).

## Database
- MongoDB Atlas, database name: `BuildMyRide`
- 8 collections: users, carmodels, parts, configurations, drafts, imagesessions, gallery, partanalytics
- All schemas have JSON validation at the DB level
- Drafts collection has TTL index (auto-deletes after 7 days)
- See `server/src/models/` for Mongoose schemas

## Common Commands
```bash
# Client (Next.js)
cd client && npm run dev          # Start frontend dev server (port 3000)
cd client && npm run build        # Production build
cd client && npm start            # Start production server

# Server (Express)
cd server && npm run dev          # Start backend with nodemon (port 5000)
cd server && npm start            # Production start

# Database
node server/scripts/setup-db.js   # Create collections + indexes
node server/scripts/seed-db.js    # Populate test data

# Testing
cd client && npm test
cd server && npm test
```

## Environment Variables

### client/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

### server/.env
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=
JWT_REFRESH_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
REPLICATE_API_TOKEN=
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## Coding Standards

### General
- Use ES6+ syntax everywhere (arrow functions, destructuring, template literals)
- **ES Modules only:** Use `import/export`. No `require()` anywhere in the codebase.
- Async/await over .then() chains
- Meaningful variable names — never use generic names like `data`, `info`, `item`, `stuff`. Use `carModel`, `filterSettings`, `userProfile`, `segmentMask`.
- No console.log in production code — use a logger or remove before committing
- **Single Responsibility:** Each function should do ONE thing. If a function exceeds 50 lines, break it down.
- **DRY:** If logic is used more than twice, extract it to `utils/` (backend) or `hooks/` / `utils/` (frontend).
- **Tech Debt Flagging:** If a solution is quick and dirty, mark it with `// TODO: TECH DEBT - <reason>` and describe the scalable alternative. Never leave silent shortcuts.
- **Performance:** Prefer native JS over external libraries. Don't install Lodash for one function — use native `.map()`, `.filter()`, `.reduce()`, `structuredClone()`, etc.
- **File extensions:** `.jsx` for all files containing JSX or rendering UI. `.js` for pure logic (services, utils, schemas, api clients). This is mandatory — no JSX in `.js` files.

### JSDoc (Mandatory — No TypeScript Safety Net)
Every exported function MUST have a JSDoc block. This is how we prevent AI tools and teammates from guessing data shapes.
```js
/**
 * Fetches compatible parts for a given car model.
 * @param {string} carModelId - MongoDB ObjectId as string
 * @param {string} partType - One of PART_TYPES enum
 * @returns {Promise<Array<{_id: string, name: string, thumbnail: string}>>}
 */
export const fetchCompatibleParts = async (carModelId, partType) => { ... };
```
No exceptions. If a function is exported, it gets JSDoc. Internal helper functions within the same file can skip it if trivially obvious.

### Frontend (Next.js + MUI + Framer Motion + Feature-Based)
- Functional components only, no class components
- Custom hooks for shared logic (prefix with `use`)
- Component files: PascalCase (CarConfigurator.jsx)
- Keep components under 200 lines — extract sub-components if larger
- Use React Three Fiber patterns for 3D — no raw Three.js DOM manipulation

#### Feature Module Rules
- Features live in `client/features/` — each has `components/`, `api/`, `hooks/`, `types/`
- Features NEVER import from other features — shared code goes in root-level `components/`, `hooks/`, `utils/`
- `app/` directory is ROUTING ONLY — page files import from features and render, nothing else
- API functions in `features/[name]/api/` use the shared axios instance from `hooks/useApi.js`
- One "Page" component per feature (e.g., `LoginPage.jsx`) — the `app/` page file just wraps it

#### MUI Rules
- ALL styling goes through MUI's `sx` prop or `styled()` utility — no inline CSS objects, no Tailwind, no CSS modules
- Use theme tokens everywhere: `theme.palette.primary.main`, `theme.spacing(2)`, `theme.typography.h6`
- Never hardcode colors — always reference the theme. The theme is the single source of truth for all design tokens.
- Use MUI components over custom HTML: `<Box>` not `<div>`, `<Typography>` not `<p>`, `<Stack>` not flex divs
- For layout: `<Box>`, `<Stack>`, `<Grid>`, `<Container>` — in that order of preference
- For responsive: use `sx={{ display: { xs: 'none', md: 'block' } }}` breakpoint syntax
- Component overrides go in `theme/theme.js` under `components` key, not scattered in files
- Import from `@mui/material` and `@mui/icons-material` only — no `@mui/lab` unless explicitly approved
- Forms: Use MUI's `<TextField>` with React Hook Form's `register()` or `<Controller>`. Zod handles validation — never use MUI's built-in validation props (like `required` or `inputProps.pattern`). Error messages come from Zod schema, displayed via `error` and `helperText` props on `<TextField>`.

#### Framer Motion Rules
- Use for page transitions, component mount/unmount, hover states, and scroll-triggered animations
- Wrap page content in `<motion.div>` with `initial`, `animate`, `exit` props for page transitions
- `<AnimatePresence>` lives in the root layout — do not duplicate it
- Standard page transition: `{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 } }`
- Use `whileHover` and `whileTap` for interactive elements instead of MUI's built-in hover
- Stagger children with `variants` and `staggerChildren` — never manual delay arrays
- Keep durations between 0.2s - 0.6s. Nothing should feel slow or flashy.
- Use `layout` prop for smooth layout animations when elements reorder
- For 3D page: DO NOT animate the Three.js canvas with Framer Motion — animate only the UI panels around it

#### Next.js App Router Rules
- Use `'use client'` directive only on components that need browser APIs, state, or effects
- Server components by default — mark client components explicitly
- Page-level data fetching in server components where possible
- Use `next/image` for all images (not `<img>`) — Cloudinary URLs are fine with next/image
- Use `next/link` for all internal navigation (not `<a>`)
- Loading states: use `loading.jsx` files in route directories
- Error states: use `error.jsx` files in route directories
- Metadata: export `metadata` object from page.jsx for SEO (especially gallery pages)
- All page/layout files in `app/` use `.jsx` extension (they contain JSX)

### Backend (Express)
- **Controller → Service → Model pattern:** Controllers handle `req` and `res` only. Services handle business logic (DB calls, AI processing, calculations). Controllers never touch Mongoose directly.
- **Zod validation on every mutation:** Every POST/PUT/PATCH route must validate `req.body` with a Zod schema in middleware BEFORE hitting the controller. Never trust client data.
- **Centralized error handling:** Use a global error-handling middleware (`middleware/errorHandler.js`). Never write `try/catch` blocks that just `console.log` the error — use `catchAsync` wrapper and let errors bubble to the global handler.
- **Stateless:** The Express server must remain stateless — no in-memory session stores, no server-side state between requests. All state lives in MongoDB or JWTs. This allows horizontal scaling if ever needed.
- Return consistent JSON responses: `{ success: boolean, data?: any, error?: string }`
- HTTP status codes: 200 (ok), 201 (created), 400 (bad request), 401 (unauthorized), 404 (not found), 500 (server error)
- Mongoose queries: always use .lean() for read-only operations
- CORS configured to allow CLIENT_URL only

### Authentication (Express)
- Use `jsonwebtoken` for all token operations. Access token: 15min expiry. Refresh token: 7 days.
- Always use `Bearer <token>` format in the Authorization header.
- Never store raw passwords. Use `bcryptjs` with salt rounds of **12**.
- Protect all private routes using `isAuth` middleware in `middleware/auth.js`.
- Admin routes additionally use `isAdmin` middleware in `middleware/adminAuth.js`.
- Token refresh flow: client sends expired access token + valid refresh token → server issues new pair.

### Git
- Branch naming: feature/xyz, bugfix/xyz, hotfix/xyz
- Commit messages: conventional commits (feat:, fix:, chore:, docs:)
- Never push to main directly — use feature branches + merge
- .env files are NEVER committed

### Import Paths
Use Next.js `@/` alias (configured in jsconfig.json or tsconfig.json). Never use relative paths that go up more than one level.
```
@/features/auth/components/LoginForm    ✅
@/components/ui/MotionCard              ✅
@/hooks/useApi                          ✅
@/theme/theme                           ✅
../../components/SomeComponent          ❌ (use @ alias)
./ChildComponent                        ✅ (same directory is fine)
```

## MUI Theme Configuration

The theme lives in `client/theme/theme.js`. This is the single source of truth for all design tokens:

```javascript
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFFFFF',
      contrastText: '#000000',
    },
    secondary: {
      main: '#A0C4FF',
    },
    background: {
      default: '#000000',
      paper: '#0A0A0A',
    },
    surface: {
      main: '#111111',
      border: '#1A1A1A',
      borderHover: '#333333',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#999999',
      disabled: '#444444',
    },
    error: { main: '#FF6B6B' },
    success: { main: '#6BFF8E' },
  },
  typography: {
    fontFamily: '"Inter", "Outfit", system-ui, sans-serif',
    h1: { fontWeight: 300, letterSpacing: '0.15em', textTransform: 'uppercase' },
    h2: { fontWeight: 300, letterSpacing: '0.15em', textTransform: 'uppercase' },
    h3: { fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase' },
    h4: { fontWeight: 400, letterSpacing: '0.05em' },
    body1: { fontWeight: 400, lineHeight: 1.7 },
    body2: { fontWeight: 400, lineHeight: 1.6, color: '#999999' },
    button: { fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, padding: '12px 24px', transition: 'all 0.3s ease' },
        outlined: {
          borderColor: '#333333', color: '#FFFFFF',
          '&:hover': { borderColor: '#666666', backgroundColor: 'rgba(255,255,255,0.05)' },
        },
        contained: {
          backgroundColor: '#FFFFFF', color: '#000000',
          '&:hover': { backgroundColor: '#E0E0E0', transform: 'scale(1.02)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 12,
          transition: 'border-color 0.3s ease',
          '&:hover': { borderColor: '#333333' },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'standard' },
      styleOverrides: {
        root: {
          '& .MuiInput-underline:before': { borderBottomColor: '#333333' },
          '& .MuiInput-underline:hover:before': { borderBottomColor: '#666666' },
          '& .MuiInput-underline:after': { borderBottomColor: '#A0C4FF' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
});
```

NEVER override these tokens in individual components. If something needs a visual change, update the theme first.

## ThemeRegistry (MUI + Next.js App Router SSR)

MUI with Next.js App Router requires a ThemeRegistry component to handle server-side rendering of styles. This file lives at `client/theme/ThemeRegistry.jsx` and wraps the app in `layout.jsx`. It uses `@mui/material-nextjs/v14-appRouter` for proper style injection.

```
npm install @mui/material-nextjs @emotion/cache
```

This is a known setup step — do not skip it or styles will flash/break on page load.

## Framer Motion Patterns

### Page transitions
AnimatePresence lives in root layout.jsx. Each page wraps content:
```jsx
'use client';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function PageName() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* content */}
    </motion.div>
  );
}
```

### Stagger lists/cards
```jsx
const containerVariants = { animate: { transition: { staggerChildren: 0.08 } } };
const itemVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
```

### Scroll-triggered animations
```jsx
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const ref = useRef(null);
const isInView = useInView(ref, { once: true, margin: '-100px' });

<motion.div ref={ref} initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}>
```

## 3D / AR Performance Rules
- **Memory Management:** ALWAYS provide a cleanup function in `useEffect` to dispose of Three.js geometries, materials, and textures. Failing to do this causes memory leaks that crash the browser on longer sessions.
```jsx
useEffect(() => {
  return () => {
    geometry.dispose();
    material.dispose();
    texture?.dispose();
  };
}, []);
```
- **Main Thread Hygiene:** If an AR/AI calculation is heavy (e.g., image segmentation processing), move it to a **Web Worker**. Never block the main thread — the 3D canvas will freeze.
- **Lazy Loading:** Lazy-load 3D models with React's `<Suspense>` and R3F's `useGLTF.preload()`. Show a loading skeleton while models load.
- Car models are in .glb format stored in client/public/models/
- Parts are separate meshes within the .glb file, named by part type
- Use React Three Fiber's useGLTF hook to load models
- Target < 500k total polygons for web performance
- Parts are swapped by hiding/showing meshes and loading replacement .glb parts
- 3D canvas is a client component ('use client') — never attempt SSR on Three.js

## AI/ML Integration
- SAM (Segment Anything Model) is accessed via Replicate API
- Flow: upload image → send to Replicate → receive segmentation masks → display on canvas
- Segments are labeled: body, windows, wheels, hood, bumpers, etc.
- Modifications (color, wrap, tint) are applied as canvas overlays on detected segments
- Recommendation engine uses co-occurrence data from part_analytics collection

## Important Warnings
- DO NOT upgrade Three.js beyond r128 — React Three Fiber compatibility issues
- DO NOT use CapsuleGeometry (introduced in r142, not available in r128)
- ALWAYS check .env exists before running server
- Cloudinary URLs must use HTTPS
- MongoDB Atlas free tier: 512MB limit — store images on Cloudinary, not in DB
- Draft auto-save interval: 30 seconds — debounce properly to avoid rate limiting
- MUI: NEVER use Tailwind alongside MUI — they conflict. MUI's sx prop and theme handle everything.
- Next.js: 3D components (React Three Fiber) MUST be client components. Never render Three.js on server.
- Framer Motion: AnimatePresence must be in a client component — root layout needs 'use client' or wrap in a client boundary.
- next/image: Add Cloudinary domain to next.config.js `images.remotePatterns` or images will fail.

## Skills Note
ui-ux-pro-max skill: Always use --stack nextjs. 
Output must be adapted to MUI sx prop — never use Tailwind directly.
