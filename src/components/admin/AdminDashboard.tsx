import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { BlogPost } from '../../types/blog'
import { PostEditor } from './PostEditor'
import logoIcon from '../../assets/logo-icon.svg'

interface AdminDashboardProps {
  userEmail: string
  onLogout: () => void
  onNavigateHome: () => void
}

export function AdminDashboard({ userEmail, onLogout, onNavigateHome }: AdminDashboardProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [activeView, setActiveView] = useState<'list' | 'create' | 'edit'>('list')
  const [postToEdit, setPostToEdit] = useState<BlogPost | null>(null)
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null)
  const [deleting, setDeleting] = useState(false)

  const refreshPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error: fetchErr } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchErr) throw fetchErr

      if (data) {
        setPosts(data as BlogPost[])
      }
    } catch (err: unknown) {
      console.error('Error fetching admin posts:', err)
      const msg = err instanceof Error ? err.message : 'Failed to load posts.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    async function loadInitialPosts() {
      try {
        const { data, error: fetchErr } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })

        if (!isMounted) return

        if (fetchErr) throw fetchErr

        if (data) {
          setPosts(data as BlogPost[])
        }
      } catch (err: unknown) {
        if (!isMounted) return
        console.error('Error loading initial admin posts:', err)
        const msg = err instanceof Error ? err.message : 'Failed to load posts.'
        setError(msg)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadInitialPosts()

    return () => {
      isMounted = false
    }
  }, [])

  const handleEditPost = (post: BlogPost) => {
    setPostToEdit(post)
    setActiveView('edit')
  }

  const handleCreatePost = () => {
    setPostToEdit(null)
    setActiveView('create')
  }

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return
    setDeleting(true)

    try {
      const { error: deleteErr } = await supabase
        .from('posts')
        .delete()
        .eq('id', postToDelete.id)

      if (deleteErr) throw deleteErr

      setPostToDelete(null)
      await refreshPosts()
    } catch (err: unknown) {
      console.error('Delete error:', err)
      const msg = err instanceof Error ? err.message : 'Unknown error'
      alert('Failed to delete post: ' + msg)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center pb-16">
      {/* Admin Header Bar */}
      <header className="w-full max-w-[1040px] px-6 py-5 flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#3f2007]/20">
        <div className="flex items-center gap-3">
          <img src={logoIcon} alt="Logo" className="w-10 h-10" />
          <div>
            <h1 className="font-['Solway'] text-[22px] font-bold text-[#3f2007] m-0">
              Sepriani’s Lab Admin
            </h1>
            <span className="font-['Solway'] text-[12px] text-[#6b4728] font-medium">
              Signed in as: <strong className="text-[#3f2007]">{userEmail}</strong> (Admin)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="font-['Solway'] text-[14px] font-bold text-[#3f2007] bg-[#ffdb74] border-2 border-[#3f2007] px-3.5 py-1.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            ← View Website
          </button>
          <button
            onClick={onLogout}
            className="font-['Solway'] text-[14px] font-bold text-white bg-[#d82b78] border-2 border-[#3f2007] px-3.5 py-1.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[1040px] px-4 md:px-6 mt-6 flex flex-col items-center">
        {activeView === 'create' || activeView === 'edit' ? (
          <PostEditor
            postToEdit={postToEdit}
            onSaveSuccess={() => {
              setActiveView('list')
              setPostToEdit(null)
              refreshPosts()
            }}
            onCancel={() => {
              setActiveView('list')
              setPostToEdit(null)
            }}
          />
        ) : (
          <div className="w-full bg-[#fffcf5] border-[4px] border-[#3f2007] shadow-[10px_10px_0px_2px_rgba(0,0,0,0.25)] rounded-[28px] p-6 md:p-8">
            {/* Top Toolbar */}
            <div className="flex flex-row items-center justify-between border-b-2 border-[#3f2007]/20 pb-4 mb-6">
              <div>
                <h2 className="font-['Solway'] text-[24px] font-bold text-[#3f2007] m-0">
                  Blog Articles
                </h2>
                <p className="font-['Solway'] text-[14px] text-[#6b4728] m-0 mt-1">
                  Manage all articles published in Sepriani’s Lab
                </p>
              </div>

              <button
                onClick={handleCreatePost}
                className="font-['Solway'] font-bold text-[16px] text-white bg-[#fd7e1c] border-[3px] border-[#3f2007] shadow-[4px_4px_0px_1px_rgba(0,0,0,0.25)] px-5 py-2 rounded-xl hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                + New Article
              </button>
            </div>

            {/* Error banner */}
            {error && (
              <div className="bg-[#ffdddd] border-2 border-[#d82b78] text-[#8a1f1f] p-3.5 rounded-xl font-['Solway'] text-[14px] mb-6">
                {error}
              </div>
            )}

            {/* Posts List */}
            {loading ? (
              <div className="space-y-4 py-8">
                <div className="h-16 bg-[#e6c158]/30 rounded-xl animate-pulse" />
                <div className="h-16 bg-[#e6c158]/30 rounded-xl animate-pulse" />
                <div className="h-16 bg-[#e6c158]/30 rounded-xl animate-pulse" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-['Solway'] text-[18px] text-[#6b4728] mb-4">
                  No articles yet. Click "+ New Article" to publish your first post!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-white border-2 border-[#3f2007] rounded-2xl shadow-[3px_3px_0px_1px_rgba(0,0,0,0.15)] hover:bg-[#fff9e6] transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {/* Cover Thumbnail */}
                      <div className="w-16 h-16 rounded-xl border border-[#3f2007]/30 bg-[#ffecc2] shrink-0 overflow-hidden flex items-center justify-center">
                        {post.cover_image_url ? (
                          <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">📝</span>
                        )}
                      </div>

                      {/* Title & Slug */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-['Solway'] text-[18px] font-bold text-[#3f2007] m-0 truncate">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-['Solway'] text-xs font-semibold text-[#8a3500] bg-[#ffdb74] px-2 py-0.5 rounded">
                            /{post.slug}
                          </span>
                          {post.created_at && (
                            <span className="font-['Solway'] text-xs text-gray-500">
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="font-['Solway'] text-[13px] font-bold text-[#3f2007] bg-[#ffdb74] border-2 border-[#3f2007] px-3 py-1.5 rounded-lg hover:bg-[#ffe394] cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setPostToDelete(post)}
                        className="font-['Solway'] text-[13px] font-bold text-red-700 bg-red-100 border-2 border-red-300 px-3 py-1.5 rounded-lg hover:bg-red-200 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#fffcf5] border-[4px] border-[#3f2007] shadow-[8px_8px_0px_2px_rgba(0,0,0,0.3)] rounded-[24px] p-6 max-w-md w-full">
            <h3 className="font-['Solway'] text-[20px] font-bold text-[#3f2007] mb-2">
              Delete Article?
            </h3>
            <p className="font-['Solway'] text-[15px] text-gray-700 mb-6">
              Are you sure you want to delete <strong>"{postToDelete.title}"</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 font-['Solway'] font-bold text-[14px] text-[#3f2007] bg-white border-2 border-[#3f2007] rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 font-['Solway'] font-bold text-[14px] text-white bg-red-600 border-2 border-[#3f2007] rounded-xl hover:bg-red-700 disabled:opacity-50 cursor-pointer"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
