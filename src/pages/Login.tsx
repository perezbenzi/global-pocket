import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { signIn, user } = useAuth()

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn(email, password)
      navigate('/')
    } catch (err: any) {
      setError(err.message)
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8">
        <div className="rounded-xl overflow-hidden shadow-lg bg-card">
          <div className="bg-primary p-5">
            <h2 className="text-xl font-bold text-primary-foreground">Login</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">Email</label>
              <input 
                id="email"
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="example@email.com" 
                className="w-full p-3 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" 
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-foreground">Password</label>
              <input 
                id="password"
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="w-full p-3 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" 
              />
            </div>
            {error && <p className="text-destructive text-sm rounded-lg bg-destructive/10 p-3">{error}</p>}
            <button 
              type="submit" 
              className="w-full py-3 px-5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-md transition-colors"
            >
              Login
            </button>
            <p className="text-sm text-foreground text-center pt-3">
              Don't have an account? <a href="/register" className="text-primary font-medium hover:text-primary/80 transition-colors">Create account</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login 