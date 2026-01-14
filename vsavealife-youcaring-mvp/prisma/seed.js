import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function main() {
  const email = process.env.DEMO_CREATOR_EMAIL || 'creator@example.com'

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Demo Creator',
      feePolicyVersion: 'v1_max(1,5%)'
    },
  })

  const demos = [
    { title: 'Help With Emergency Medical Bills', category: 'Medical', currency: 'usd', goalMinor: 500000, featured: true },
    { title: 'Support a Family After Disaster', category: 'Disaster Relief', currency: 'usd', goalMinor: 800000, featured: true },
    { title: 'Funeral Support Fund', category: 'Funeral', currency: 'gbp', goalMinor: 300000, featured: true },
    { title: 'Community School Supplies Drive', category: 'Community', currency: 'eur', goalMinor: 200000, featured: true },
  ]

  for (const c of demos) {
    const slug = slugify(c.title)
    await prisma.campaign.upsert({
      where: { slug },
      update: {
        featured: c.featured,
        category: c.category,
        currency: c.currency,
        goalMinor: c.goalMinor,
        status: 'PUBLISHED',
        organizerId: user.id,
        coverPublicUrl: '/logo.png',
      },
      create: {
        slug,
        title: c.title,
        category: c.category,
        currency: c.currency,
        goalMinor: c.goalMinor,
        raisedMinor: Math.floor(c.goalMinor * 0.35),
        featured: c.featured,
        status: 'PUBLISHED',
        organizerId: user.id,
        coverPublicUrl: '/logo.png',
      },
    })
  }

  console.log('Seed complete. Demo creator:', email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
