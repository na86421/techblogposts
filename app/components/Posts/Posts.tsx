'use client'

import { getPosts } from '@/app/api/v1/posts/posts'
import { Observer } from '@/components/atom/Observer/Observer'
import { queryKeys } from '@/providers/ReactQueryClientProvider/ReactQueryClientProvider'
// import { useQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import * as Post from '@/components/atom/Post/Post'
import * as Separator from '@/components/atom/Separator/Separator'
import { Fragment } from 'react'
// import { getBookmarks } from '@/app/api/v1/bookmarks/bookmarks'
// import { getAuth } from '@/app/api/v1/auth/auth'
import PostsLoading from '@/app/components/Posts/PostsLoading'

export default function Posts() {
  // 인증 관련 코드 주석 처리
  // const { data } = useQuery({
  //   queryKey: queryKeys.getAuth,
  //   queryFn: getAuth,
  // })

  // 북마크 관련 코드 주석 처리
  // const { data: bookmarksData } = useQuery({
  //   queryKey: queryKeys.getBookmarks({ uid: data?.user?.uid! }),
  //   queryFn: () => getBookmarks({ uid: data?.user?.uid! }),
  //   enabled: !!data?.user?.uid,
  // })

  const {
    data: postsData,
    hasNextPage,
    fetchNextPage,
    error,
  } = useSuspenseInfiniteQuery({
    queryKey: queryKeys.getPosts({}),
    queryFn: ({ pageParam }) => getPosts({ cursor: pageParam }),
    initialPageParam: '',
    getNextPageParam: ({ cursor }) => cursor,
  })

  if (error) {
    throw error
  }

  return (
    <>
      {!!postsData?.pages.length && (
        <Post.List>
          {postsData?.pages.map(({ posts }, pageIndex) =>
            posts.map(({ _source }, postIndex) => {
              const { company, id, publishDate, title, viewCount } = _source
              const isLastItem =
                pageIndex + 1 === postsData?.pages.length &&
                postIndex + 1 === posts.length

              // 북마크 관련 로직 주석 처리
              // const isBookmarked = bookmarksData?.bookmarks.some(
              //   ({ _source }) => {
              //     const { parent } = _source

              //     return parent === id
              //   },
              // )

              return (
                <Fragment key={id}>
                  <Post.Item>
                    <Post.Title id={id} title={title}>
                      {title}
                    </Post.Title>
                    <Post.Content>
                      <Post.LeftContent>
                        <Post.CompanyIcon company={company} />
                        <Post.Company>{company}</Post.Company>
                      </Post.LeftContent>
                      <Post.RightContent>
                        <Post.Time time={publishDate} />
                        <Post.ViewCount>{viewCount}</Post.ViewCount>
                        {/* 북마크 버튼 주석 처리 */}
                        {/* {data?.user?.uid && (
                          <Post.Bookmark
                            isBookmarked={isBookmarked}
                            uid={data.user.uid}
                            parent={id}
                          />
                        )} */}
                      </Post.RightContent>
                    </Post.Content>
                  </Post.Item>
                  {!isLastItem && <Separator.Separator />}
                </Fragment>
              )
            }),
          )}
          <Observer callback={fetchNextPage} condition={hasNextPage}>
            <PostsLoading length={1} />
          </Observer>
        </Post.List>
      )}
    </>
  )
}
