'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    if (!isLogin) {
      // Handle Registration
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        })
        
        const data = await res.json()
        
        if (!res.ok) {
          setError(data.error || 'Registration failed')
          setLoading(false)
          return
        }
        
        // On successful registration, log them in automatically
      } catch (err) {
        setError('An error occurred during registration')
        setLoading(false)
        return
      }
    }

    // Handle Login (for both login directly, or after successful register)
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password
    })

    setLoading(false)

    if (res?.error) {
      setError(isLogin ? 'Invalid email or password' : 'Login after registration failed')
    } else {
      router.push('/profile')
      router.refresh()
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <h1 className={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className={styles.subtitle}>
            {isLogin ? 'Sign in to your Kurti Kalakar account' : 'Join Kurti Kalakar today'}
          </p>
          
          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleAuth} className={styles.form}>
            {!isLogin && (
              <input 
                type="text" 
                placeholder="Full Name" 
                required 
                className={styles.input}
                value={name}
                onChange={e => setName(e.target.value)}
              />
            )}
            <input 
              type="email" 
              placeholder="Email address" 
              required 
              className={styles.input}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Password" 
              required 
              className={styles.input}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <div className={styles.toggleText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              className={styles.toggleBtn}
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </div>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <button 
            className={styles.googleBtn}
            onClick={() => signIn('google', { callbackUrl: '/profile' })}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </main>
  )
}
