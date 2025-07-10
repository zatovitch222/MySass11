import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, Database } from '../lib/supabase'

type UserProfile = Database['public']['Tables']['users']['Row']

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  updatePassword: (newPassword: string) => Promise<{ error?: string }>
  refreshProfile: () => Promise<void>
  createUser: (userData: {
    email: string
    password: string
    first_name: string
    last_name: string
    role: 'admin' | 'teacher' | 'student' | 'parent'
    phone?: string
    address?: string
  }) => Promise<{ error?: string }>
  deleteUser: (userId: string) => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  const refreshProfile = async () => {
    if (user) {
      const profile = await fetchUserProfile(user.id)
      setUserProfile(profile)
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        fetchUserProfile(session.user.id).then(setUserProfile)
      }
      
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id)
          setUserProfile(profile)
        } else {
          setUserProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { error: 'Identifiants de connexion invalides' }
        }
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: 'Une erreur est survenue lors de la connexion' }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: 'Une erreur est survenue lors de la mise à jour du mot de passe' }
    }
  }

  const createUser = async (userData: {
    email: string
    password: string
    first_name: string
    last_name: string
    role: 'admin' | 'teacher' | 'student' | 'parent'
    phone?: string
    address?: string
  }) => {
    try {
      const { error } = await supabase.rpc('create_user_account', {
        p_email: userData.email,
        p_password: userData.password,
        p_first_name: userData.first_name,
        p_last_name: userData.last_name,
        p_role: userData.role,
        p_phone: userData.phone || null,
        p_address: userData.address || null
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: 'Une erreur est survenue lors de la création de l\'utilisateur' }
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.rpc('delete_user_account', {
        p_user_id: userId
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: 'Une erreur est survenue lors de la suppression de l\'utilisateur' }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      session,
      loading,
      signIn,
      signOut,
      updatePassword,
      refreshProfile,
      createUser,
      deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}