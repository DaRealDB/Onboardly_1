'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  isSuperAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const checkSuperAdmin = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('super_admins')
      .select('id')
      .eq('user_id', userId)
      .single()
    
    setIsSuperAdmin(!!data)
  }, [supabase])

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await checkSuperAdmin(session.user.id)
      }
      
      setIsLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await checkSuperAdmin(session.user.id)
        } else {
          setIsSuperAdmin(false)
        }
        
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, checkSuperAdmin])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    // Check if user has any tenants (via team_members)
    if (data.user) {
      const { data: teamMemberships } = await supabase
        .from('team_members')
        .select('tenant_id')
        .eq('user_id', data.user.id)
        .limit(1)

      if (!teamMemberships || teamMemberships.length === 0) {
        // No tenants, redirect to onboarding
        router.push('/onboarding')
      } else {
        // Has tenants, go to dashboard
        router.push('/dashboard')
      }
    } else {
      router.push('/dashboard')
    }
    
    router.refresh()
    return { error: null }
  }

  const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? 
          `${window.location.origin}/auth/callback`,
        data: metadata,
      },
    })

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setIsSuperAdmin(false)
    router.push('/')
    router.refresh()
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      signIn,
      signUp,
      signOut,
      isSuperAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
