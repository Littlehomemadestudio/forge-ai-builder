// Quick DB inspection script
import { db } from '../src/lib/db'

async function main() {
  const users = await db.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      provider: true,
      createdAt: true,
      _count: { select: { projects: true } },
    },
  })
  console.log('=== Users ===')
  console.table(users)

  const projects = await db.project.findMany({
    select: {
      id: true,
      name: true,
      userId: true,
      status: true,
      createdAt: true,
    },
  })
  console.log('=== Projects ===')
  console.table(projects)

  const pages = await db.page.findMany({
    select: {
      id: true,
      name: true,
      projectId: true,
      html: true,
    },
  })
  console.log('=== Pages ===')
  for (const p of pages) {
    console.log(`${p.id} | ${p.name} | project=${p.projectId} | html_len=${(p.html || '').length}`)
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => process.exit(0))
