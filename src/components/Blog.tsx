import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { BlogPost } from '../types/blog'

interface BlogCardProps {
  id: string
  title: string
  snippet: string
  coverImageUrl?: string | null
  rotationClass: string
  style?: React.CSSProperties
}

function BlogCard({ id, title, snippet, coverImageUrl, rotationClass, style }: BlogCardProps) {
  return (
    <div
      id={id}
      className={`w-[371px] bg-[#ffdb74] shadow-[6px_6px_0px_2px_rgba(0,0,0,0.25)] flex flex-col-reverse items-start justify-start gap-[24px] pt-[42px] px-[32px] pb-[36px] cursor-pointer transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[10px_12px_0px_2px_rgba(0,0,0,0.28)] hover:scale-[1.015] active:translate-y-0 active:scale-[0.98] active:shadow-[4px_4px_0px_2px_rgba(0,0,0,0.25)] group select-none ${rotationClass}`}
      style={style}
    >
      {/* Content */}
      <div
        id="Content"
        className="w-full flex flex-col-reverse items-start justify-start gap-[20px]"
      >
        {/* Read more > */}
        <a
          id="Read-more"
          href="#"
          onClick={(e) => e.preventDefault()}
          className="w-full font-['Solitreo'] text-[20px] font-normal leading-[1.2] text-[#3f2007] text-right no-underline select-none transition-all duration-200 group-hover:text-[#8a3500] flex items-center justify-end gap-1"
        >
          <span>Read more</span>
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">&gt;</span>
        </a>

        {/* Body Snippet (truncated) */}
        <p
          id="Body-Snippet"
          className="w-full m-0 font-['Solway'] text-[16px] font-normal leading-[1.3] text-black text-center select-none transition-opacity duration-200 group-hover:opacity-90 line-clamp-4 min-h-[76px]"
          title={snippet}
        >
          {snippet}
        </p>

        {/* Cover Image */}
        {coverImageUrl && (
          <img
            src={coverImageUrl}
            alt={title}
            className="w-full"
          />
        )}
      </div>

      {/* Title */}
      <h3
        id="Title"
        className="w-full m-0 font-['Solway'] text-[32px] font-bold leading-[1.2] text-[#3f2007] text-center select-none transition-colors duration-300 group-hover:text-[#8a3500] line-clamp-2 min-h-[76px] flex items-center justify-center"
      >
        {title}
      </h3>
    </div>
  )
}

function BlogCardSkeleton({ rotationClass }: { rotationClass: string }) {
  return (
    <div
      className={`w-[371px] bg-[#ffdb74]/80 shadow-[6px_6px_0px_2px_rgba(0,0,0,0.25)] flex flex-col-reverse items-start justify-start gap-[24px] pt-[42px] px-[32px] pb-[36px] animate-pulse ${rotationClass}`}
    >
      <div className="w-full flex flex-col-reverse items-start justify-start gap-[20px]">
        <div className="h-5 w-24 bg-[#e6c158] self-end rounded" />
        <div className="w-full space-y-2">
          <div className="h-4 bg-[#e6c158] rounded w-full" />
          <div className="h-4 bg-[#e6c158] rounded w-5/6 mx-auto" />
          <div className="h-4 bg-[#e6c158] rounded w-4/6 mx-auto" />
        </div>
      </div>
      <div className="h-8 bg-[#e6c158] rounded w-3/4 mx-auto" />
    </div>
  )
}

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: true })

        if (error) {
          throw error
        }

        if (data) {
          setPosts(data as BlogPost[])
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch posts')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <section
      id="Blog"
      className="relative w-full flex-1 bg-[#fd7e1c] rounded-t-[42px] shadow-[inset_2px_6px_0px_4px_rgba(0,0,0,0.25)] flex flex-col items-center justify-start gap-[28px] self-stretch pt-0 pb-[48px] overflow-hidden"
    >
      {/* Background Pattern of Circles (Brick Layout) */}
      <svg
        id="Blog-Background-Pattern"
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="brick-circle-pattern"
            x="0"
            y="0"
            width="46.29"
            height="69.44"
            patternUnits="userSpaceOnUse"
          >
            {/* Corners / Grid points for odd rows */}
            <circle cx="0" cy="0" r="9.37" fill="none" stroke="#000000" strokeWidth="6" strokeOpacity="0.1" />
            <circle cx="46.29" cy="0" r="9.37" fill="none" stroke="#000000" strokeWidth="6" strokeOpacity="0.1" />
            <circle cx="0" cy="69.44" r="9.37" fill="none" stroke="#000000" strokeWidth="6" strokeOpacity="0.1" />
            <circle cx="46.29" cy="69.44" r="9.37" fill="none" stroke="#000000" strokeWidth="6" strokeOpacity="0.1" />
            {/* Shifted halfway for even rows (brick pattern) */}
            <circle cx="23.145" cy="34.72" r="9.37" fill="none" stroke="#000000" strokeWidth="6" strokeOpacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#brick-circle-pattern)" />
      </svg>

      {/* Blog Header */}
      <div
        id="Blog-Header"
        className="relative z-10 flex flex-col-reverse items-center justify-start self-stretch mt-0 animate-sign-sway group cursor-pointer"
      >
        {/* Blog Header Board */}
        <div
          id="Blog-Header-Board"
          className="relative w-[239px] h-[75px] bg-white border-[4px] border-[#3f2007] shadow-[6px_6px_0px_2px_rgba(0,0,0,0.25)] flex items-center justify-center shrink-0 -mt-[6px] transition-all duration-300 group-hover:scale-105 group-active:scale-95 group-hover:shadow-[8px_8px_0px_2px_rgba(0,0,0,0.3)] px-[16px]"
        >
          {/* Blog Text */}
          <h2
            id="Blog-Title"
            className="m-0 font-['Solway'] text-[48px] font-bold leading-[1.2] text-[#3f2007] text-center select-none transition-colors duration-300 group-hover:text-[#8a3500]"
          >
            Blog
          </h2>
        </div>

        {/* Blog Header String */}
        <div
          id="Blog-Header-String"
          className="w-[2px] h-[49px] bg-white shrink-0"
        />
      </div>

      {/* Blog Cards */}
      <div
        id="Blog-Cards"
        className="relative z-10 w-full flex flex-row items-start justify-center gap-[24px] px-[20px] flex-wrap"
      >
        {loading ? (
          <>
            <BlogCardSkeleton rotationClass="-rotate-[2deg]" />
            <BlogCardSkeleton rotationClass="rotate-[2deg]" />
            <BlogCardSkeleton rotationClass="-rotate-[2deg]" />
          </>
        ) : error ? (
          <div className="bg-[#ffdb74] p-6 rounded-lg shadow-md text-center max-w-md">
            <p className="font-['Solway'] text-[#3f2007] font-semibold mb-2">Gagal memuat artikel blog</p>
            <p className="text-sm text-gray-700">{error}</p>
          </div>
        ) : (
          posts.map((post, index) => {
            const rotationClass =
              index % 2 === 0
                ? '-rotate-[2deg] hover:rotate-0 active:rotate-0'
                : 'rotate-[2deg] hover:rotate-0 active:rotate-0'

            return (
              <BlogCard
                key={post.id}
                id={`Blog-Card-${index + 1}`}
                title={post.title}
                snippet={post.snippet}
                coverImageUrl={post.cover_image_url}
                rotationClass={rotationClass}
              />
            )
          })
        )}
      </div>
    </section>
  )
}
