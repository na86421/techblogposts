export interface Blog {
  id: string
  title: string
  rssURL: string
  cron: boolean
  lastUpdated: number
  lastUpdatedDate: string
}

export interface GetBlogsResponse {
  blogs: Blog[]
}
