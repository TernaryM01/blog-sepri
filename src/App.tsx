import { useState, useEffect } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import { Hero } from './components/Hero'
import { Blog } from './components/Blog'
import { BlogPostPage } from './components/BlogPostPage'
import { AdminLogin } from './components/admin/AdminLogin'
import { AdminDashboard } from './components/admin/AdminDashboard'

type RouteState =
  | { type: 'home' }
  | { type: 'post'; slug: string }
  | { type: 'admin' }

function getRouteFromLocation(): RouteState {
  if (typeof window === 'undefined') return { type: 'home' }

  const pathname = window.location.pathname

  if (pathname.startsWith('/admin')) {
    return { type: 'admin' }
  }

  if (pathname.startsWith('/blog/')) {
    const slug = pathname.replace('/blog/', '').trim()
    if (slug) return { type: 'post', slug }
  }

  const searchParams = new URLSearchParams(window.location.search)
  const postParam = searchParams.get('post')
  if (postParam) return { type: 'post', slug: postParam }

  return { type: 'home' }
}

function App() {
  const [route, setRoute] = useState<RouteState>(() => getRouteFromLocation())
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  // Verify auth and admin role
  const checkUserAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single()

      if (!error && data && data.role === 'admin') {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
      }
    } catch {
      setIsAdmin(false)
    }
  }

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        checkUserAdminStatus(session.user.id).finally(() => setAuthLoading(false))
      } else {
        setIsAdmin(false)
        setAuthLoading(false)
      }
    })

    // Listen to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) {
        checkUserAdminStatus(session.user.id).finally(() => setAuthLoading(false))
      } else {
        setIsAdmin(false)
        setAuthLoading(false)
      }
    })

    const handleLocationChange = () => {
      setRoute(getRouteFromLocation())
    }

    window.addEventListener('popstate', handleLocationChange)

    return () => {
      authListener.subscription.unsubscribe()
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [])

  const handleSelectPost = (slug: string) => {
    window.history.pushState({}, '', `/blog/${slug}`)
    setRoute({ type: 'post', slug })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavigateHome = () => {
    window.history.pushState({}, '', '/')
    setRoute({ type: 'home' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setIsAdmin(false)
  }

  return (
    <div
      id="Desktop"
      className="min-h-screen w-full bg-[#8f8f8f] flex flex-row justify-center items-stretch overflow-x-clip"
    >
      <div
        id="Body"
        className="w-full max-w-[1280px] min-h-screen bg-[#cbefe6] outline-[4px] outline-black/25 flex flex-col items-center justify-start relative flex-1 self-stretch overflow-x-clip"
      >
        {route.type === 'admin' ? (
          authLoading ? (
            <div className="w-full min-h-[70vh] flex items-center justify-center">
              <div className="font-['Solway'] text-[20px] font-bold text-[#3f2007] animate-pulse">
                Loading Sepriani’s Lab Admin...
              </div>
            </div>
          ) : session && isAdmin ? (
            <AdminDashboard
              userEmail={session.user.email || 'Admin'}
              onLogout={handleLogout}
              onNavigateHome={handleNavigateHome}
            />
          ) : (
            <AdminLogin
              onLoginSuccess={() => {
                supabase.auth.getSession().then(({ data: { session } }) => {
                  setSession(session)
                  if (session?.user) {
                    checkUserAdminStatus(session.user.id)
                  }
                })
              }}
              onNavigateHome={handleNavigateHome}
            />
          )
        ) : route.type === 'post' ? (
          <BlogPostPage
            slug={route.slug}
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
