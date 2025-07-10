import React from 'react';
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
  CalendarDays
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();

  const teacherNavItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'students', label: 'Élèves', icon: GraduationCap },
    { id: 'parents', label: 'Parents', icon: UserCheck },
    { id: 'courses', label: 'Cours', icon: Calendar },
    { id: 'calendar', label: 'Calendrier', icon: CalendarDays },
    { id: 'grades', label: 'Notes', icon: FileText },
    { id: 'invoices', label: 'Facturation', icon: CreditCard },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'analytics', label: 'Statistiques', icon: BarChart3 }
  ];

  const parentNavItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'children', label: 'Mes enfants', icon: GraduationCap },
    { id: 'courses', label: 'Cours', icon: Calendar },
    { id: 'calendar', label: 'Calendrier', icon: CalendarDays },
    { id: 'grades', label: 'Notes', icon: FileText },
    { id: 'invoices', label: 'Factures', icon: CreditCard },
    { id: 'messages', label: 'Messages', icon: MessageSquare }
  ];

  const navItems = user?.role === 'teacher' ? teacherNavItems : parentNavItems;

  return (
    <div className="w-64 bg-gray-50 h-full border-r border-gray-200">
      <nav className="mt-8">
        <div className="px-4 mb-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Navigation
          </h2>
        </div>
        
        <div className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;