import { prisma } from '@/libs/prisma/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { isShow: true },
    orderBy: [{ publishDate: 'desc' }, { id: 'asc' }],
    take: 10,
  })

  const title = 'TechBlogPosts'
  const siteUrl = 'https://techblogposts.com/'
  const lastModified = new Date(
    posts[0] ? Number(posts[0].publishDate) : Date.now(),
  ).toISOString()
  const xml = `<?xml version="1.0" encoding="utf-8"?>`

  const head = `
      <title>${title}</title>
      <link href="${siteUrl}" />
      <updated>${lastModified}</updated>
      <id>${siteUrl}</id>`

  const entries = posts
    .map(({ title, id, publishDate, company }) => {
      return `
        <entry>
          <title>${title.trim()}</title>
          <link href="${id.trim()}"/>
          <id>${id.trim()}</id>
          <author>
            <name>${company}</name>
          </author>
          <published>${new Date(Number(publishDate)).toISOString()}</published>
        </entry>`
    })
    .join('')
    .replace(/&/g, '&amp;')
    .replace(/-/g, '&#45;')

  const atom = `${xml}
      <feed xmlns="http://www.w3.org/2005/Atom">
        ${head}${entries}
      </feed>`

  return new Response(atom, {
    headers: {
      'Content-Type': 'application/atom+xml;charset=UTF-8',
      'Last-Modified': lastModified,
    },
  })
}
