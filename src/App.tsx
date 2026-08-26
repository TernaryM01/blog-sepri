import { useState, useEffect } from 'react'
import { Hero } from './components/Hero'
import { Blog } from './components/Blog'
import { BlogPostPage } from './components/BlogPostPage'

function getSlugFromLocation(): string | null {
  if (typeof window === 'undefined') return null

  // Check hash e.g. #/blog/kupu-kupu
  if (window.location.hash.startsWith('#/blog/')) {
    return window.location.hash.replace('#/blog/', '').trim() || null
  }

  // Check pathname e.g. /blog/kupu-kupu
  if (window.location.pathname.startsWith('/blog/')) {
    return window.location.pathname.replace('/blog/', '').trim() || null
  }

  // Check search query e.g. ?post=kupu-kupu
  const searchParams = new URLSearchParams(window.location.search)
  const postParam = searchParams.get('post')
  if (postParam) return postParam

  return null
}

function App() {
  const [currentSlug, setCurrentSlug] = useState<string | null>(() => getSlugFromLocation())

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentSlug(getSlugFromLocation())
    }

    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
    }
  }, [])

  const handleSelectPost = (slug: string) => {
    window.history.pushState({}, '', `#/blog/${slug}`)
    setCurrentSlug(slug)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavigateHome = () => {
    window.history.pushState({}, '', '#/')
    setCurrentSlug(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div
      id="Desktop"
      className="min-h-screen w-full bg-[#8f8f8f] flex flex-row justify-center items-stretch overflow-x-hidden"
    >
      <div
        id="Body"
        className="w-full max-w-[1280px] min-h-screen bg-[#cbefe6] outline-[4px] outline-black/25 flex flex-col items-center justify-start relative flex-1 self-stretch overflow-x-clip"
      >
        {currentSlug ? (
          <BlogPostPage
            slug={currentSlug}
            onNavigateHome={handleNavigateHome}
            onSelectPost={handleSelectPost}
          />
        ) : (
          <>
            <Hero />
            <Blog onSelectPost={handleSelectPost} />
          </>
        )}
      </div>
    </div>
  )
}

export default App
