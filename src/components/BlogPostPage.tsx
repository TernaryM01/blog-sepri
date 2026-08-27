import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { BlogPost, BlogContentBlock } from '../types/blog'
import logoIcon from '../assets/logo-icon.svg'

interface BlogPostPageProps {
  slug: string
  onNavigateHome: () => void
  onSelectPost: (slug: string) => void
}

export function BlogPostPage({ slug, onNavigateHome, onSelectPost }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [otherPosts, setOtherPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })

    async function loadPostData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch current post
        const { data: postData, error: postErr } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .single()

        if (postErr) {
          throw postErr
        }

        setPost(postData as BlogPost)

        // Fetch other posts for "More from Sepriani's Lab" section
        const { data: allPosts } = await supabase
          .from('posts')
          .select('*')
          .neq('slug', slug)
          .limit(2)

        if (allPosts) {
          setOtherPosts(allPosts as BlogPost[])
        }
      } catch (err) {
        console.error('Error fetching blog post:', err)
        setError(err instanceof Error ? err.message : 'Failed to load article')
      } finally {
        setLoading(false)
      }
    }

    loadPostData()
  }, [slug])

  const renderContentBlock = (block: BlogContentBlock, index: number) => {
    const alignClass =
      block.align === 'center'
        ? 'text-center'
        : block.align === 'right'
        ? 'text-right'
        : 'text-left'

    if (block.type === 'heading') {
      const level = block.level || 2
      if (level === 1) {
        return (
          <h1
            key={index}
            className={`font-['Solway'] text-[32px] md:text-[38px] font-bold text-[#3f2007] mt-8 mb-4 leading-tight ${alignClass}`}
          >
            {block.text}
          </h1>
        )
      }
      if (level === 2) {
        return (
          <h2
            key={index}
            className={`font-['Solway'] text-[26px] md:text-[30px] font-bold text-[#3f2007] mt-8 mb-3 pb-2 border-b-2 border-[#3f2007]/15 leading-snug ${alignClass}`}
          >
            {block.text}
          </h2>
        )
      }
      return (
        <h3
          key={index}
          className={`font-['Solway'] text-[20px] md:text-[24px] font-bold text-[#5c300c] mt-6 mb-2 leading-snug ${alignClass}`}
        >
          {block.text}
        </h3>
      )
    }

    if (block.type === 'paragraph') {
      return (
        <p
          key={index}
          className={`font-['Solway'] text-[17px] md:text-[19px] leading-[1.8] text-[#2c1d11] my-4 ${alignClass}`}
        >
          {block.spans && block.spans.length > 0
            ? block.spans.map((span, spanIdx) => {
                let spanClasses = ''
                if (span.bold) spanClasses += ' font-bold text-[#1a0f06]'
                if (span.italic) spanClasses += ' italic'

                return (
                  <span key={spanIdx} className={spanClasses}>
                    {span.text}
                  </span>
                )
              })
            : block.text}
        </p>
      )
    }

    return null
  }

  return (
    <div
      id="Blog-Post-Page"
      className="w-full flex flex-col items-center justify-start pb-[64px] min-h-screen"
    >
      {/* Top Navigation Bar */}
      <header className="w-full max-w-[960px] px-6 py-6 flex flex-row items-center justify-between z-20">
        {/* Back Button */}
        <button
          onClick={onNavigateHome}
          className="group flex flex-row items-center gap-2 bg-[#ffdb74] border-[3px] border-[#3f2007] shadow-[4px_4px_0px_1px_rgba(0,0,0,0.25)] px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_1px_rgba(0,0,0,0.25)] active:translate-y-0 active:shadow-[2px_2px_0px_1px_rgba(0,0,0,0.25)] select-none"
        >
          <span className="font-['Solway'] font-bold text-[20px] text-[#3f2007] transition-transform duration-200 group-hover:-translate-x-1">
            ←
          </span>
          <span className="font-['Solway'] font-bold text-[16px] text-[#3f2007]">
            Back to Home
          </span>
        </button>

        {/* Brand Link */}
        <button
          onClick={onNavigateHome}
          className="flex flex-row items-center gap-3 cursor-pointer group bg-transparent border-none p-0"
        >
          <img
            src={logoIcon}
            alt="Sepriani's Lab"
            className="w-10 h-10 transition-transform duration-300 group-hover:rotate-6"
          />
          <span className="font-['Solway'] text-[24px] font-bold text-[#3f2007] transition-colors duration-200 group-hover:text-[#185347]">
            Sepriani’s Lab
          </span>
        </button>
      </header>

      {/* Main Reading Sheet / Notebook */}
      <main className="w-full max-w-[880px] px-4 md:px-6 relative z-10">
        {loading ? (
          <div className="w-full bg-[#fffcf5] border-[4px] border-[#3f2007] shadow-[8px_8px_0px_2px_rgba(0,0,0,0.25)] rounded-[28px] p-8 md:p-14 animate-pulse">
            <div className="h-6 w-32 bg-[#e4d7be] rounded mb-6 mx-auto" />
            <div className="h-12 w-3/4 bg-[#e4d7be] rounded mb-8 mx-auto" />
            <div className="h-64 w-full bg-[#e4d7be] rounded-2xl mb-8" />
            <div className="space-y-4">
              <div className="h-5 bg-[#e4d7be] rounded w-full" />
              <div className="h-5 bg-[#e4d7be] rounded w-11/12" />
              <div className="h-5 bg-[#e4d7be] rounded w-4/5" />
            </div>
          </div>
        ) : error || !post ? (
          <div className="w-full bg-[#fffcf5] border-[4px] border-[#3f2007] shadow-[8px_8px_0px_2px_rgba(0,0,0,0.25)] rounded-[28px] p-12 text-center">
            <p className="font-['Solway'] text-[24px] font-bold text-[#3f2007] mb-4">
              Article Not Found
            </p>
            <p className="font-['Solway'] text-[16px] text-gray-700 mb-6">
              {error || "The article you are looking for doesn't exist."}
            </p>
            <button
              onClick={onNavigateHome}
              className="bg-[#fd7e1c] text-white border-[3px] border-[#3f2007] shadow-[4px_4px_0px_1px_rgba(0,0,0,0.25)] px-6 py-2.5 rounded-xl font-['Solway'] font-bold text-[16px] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              Return to Home
            </button>
          </div>
        ) : (
          <article className="relative w-full bg-[#fffcf5] border-[4px] border-[#3f2007] shadow-[10px_10px_0px_2px_rgba(0,0,0,0.25)] rounded-[28px] p-6 md:p-14 overflow-hidden">

            {/* Article Metadata Tag */}
            <div className="flex flex-row items-center justify-center gap-2 mb-4 mt-2">
              {post.created_at && (
                <span className="font-['Solway'] text-[13px] text-[#6b4728]">
                  Initially posted on {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              )}
            </div>

            {/* Article Title */}
            <h1 className="font-['Solway'] text-[34px] md:text-[46px] font-bold leading-[1.2] text-[#3f2007] text-center mb-8">
              {post.title}
            </h1>

            {/* Cover Image (if present) */}
            {post.cover_image_url && (
              <div className="relative w-full mb-10 group">
                <div className="w-full bg-[#ffecc2] border-[3px] border-[#3f2007] rounded-2xl shadow-[6px_6px_0px_1px_rgba(63,32,7,0.2)] overflow-hidden p-2 md:p-3">
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full max-h-[500px] object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.01]"
                  />
                </div>
              </div>
            )}

            {/* Article Body Content */}
            <div className="prose max-w-none text-[#2c1d11]">
              {Array.isArray(post.content) && post.content.length > 0 ? (
                post.content.map((block, idx) => renderContentBlock(block, idx))
              ) : (
                <p className="font-['Solway'] text-[18px] leading-[1.8] text-center my-6">
                  {post.snippet}
                </p>
              )}
            </div>

            <div className="mt-14 pt-8 border-t-2 border-dashed border-[#3f2007]/20 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-row items-center gap-4">
              </div>

              <button
                onClick={onNavigateHome}
                className="font-['Solitreo'] text-[22px] text-[#3f2007] hover:text-[#8a3500] flex items-center gap-1 bg-transparent border-none cursor-pointer group"
              >
                <span>Back to All Articles</span>
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                  &gt;
                </span>
              </button>
            </div>
          </article>
        )}

        {/* Read Other Articles Shelf */}
        {otherPosts.length > 0 && (
          <section className="mt-12 w-full">
            <h3 className="font-['Solway'] text-[24px] font-bold text-[#3f2007] mb-6 text-center">
              Explore More Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherPosts.map((other) => (
                <div
                  key={other.id}
                  onClick={() => onSelectPost(other.slug)}
                  className="bg-[#ffdb74] border-[3px] border-[#3f2007] shadow-[5px_5px_0px_1px_rgba(0,0,0,0.25)] rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[8px_8px_0px_1px_rgba(0,0,0,0.25)] group"
                >
                  <h4 className="font-['Solway'] text-[20px] font-bold text-[#3f2007] mb-2 line-clamp-1 group-hover:text-[#8a3500] transition-colors">
                    {other.title}
                  </h4>
                  <p className="font-['Solway'] text-[14px] text-black leading-relaxed line-clamp-2 mb-4">
                    {other.snippet}
                  </p>
                  <div className="font-['Solitreo'] text-[18px] text-[#3f2007] text-right group-hover:text-[#8a3500] flex items-center justify-end gap-1">
                    <span>Read article</span>
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                      &gt;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
