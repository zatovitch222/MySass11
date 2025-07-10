import React from 'react'
import { Bell, LogOut, User, Settings, Shield, GraduationCap, Users, BookOpen } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Header: React.FC = () => {
  const { userProfile, signOut } = useAuth()

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />
      case 'teacher':
        return <GraduationCap className="h-4 w-4" />
      case 'student':
        return <BookOpen className="h-4 w-4" />
      case 'parent':
        return <Users className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur'
      case 'teacher':
        return 'Professeur'
      case 'student':
        return 'Élève'
      case 'parent':
        return 'Parent'
      default:
        return 'Utilisateur'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'teacher':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'student':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'parent':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                EduManage Pro
              </h1>
            </div>
            
            {userProfile && (
              <div className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${getRoleColor(userProfile.role)}`}>
                {getRoleIcon(userProfile.role)}
                <span className="ml-1">{getRoleLabel(userProfile.role)}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            
            <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {userProfile?.first_name} {userProfile?.last_name}
                </p>
                <p className="text-xs text-gray-500">{userProfile?.email}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {userProfile?.first_name?.[0]}{userProfile?.last_name?.[0]}
                  </span>
                </div>
                
                <button 
                  onClick={signOut}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Déconnexion"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header