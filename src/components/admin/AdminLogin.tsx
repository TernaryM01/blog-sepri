import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import logoIcon from '../../assets/logo-icon.svg'

interface AdminLoginProps {
  onLoginSuccess: () => void
  onNavigateHome: () => void
}

export function AdminLogin({ onLoginSuccess, onNavigateHome }: AdminLoginProps) {
  const [email, setEmail] = useState('sepri@gmail.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError) {
        throw authError
      }

      if (!authData.user) {
        throw new Error('No user data returned.')
      }

      // 2. Verify admin role in user_roles table
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authData.user.id)
        .single()

      if (roleError || !roleData || roleData.role !== 'admin') {
        // Sign out if not admin
        await supabase.auth.signOut()
        throw new Error('Access denied: Your account does not have admin privileges.')
      }

      onLoginSuccess()
    } catch (err: unknown) {
      console.error('Login error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to log in. Please check your credentials.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center px-4 py-12">
      {/* Login Card */}
      <div className="relative w-full max-w-[450px] bg-[#fffcf5] border-[4px] border-[#3f2007] shadow-[10px_10px_0px_2px_rgba(0,0,0,0.25)] rounded-[28px] p-8 md:p-10">
        {/* Top Washi Tape Sticker Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-[#d82b78]/85 border-b-2 border-r-2 border-[#3f2007]/30 shadow-sm rotate-[1.5deg]" />

        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <img src={logoIcon} alt="Logo" className="w-16 h-16 mb-2" />
          <h1 className="font-['Solway'] text-[28px] font-bold text-[#3f2007] m-0">
            Sepriani’s Lab Admin
          </h1>
          <p className="font-['Solway'] text-[14px] text-[#6b4728] mt-1">
            Sign in to manage and publish blog posts
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-[#ffdddd] border-2 border-[#d82b78] text-[#8a1f1f] p-3.5 rounded-xl font-['Solway'] text-[14px] mb-6 shadow-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block font-['Solway'] text-[14px] font-bold text-[#3f2007] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sepri@gmail.com"
              className="w-full px-4 py-2.5 bg-white border-2 border-[#3f2007] rounded-xl font-['Solway'] text-[16px] text-black focus:outline-none focus:ring-2 focus:ring-[#fd7e1c]"
            />
          </div>

          <div>
            <label className="block font-['Solway'] text-[14px] font-bold text-[#3f2007] mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-white border-2 border-[#3f2007] rounded-xl font-['Solway'] text-[16px] text-black focus:outline-none focus:ring-2 focus:ring-[#fd7e1c]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-[#fd7e1c] text-white border-[3px] border-[#3f2007] shadow-[4px_4px_0px_1px_rgba(0,0,0,0.25)] py-3 rounded-xl font-['Solway'] font-bold text-[18px] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-8 text-center border-t-2 border-dashed border-[#3f2007]/20 pt-4">
          <button
            onClick={onNavigateHome}
            className="font-['Solway'] text-[14px] font-semibold text-[#6b4728] hover:text-[#3f2007] underline bg-transparent border-none cursor-pointer"
          >
            ← Back to Public Website
          </button>
        </div>
      </div>
    </div>
  )
}
