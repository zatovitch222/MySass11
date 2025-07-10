import React, { useState, useEffect } from 'react'
import { Users, GraduationCap, BookOpen, UserCheck, TrendingUp, Calendar, Shield, Plus } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Stats {
  totalUsers: number
  totalTeachers: number
  totalStudents: number
  totalParents: number
  totalCourses: number
  recentActivity: any[]
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalParents: 0,
    totalCourses: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch users count by role
      const { data: users } = await supabase
        .from('users')
        .select('role')

      const totalUsers = users?.length || 0
      const totalTeachers = users?.filter(u => u.role === 'teacher').length || 0
      const totalStudents = users?.filter(u => u.role === 'student').length || 0
      const totalParents = users?.filter(u => u.role === 'parent').length || 0

      // Fetch courses count
      const { data: courses } = await supabase
        .from('courses')
        .select('id')

      const totalCourses = courses?.length || 0

      // Fetch recent activity (recent users)
      const { data: recentUsers } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      setStats({
        totalUsers,
        totalTeachers,
        totalStudents,
        totalParents,
        totalCourses,
        recentActivity: recentUsers || []
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statsCards = [
    {
      title: 'Total Utilisateurs',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: 'Tous rôles confondus'
    },
    {
      title: 'Professeurs',
      value: stats.totalTeachers,
      icon: GraduationCap,
      color: 'bg-green-500',
      change: 'Actifs sur la plateforme'
    },
    {
      title: 'Élèves',
      value: stats.totalStudents,
      icon: BookOpen,
      color: 'bg-purple-500',
      change: 'Inscrits aux cours'
    },
    {
      title: 'Parents',
      value: stats.totalParents,
      icon: UserCheck,
      color: 'bg-orange-500',
      change: 'Comptes parentaux'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord administrateur</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de la plateforme EduManage Pro</p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-red-500" />
          <span className="text-sm font-medium text-red-600">Mode Administrateur</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group">
            <div className="text-center">
              <Plus className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Créer un professeur</p>
            </div>
          </button>
          
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group">
            <div className="text-center">
              <Plus className="h-8 w-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600 group-hover:text-green-600">Créer un élève</p>
            </div>
          </button>
          
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group">
            <div className="text-center">
              <Plus className="h-8 w-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600 group-hover:text-purple-600">Créer un parent</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
          Activité récente
        </h3>
        
        {stats.recentActivity.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Aucune activité récente</p>
        ) : (
          <div className="space-y-4">
            {stats.recentActivity.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {user.role === 'teacher' ? 'Professeur' :
                       user.role === 'student' ? 'Élève' :
                       user.role === 'parent' ? 'Parent' : 'Utilisateur'} - {user.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('fr-FR')}
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                    user.role === 'student' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {user.role === 'admin' ? 'Admin' :
                     user.role === 'teacher' ? 'Prof' :
                     user.role === 'student' ? 'Élève' : 'Parent'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* System Status */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">État du système</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Base de données</span>
            <span className="text-sm font-medium text-green-600">Opérationnelle</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Authentification</span>
            <span className="text-sm font-medium text-green-600">Opérationnelle</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Stockage</span>
            <span className="text-sm font-medium text-green-600">Opérationnel</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard