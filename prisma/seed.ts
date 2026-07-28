import { db } from '../src/lib/db'

async function seed() {
  // Clean existing data (optional — ensures fresh start)
  await db.deployment.deleteMany()
  await db.page.deleteMany()
  await db.version.deleteMany()
  await db.component.deleteMany()
  await db.project.deleteMany()
  await db.asset.deleteMany()
  await db.user.deleteMany()

  // Create demo user
  const user = await db.user.create({
    data: {
      id: 'demo-user',
      email: 'demo@forge.ai',
      name: 'Demo User',
      plan: 'pro',
      aiCredits: 50,
    },
  })

  // Create sample projects
  const project1 = await db.project.create({
    data: {
      name: 'NovaPulse SaaS',
      description: 'AI analytics platform landing page',
      prompt: 'A SaaS landing page for NovaPulse AI analytics',
      status: 'published',
      theme: 'dark',
      industry: 'saas',
      userId: user.id,
    },
  })

  const project2 = await db.project.create({
    data: {
      name: 'Ember & Roast Café',
      description: 'Specialty coffee shop website',
      prompt: 'A cozy coffee shop website with menu cards',
      status: 'draft',
      theme: 'light',
      industry: 'restaurant',
      userId: user.id,
    },
  })

  const project3 = await db.project.create({
    data: {
      name: 'Portfolio — Mira Solano',
      description: 'Photography portfolio for Brooklyn-based photographer',
      prompt: 'A photography portfolio for Mira Solano',
      status: 'published',
      theme: 'light',
      industry: 'portfolio',
      userId: user.id,
    },
  })

  const project4 = await db.project.create({
    data: {
      name: 'Luxe Market Store',
      description: 'Handmade home goods marketplace',
      prompt: 'An e-commerce store for handmade home goods',
      status: 'archived',
      theme: 'dark',
      industry: 'ecommerce',
      userId: user.id,
    },
  })

  // Create pages for each project
  await db.page.createMany({
    data: [
      {
        name: 'Home',
        route: '/',
        html: '<h1>NovaPulse — AI Analytics</h1>',
        css: 'h1 { color: #7c3aed; }',
        projectId: project1.id,
      },
      {
        name: 'Home',
        route: '/',
        html: '<h1>Ember & Roast Café</h1>',
        css: 'h1 { color: #92400e; }',
        projectId: project2.id,
      },
      {
        name: 'Portfolio',
        route: '/',
        html: '<h1>Mira Solano Photography</h1>',
        css: 'h1 { color: #1d4ed8; }',
        projectId: project3.id,
      },
      {
        name: 'Home',
        route: '/',
        html: '<h1>Luxe Market</h1>',
        css: 'h1 { color: #059669; }',
        projectId: project4.id,
      },
    ],
  })

  // Create deployments for published projects
  await db.deployment.createMany({
    data: [
      {
        url: 'https://novapulse.vercel.app',
        platform: 'vercel',
        status: 'deployed',
        projectId: project1.id,
      },
      {
        url: 'https://mira-solano.vercel.app',
        platform: 'vercel',
        status: 'deployed',
        projectId: project3.id,
      },
    ],
  })

  console.log('✅ Seed data created successfully!')
  console.log(`   User: ${user.email} (${user.plan} plan, ${user.aiCredits} credits)`)
  console.log(`   Projects: ${[project1, project2, project3, project4].map(p => p.name).join(', ')}`)

  await db.$disconnect()
}

seed().catch((e) => {
  console.error('Seed failed:', e)
  db.$disconnect()
  process.exit(1)
})
