'use client'

import * as Dialog from '@/components/atom/Dialog/Dialog'
import * as styles from '@/app/[locale]/page.css'
import Posts from '@/app/components/Posts/Posts'
import PostsLoading from '@/app/components/Posts/PostsLoading'
import { Suspense, useState } from 'react'

export default function LocalePage() {
  const [open, setOpen] = useState(true)

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content style={{ maxWidth: '48rem', minHeight: '30rem' }}>
          <Dialog.Header>
            <Dialog.Title
              style={{
                textAlign: 'center',
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              기술 블로그 모음 재개 안내 🎉
            </Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <div
              style={{
                textAlign: 'left',
                lineHeight: 1.8,
                fontSize: '1.05rem',
                maxHeight: 420,
                overflowY: 'auto',
                padding: '4px 2px 4px 2px',
              }}
            >
              <p>
                <b>안녕하세요, 윤준기입니다.</b>
              </p>
              <br />
              <p>
                지난 4년간 이 사이트를 통해 다양한 개발 지식과 인사이트를 얻으며
                성장해 온 한 명의 개발자입니다. 덕분에 저 역시 누군가에게 도움이
                되는 글을 써보고 싶다는 마음을 갖게 되었고, 최근에는 뜻깊게도
                이곳에 직접 글을 등록해볼 수 있는 기회도 얻었습니다.
              </p>
              <br />
              <p>
                개발자의 시작부터 함께해 온 이 소중한 공간을 앞으로도 더 많은
                분들과 나누고 싶다는 마음으로 태훈님께 운영을 맡고 싶다는 의사를
                전달드렸고 최근 관련 작업을 마무리하게 되었습니다. <br />
                다시 서비스를 이어갈 수 있게 되어 무척 기쁩니다 😀
              </p>
              <br />
              <p>
                <b>
                  ※ 개인 정보 보호로 인하여 기존의 회원 시스템은 더 이상 이용할
                  수 없으며, 빠른 시일 내에 새로운 회원 시스템을 재개할
                  예정입니다.
                  <br />
                  복구 이후에는 기존 사용자분들도 새롭게 회원가입을 해주셔야
                  하는 점 양해 부탁드립니다.
                </b>
              </p>
              <br />
              <p>
                앞으로는 보다 편리한 기능들을 추가하면서, 개발자 여러분께 다양한
                인사이트를 얻을 수 있는 공간으로 계속 발전시켜 나가겠습니다.
              </p>
              <br />
              <p>
                <b>감사합니다.</b>
              </p>
            </div>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close asChild>
              <button
                style={{
                  padding: '0.6rem 2rem',
                  background: '#222',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  marginTop: 16,
                  width: '100%',
                  letterSpacing: '0.02em',
                }}
              >
                닫기
              </button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
      <main>
        <section className={styles.section}>
          <Suspense fallback={<PostsLoading />}>
            <Posts />
          </Suspense>
        </section>
      </main>
    </>
  )
}
