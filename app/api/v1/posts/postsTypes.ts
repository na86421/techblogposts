export interface GetPostsRequest {
  cursor?: string
}

export interface Post {
  id: string
  title: string
  company: string
  publishDate: number
  viewCount: number
  isShow: boolean
}

export interface GetPostsResponse {
  posts: Post[]
  cursor?: string
}

export interface PostPostsViewCountRequest {
  id: string
}

export type PostPostsViewCountResponse = null

export interface GetPostsSearchRequest {
  query: string
}

export interface GetPostsSearchResponse {
  posts: Post[]
}

export interface PutPostsBookmarkRequest {
  uid: string
  parent: string
}

export type PutPostsBookmarkResponse = null

export interface DeletePostsBookmarkRequest {
  uid: string
  parent: string
}

export type DeletePostsBookmarkResponse = null
