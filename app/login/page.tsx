'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { LoginForm } from '@/components/login-form'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogin(email: string, password: string) {
    setError('')
    setIsLoading(true)
    
    try {
      const success = await login(email, password)
      if (success) {
        router.push('/dashboard')
      } else {
        setError('Credenciais inválidas. Tente novamente.')
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <LoginForm 
        onSubmit={handleLogin} 
        error={error} 
        isLoading={isLoading} 
      />
    </main>
  )
}
