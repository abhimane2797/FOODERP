import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Utensils, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'
import { Button, Input, Checkbox } from '../../components/ui'
import { useToast } from '../../hooks/useToast'

export function LoginPage() {
  const [email, setEmail] = useState('admin@spicegarden.in')
  const [password, setPassword] = useState('demo1234')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { addToast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    addToast({ type: 'success', title: 'Welcome back!', message: 'Signed in as Rajesh Kumar' })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-600/20">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-surface-900">Spice Garden</p>
              <p className="text-sm text-surface-400">Restaurant ERP & POS</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Welcome back</h1>
          <p className="text-sm text-surface-500 mt-1.5 mb-8">Sign in to your restaurant dashboard</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@restaurant.com"
              icon={<Mail className="w-4 h-4" />}
              required
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              icon={<Lock className="w-4 h-4" />}
              iconRight={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-surface-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              required
            />

            <div className="flex items-center justify-between">
              <Checkbox checked={remember} onChange={setRemember} label="Remember me" id="remember" />
              <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Forgot password?</a>
            </div>

            <Button type="submit" loading={loading} fullWidth size="lg" iconRight={<ArrowRight className="w-4 h-4" />}>
              Sign In
            </Button>
          </form>

          <div className="mt-8 p-4 rounded-xl bg-surface-50 border border-surface-200">
            <div className="flex items-center gap-2 text-sm text-surface-600">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="font-medium">Demo Mode</span>
            </div>
            <p className="text-xs text-surface-400 mt-1">Credentials are pre-filled. Just click Sign In to explore.</p>
          </div>
        </div>
      </div>

      {/* Right: Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary-700 via-primary-800 to-surface-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-300/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full" />
        </div>

        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center mx-auto mb-8">
            <Utensils className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight leading-tight">
            Manage your restaurant<br />with confidence
          </h2>
          <p className="text-primary-200 mt-4 text-base leading-relaxed">
            POS, KOT, Inventory, CRM, Reports and more — everything you need in one modern platform.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { value: '342+', label: 'Daily Orders' },
              { value: '99.9%', label: 'Uptime' },
              { value: '50+', label: 'Features' },
            ].map(stat => (
              <div key={stat.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-primary-200 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
