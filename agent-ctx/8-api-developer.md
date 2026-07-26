# Forge Project Worklog

## Task 8: API Routes for Forge AI Website Builder

**Agent**: API Developer
**Status**: Completed
**Date**: 2024-01-XX

### Summary
Created 5 production-ready API route files for the Forge platform using Next.js 16 App Router route handlers. All routes use proper TypeScript types, handle errors gracefully, and return appropriate status codes.

### Files Created

1. **`/src/app/api/auth/route.ts`** - Auth endpoint
   - POST handler for login/register
   - Accepts `{email, password, name?, action: 'login'|'register'}`
   - Login: finds user by email in database via Prisma
   - Register: creates new user, checks for duplicates (409 conflict)
   - Uses `import { db } from '@/lib/db'`

2. **`/src/app/api/projects/route.ts`** - Projects CRUD
   - GET: Lists all projects for a user (userId query param), includes pages and latest version
   - POST: Creates new project with optional HTML/CSS content, creates default page
   - DELETE: Deletes project by id (cascade deletes related records)
   - Full error handling with proper status codes (400, 404, 409, 500)

3. **`/src/app/api/generate/route.ts`** - AI website generation (CRITICAL endpoint)
   - POST handler accepting `{prompt, framework?, userId?}`
   - Uses `z-ai-web-dev-sdk` (backend only, as required)
   - System prompt instructs AI to generate complete self-contained HTML websites
   - ZAI SDK usage: `const zai = await ZAI.create()` then `zai.chat.completions.create()`
   - Thinking disabled: `{ type: 'disabled' }`
   - Smart HTML extraction: handles code blocks, DOCTYPE, html tags
   - CSS/JS extraction from HTML via regex parsing
   - Returns structured: `{html, css, js, pages: [{name, route, html, css, js}], rawResponse}`
   - Optional project creation if userId is provided (creates project + page + version snapshot)

4. **`/src/app/api/export/route.ts`** - Export project
   - POST handler accepting `{projectId, format: 'html'|'react'|'nextjs'|'vue'|'static'}`
   - Gets project from database with pages
   - Format-specific generators:
     - HTML: returns raw HTML content
     - React: generates component + CSS files
     - Next.js: generates app/page.tsx, app/layout.tsx, globals.css
     - Vue: generates single-file Vue component
     - Static: returns self-contained index.html
   - Returns JSON with file list for multi-file formats

5. **`/src/app/api/templates/route.ts`** - Templates endpoint
   - GET: Returns 10 hardcoded template metadata entries
   - Categories: Landing Page, Portfolio, E-Commerce, Blog, Business, Agency, Event, Dashboard, Education
   - Includes premium/free classification
   - No database required - purely static data
   - Returns `{templates, categories, total, premiumCount, freeCount}`

### Technical Notes
- All imports use `import { db } from '@/lib/db'` for Prisma client
- z-ai-web-dev-sdk is ONLY used in backend code (generate route)
- All routes follow Next.js 16 App Router pattern (export async function GET/POST/DELETE)
- Error handling with try/catch and proper HTTP status codes
- TypeScript interfaces for request bodies
- Lint passes with no errors

### Database Schema Dependencies
The routes reference the following Prisma models:
- User (auth, project owner)
- Project (with pages, versions, components, deployments)
- Page (html, css, js per page)
- Version (snapshot storage)
- Template (defined in schema but not used in templates route - static data instead)
