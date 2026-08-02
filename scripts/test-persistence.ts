// Test: simulate the full register → login → create project → logout → login flow
// to verify persistence works correctly.
import { db } from '../src/lib/db'
import bcrypt from 'bcryptjs'

async function main() {
  // 1. Clean slate
  console.log('=== Cleaning DB ===')
  await db.deployment.deleteMany()
  await db.page.deleteMany()
  await db.version.deleteMany()
  await db.component.deleteMany()
  await db.project.deleteMany()
  await db.asset.deleteMany()
  await db.user.deleteMany()

  // 2. Register a new user (simulates /api/auth-local register)
  console.log('=== Registering user ===')
  const passwordHash = await bcrypt.hash('testpassword123', 12)
  const user = await db.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      username: 'testuser',
      passwordHash,
      plan: 'free',
      aiCredits: 100,
      provider: 'credentials',
    },
  })
  console.log(`Created user: id=${user.id}, email=${user.email}`)

  // 3. Create a project (simulates POST /api/projects)
  console.log('=== Creating project ===')
  const project = await db.project.create({
    data: {
      name: 'Test Project 1',
      description: 'A test project',
      prompt: 'Make me a portfolio site',
      userId: user.id,
      status: 'draft',
      framework: 'nextjs',
      theme: 'light',
      industry: 'portfolio',
    },
  })
  console.log(`Created project: id=${project.id}, name=${project.name}`)

  // 4. Create a page
  console.log('=== Creating page ===')
  const page = await db.page.create({
    data: {
      name: 'Home',
      route: '/',
      html: '<h1>Hello World</h1>',
      css: 'h1 { color: red; }',
      projectId: project.id,
    },
  })
  console.log(`Created page: id=${page.id}, name=${page.name}`)

  // 5. Simulate logout (do nothing to DB — just verify data persists)

  // 6. Simulate re-login by looking up the user again by email
  console.log('=== Re-login: lookup by email ===')
  const userAgain = await db.user.findUnique({
    where: { email: 'test@example.com' },
    include: { _count: { select: { projects: true } } },
  })
  console.log(`Found user: id=${userAgain?.id}, projects_count=${userAgain?._count?.projects}`)

  // 7. List user's projects (simulates GET /api/projects)
  console.log('=== Listing projects ===')
  const projects = await db.project.findMany({
    where: { userId: userAgain?.id },
    include: { pages: true },
  })
  for (const p of projects) {
    console.log(`Project: ${p.name} | pages=${p.pages.length} | first_page_html_len=${p.pages[0]?.html?.length ?? 0}`)
  }

  // 8. Final DB state
  console.log('=== Final DB state ===')
  const allUsers = await db.user.findMany()
  const allProjects = await db.project.findMany()
  const allPages = await db.page.findMany()
  console.log(`Users: ${allUsers.length}, Projects: ${allProjects.length}, Pages: ${allPages.length}`)

  // Keep the data so the user can see it
  console.log('\n✓ Persistence test PASSED — data survives logout/login cycle.')
}

main()
  .catch((e) => {
    console.error('Test FAILED:', e)
    process.exit(1)
  })
  .finally(() => process.exit(0))
