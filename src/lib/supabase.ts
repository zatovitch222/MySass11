import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables d\'environnement Supabase manquantes')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour la base de données
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          auth_id: string
          email: string
          first_name: string
          last_name: string
          role: 'admin' | 'teacher' | 'student' | 'parent'
          phone?: string
          address?: string
          avatar_url?: string
          can_change_password: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_id: string
          email: string
          first_name: string
          last_name: string
          role: 'admin' | 'teacher' | 'student' | 'parent'
          phone?: string
          address?: string
          avatar_url?: string
          can_change_password?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_id?: string
          email?: string
          first_name?: string
          last_name?: string
          role?: 'admin' | 'teacher' | 'student' | 'parent'
          phone?: string
          address?: string
          avatar_url?: string
          can_change_password?: boolean
          is_active?: boolean
          updated_at?: string
        }
      }
      teachers: {
        Row: {
          id: string
          user_id: string
          subjects: string[]
          hourly_rate?: number
          bio?: string
          experience_years: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subjects?: string[]
          hourly_rate?: number
          bio?: string
          experience_years?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subjects?: string[]
          hourly_rate?: number
          bio?: string
          experience_years?: number
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          user_id: string
          level: string
          teacher_id?: string
          parent_id?: string
          date_of_birth?: string
          notes?: string
          subjects: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          level: string
          teacher_id?: string
          parent_id?: string
          date_of_birth?: string
          notes?: string
          subjects?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          level?: string
          teacher_id?: string
          parent_id?: string
          date_of_birth?: string
          notes?: string
          subjects?: string[]
          updated_at?: string
        }
      }
      parents: {
        Row: {
          id: string
          user_id: string
          children_ids: string[]
          emergency_contact?: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          children_ids?: string[]
          emergency_contact?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          children_ids?: string[]
          emergency_contact?: any
          updated_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          name: string
          teacher_id: string
          student_ids: string[]
          subject: string
          level: string
          description?: string
          max_students: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          teacher_id: string
          student_ids?: string[]
          subject: string
          level: string
          description?: string
          max_students?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          teacher_id?: string
          student_ids?: string[]
          subject?: string
          level?: string
          description?: string
          max_students?: number
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description?: string
          date: string
          duration: number
          subject: string
          teacher_id: string
          group_id?: string
          student_id?: string
          status: 'scheduled' | 'completed' | 'cancelled'
          location?: string
          notes?: string
          homework?: string
          price?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          date: string
          duration: number
          subject: string
          teacher_id: string
          group_id?: string
          student_id?: string
          status?: 'scheduled' | 'completed' | 'cancelled'
          location?: string
          notes?: string
          homework?: string
          price?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          date?: string
          duration?: number
          subject?: string
          teacher_id?: string
          group_id?: string
          student_id?: string
          status?: 'scheduled' | 'completed' | 'cancelled'
          location?: string
          notes?: string
          homework?: string
          price?: number
          updated_at?: string
        }
      }
      course_materials: {
        Row: {
          id: string
          title: string
          description?: string
          file_url: string
          file_name: string
          file_type: string
          file_size: number
          teacher_id: string
          course_id?: string
          group_id?: string
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          file_url: string
          file_name: string
          file_type: string
          file_size: number
          teacher_id: string
          course_id?: string
          group_id?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          file_url?: string
          file_name?: string
          file_type?: string
          file_size?: number
          teacher_id?: string
          course_id?: string
          group_id?: string
          is_public?: boolean
          updated_at?: string
        }
      }
      grades: {
        Row: {
          id: string
          student_id: string
          course_id?: string
          teacher_id: string
          subject: string
          grade: number
          max_grade: number
          coefficient: number
          comment?: string
          date: string
          type: 'quiz' | 'exam' | 'homework' | 'participation'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          course_id?: string
          teacher_id: string
          subject: string
          grade: number
          max_grade?: number
          coefficient?: number
          comment?: string
          date: string
          type?: 'quiz' | 'exam' | 'homework' | 'participation'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          teacher_id?: string
          subject?: string
          grade?: number
          max_grade?: number
          coefficient?: number
          comment?: string
          date?: string
          type?: 'quiz' | 'exam' | 'homework' | 'participation'
          updated_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          student_id: string
          course_id: string
          status: 'present' | 'absent' | 'late' | 'excused'
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          status: 'present' | 'absent' | 'late' | 'excused'
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          status?: 'present' | 'absent' | 'late' | 'excused'
          notes?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      create_user_account: {
        Args: {
          p_email: string
          p_password: string
          p_first_name: string
          p_last_name: string
          p_role: 'admin' | 'teacher' | 'student' | 'parent'
          p_phone?: string
          p_address?: string
        }
        Returns: string
      }
      delete_user_account: {
        Args: {
          p_user_id: string
        }
        Returns: boolean
      }
    }
  }
}