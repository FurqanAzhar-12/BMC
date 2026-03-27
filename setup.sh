#!/bin/bash
# ============================================
# BuildMyRide — Project Scaffold + Claude Code Setup
# ============================================
# Run from the BuildMyRide root directory:
#   chmod +x setup.sh && ./setup.sh
# ============================================

echo "🚗 BuildMyRide — Setting up project..."
echo ""

# ── Client (Next.js) ──────────────────────────

echo "📁 Creating client structure..."

# App router (thin pages only)
mkdir -p client/app/\(auth\)/login
mkdir -p client/app/\(auth\)/register
mkdir -p client/app/configurator
mkdir -p client/app/modifier
mkdir -p client/app/gallery/\[id\]
mkdir -p client/app/dashboard/drafts
mkdir -p client/app/dashboard/sessions
mkdir -p client/app/dashboard/settings

# Features
for feature in auth configurator modifier gallery dashboard landing; do
  mkdir -p client/features/$feature/components
  mkdir -p client/features/$feature/api
  mkdir -p client/features/$feature/hooks
  if [ "$feature" != "landing" ]; then
    mkdir -p client/features/$feature/schemas
  fi
done

# Shared
mkdir -p client/components/layout
mkdir -p client/components/ui
mkdir -p client/hooks
mkdir -p client/store
mkdir -p client/theme
mkdir -p client/utils
mkdir -p client/public/models

echo "  ✅ Client directories created"

# ── Server (Express) ──────────────────────────

echo "📁 Creating server structure..."

mkdir -p server/src/controllers
mkdir -p server/src/models
mkdir -p server/src/routes
mkdir -p server/src/middleware
mkdir -p server/src/services
mkdir -p server/src/utils
mkdir -p server/src/config
mkdir -p server/src/validation
mkdir -p server/scripts

echo "  ✅ Server directories created"

# ── Placeholder files ─────────────────────────

echo "📄 Creating placeholder files..."

# Client placeholders
touch client/app/layout.jsx
touch client/app/page.jsx
touch client/app/loading.jsx
touch client/app/error.jsx
touch client/hooks/useApi.js
touch client/hooks/useMediaQuery.js
touch client/store/AuthContext.jsx
touch client/theme/theme.js
touch client/theme/ThemeRegistry.jsx
touch client/utils/constants.js
touch client/utils/formatters.js
touch client/utils/validation.js

# Server placeholders
touch server/src/config/db.js
touch server/src/config/cloudinary.js
touch server/src/middleware/auth.js
touch server/src/middleware/adminAuth.js
touch server/src/middleware/errorHandler.js
touch server/src/middleware/validate.js
touch server/src/utils/AppError.js
touch server/src/utils/catchAsync.js
touch server/src/routes/index.js
touch server/src/app.js

echo "  ✅ Placeholder files created"

# ── .gitignore ─────────────────────────────────

echo "📄 Creating .gitignore..."

cat > .gitignore << 'GITIGNORE'
# Dependencies
node_modules/
.pnp
.pnp.js

# Build
.next/
out/
build/
dist/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
client/.env.local
server/.env

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# Claude Code (keep settings, ignore local)
.claude/settings.local.json

# Coverage
coverage/
GITIGNORE

echo "  ✅ .gitignore created"

# ── jsconfig.json (@ alias) ───────────────────

echo "📄 Creating jsconfig.json for @ alias..."

cat > client/jsconfig.json << 'JSCONFIG'
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
JSCONFIG

echo "  ✅ jsconfig.json created"

# ── Environment templates ──────────────────────

echo "📄 Creating environment templates..."

cat > client/.env.example << 'ENVEXAMPLE'
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
ENVEXAMPLE

cat > server/.env.example << 'ENVEXAMPLE'
MONGO_URI=mongodb+srv://user:pass@cluster0.xxx.mongodb.net/BuildMyRide
JWT_SECRET=your-jwt-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
REPLICATE_API_TOKEN=
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
ENVEXAMPLE

echo "  ✅ Environment templates created"

# ── Summary ────────────────────────────────────

echo ""
echo "═══════════════════════════════════════════"
echo "  🎉 BuildMyRide scaffold complete!"
echo "═══════════════════════════════════════════"
echo ""
echo "  📂 Project structure ready"
echo "  🤖 Claude Code agents: .claude/agents/"
echo "     → backend-dev, frontend-dev, three-d, qa-reviewer"
echo "  🛠  Claude Code skills: .claude/skills/"
echo "     → new-feature, new-endpoint, new-component"
echo "  🔌 MCP servers: .claude/.mcp.json"
echo "     → MongoDB (read+write), Google Stitch"
echo "  ⚙️  Permissions: .claude/settings.json"
echo ""
echo "  NEXT STEPS:"
echo "  1. Copy CLAUDE.md to project root"
echo "  2. Fill in .claude/.mcp.json:"
echo "     → MDB_MCP_CONNECTION_STRING (your Atlas URI)"
echo "     → GOOGLE_CLOUD_PROJECT (your GCP project ID)"
echo "  3. Copy server/.env.example → server/.env and fill values"
echo "  4. Copy client/.env.example → client/.env.local and fill values"
echo "  5. Run: cd client && npm init -y && npm install"
echo "  6. Run: cd server && npm init -y && npm install"
echo "  7. Run: npx @_davideast/stitch-mcp init (for Stitch auth)"
echo "  8. Open Claude Code: claude"
echo "  9. Verify MCP: check MongoDB and Stitch tools are available"
echo ""
echo "═══════════════════════════════════════════"
