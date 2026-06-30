import { Post } from '@/app/api/v1/posts/postsTypes'

export interface GetBookmarksRequest {
  uid: string
}

export interface Bookmark {
  parent: string
  publishDate: number
}

export interface GetBookmarksResponse {
  bookmarks: Bookmark[]
}

export interface GetBookmarksPostsRequest {
  uid: string
}

export interface GetBookmarksPostsResponse {
  posts: Post[]
}
