import React, { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginForm from './components/Auth/LoginForm'
import Header from './components/Layout/Header'
import Sidebar from './components/Layout/Sidebar'

// Admin Components
import AdminDashboard from './components/Admin/AdminDashboard'
import UserManagement from './components/Admin/UserManagement'

// Teacher Components
import TeacherDashboard from './components/Dashboard/TeacherDashboard'

// Student Components
import StudentDashboard from './components/Dashboard/StudentDashboard'

// Parent Components
import ParentDashboard from './components/Dashboard/ParentDashboard'

// Shared Components
import StudentManagement from './components/Students/StudentManagement'
import CourseManagement from './components/Courses/CourseManagement'
import GradeManagement from './components/Grades/GradeManagement'
import CalendarView from './components/Calendar/CalendarView'
import MessageCenter from './components/Messages/MessageCenter'
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard'
import ParentManagement from './components/Parents/ParentManagement'

const AppContent: React.FC = () => {
  const { user, userProfile, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user || !userProfile) {
    return <LoginForm />
  }

  const renderContent = () => {
    const role = userProfile.role

    // Admin routes
    if (role === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboard />
        case 'users':
          return <UserManagement />
        case 'teachers':
          return <div>Gestion des professeurs (à implémenter)</div>
        case 'students':
          return <StudentManagement />
        case 'parents':
          return <ParentManagement />
        case 'system':
          return <div>Configuration système (à implémenter)</div>
        case 'analytics':
          return <AnalyticsDashboard />
        default:
          return <AdminDashboard />
      }
    }

    // Teacher routes
    if (role === 'teacher') {
      switch (activeTab) {
        case 'dashboard':
          return <TeacherDashboard />
        case 'students':
          return <StudentManagement />
        case 'groups':
          return <div>Gestion des groupes (à implémenter)</div>
        case 'courses':
          return <CourseManagement />
        case 'calendar':
          return <CalendarView />
        case 'materials':
          return <div>Supports de cours (à implémenter)</div>
        case 'grades':
          return <GradeManagement />
        case 'attendance':
          return <div>Gestion des présences (à implémenter)</div>
        case 'messages':
          return <MessageCenter />
        default:
          return <TeacherDashboard />
      }
    }

    // Student routes
    if (role === 'student') {
      switch (activeTab) {
        case 'dashboard':
          return <StudentDashboard />
        case 'schedule':
          return <CalendarView />
        case 'materials':
          return <div>Mes supports de cours (à implémenter)</div>
        case 'grades':
          return <GradeManagement />
        case 'homework':
          return <div>Mes devoirs (à implémenter)</div>
        case 'profile':
          return <div>Mon profil (à implémenter)</div>
        case 'password':
          return <div>Changer mot de passe (à implémenter)</div>
        default:
          return <StudentDashboard />
      }
    }

    // Parent routes
    if (role === 'parent') {
      switch (activeTab) {
        case 'dashboard':
          return <ParentDashboard />
        case 'children':
          return <StudentManagement />
        case 'schedule':
          return <CalendarView />
        case 'grades':
          return <GradeManagement />
        case 'homework':
          return <div>Devoirs des enfants (à implémenter)</div>
        case 'invoices':
          return <div>Mes factures (à implémenter)</div>
        case 'messages':
          return <MessageCenter />
        default:
          return <ParentDashboard />
      }
    }

    return <div>Rôle non reconnu</div>
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className={`flex-1 overflow-y-auto ${activeTab === 'messages' ? '' : 'p-6'}`}>
          {activeTab === 'messages' ? (
            renderContent()
          ) : (
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App