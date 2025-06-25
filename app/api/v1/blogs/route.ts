import { client } from '@/libs/elasticSearch/elasticSearch'
import { SearchResponse } from '@elastic/elasticsearch/api/types.js'
import { NextResponse } from 'next/server'
// import fs from 'fs'
// import path from 'path'

interface BlogsQuery {
  cron: boolean
  dataType: string
}

export const dynamic = 'force-dynamic'

export async function GET() {
  // // mock.json 파일 읽기
  // const mockDataPath = path.join(process.cwd(), 'mock.json')
  // const mockDataContent = fs.readFileSync(mockDataPath, 'utf-8')

  // // JSONL 형식을 파싱하여 배열로 변환
  // const items = mockDataContent
  //   .trim()
  //   .split('\n')
  //   .map((line) => JSON.parse(line))
  //   .filter((item) => item.Item.dataType.S === 'blog' && item.Item.cron.BOOL === true)
  //   .map((item) => ({
  //     _source: {
  //       id: item.Item.id.S,
  //       title: item.Item.title.S,
  //       rssURL: item.Item.rssURL.S,
  //       lastUpdated: parseInt(item.Item.lastUpdated.N),
  //       lastUpdatedDate: item.Item.lastUpdatedDate.S,
  //       dataType: item.Item.dataType.S,
  //       cron: item.Item.cron.BOOL
  //     }
  //   }))
  //   .sort((a, b) => b._source.lastUpdated - a._source.lastUpdated) // 최신순 정렬

  // return NextResponse.json({ blogs: items })

  // 기존 Elasticsearch 코드 (주석 처리)
  const searchQuery = {
    size: 200,
    body: {
      query: {
        bool: {
          filter: [
            {
              term: {
                dataType: 'blog',
              },
            },
            {
              term: {
                cron: true,
              },
            },
          ],
        },
      },
      sort: [
        {
          lastUpdated: {
            order: 'desc',
          },
        },
      ],
    },
  }

  const response = await client.search<SearchResponse<BlogsQuery>>(searchQuery)

  if (response.statusCode === 200) {
    const blogs = response.body.hits.hits

    return NextResponse.json({ blogs })
  }
}
