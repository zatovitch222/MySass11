import React from 'react'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  GraduationCap, 
  CreditCard, 
  FileText, 
  UserCheck,
  BarChart3,
  MessageSquare,
  CalendarDays,
  Settings,
  Shield,
  BookOpen,
  Upload,
  UserPlus,
  FolderOpen,
  ClipboardList,
  Key
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { userProfile } = useAuth()

  const getNavItems = () => {
    switch (userProfile?.role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
          { id: 'users', label: 'Utilisateurs', icon: Users },
          { id: 'teachers', label: 'Professeurs', icon: GraduationCap },
          { id: 'students', label: 'Élèves', icon: BookOpen },
          { id: 'parents', label: 'Parents', icon: UserCheck },
          { id: 'system', label: 'Système', icon: Settings },
          { id: 'analytics', label: 'Statistiques', icon: BarChart3 }
        ]
      
      case 'teacher':
        return [
          { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
          { id: 'students', label: 'Mes élèves', icon: BookOpen },
          { id: 'groups', label: 'Groupes', icon: Users },
          { id: 'courses', label: 'Cours', icon: Calendar },
          { id: 'calendar', label: 'Planning', icon: CalendarDays },
          { id: 'materials', label: 'Supports', icon: FolderOpen },
          { id: 'grades', label: 'Notes', icon: FileText },
          { id: 'attendance', label: 'Présences', icon: ClipboardList },
          { id: 'messages', label: 'Messages', icon: MessageSquare }
        ]
      
      case 'student':
        return [
          { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
          { id: 'schedule', label: 'Mon planning', icon: CalendarDays },
          { id: 'materials', label: 'Supports de cours', icon: FolderOpen },
          { id: 'grades', label: 'Mes notes', icon: FileText },
          { id: 'homework', label: 'Devoirs', icon: ClipboardList },
          { id: 'profile', label: 'Mon profil', icon: Settings },
          { id: 'password', label: 'Mot de passe', icon: Key }
        ]
      
      case 'parent':
        return [
          { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
          { id: 'children', label: 'Mes enfants', icon: BookOpen },
          { id: 'schedule', label: 'Planning', icon: CalendarDays },
          { id: 'grades', label: 'Notes', icon: FileText },
          { id: 'homework', label: 'Devoirs', icon: ClipboardList },
          { id: 'invoices', label: 'Factures', icon: CreditCard },
          { id: 'messages', label: 'Messages', icon: MessageSquare }
        ]
      
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <div className="w-64 bg-white h-full border-r border-gray-200 shadow-sm">
      <nav className="mt-8">
        <div className="px-4 mb-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Navigation
          </h2>
        </div>
        
        <div className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-r-2 border-blue-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                {item.label}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default Sidebar