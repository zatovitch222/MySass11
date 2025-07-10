import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import TeacherDashboard from './components/Dashboard/TeacherDashboard';
import ParentDashboard from './components/Dashboard/ParentDashboard';
import StudentManagement from './components/Students/StudentManagement';
import CourseManagement from './components/Courses/CourseManagement';
import GradeManagement from './components/Grades/GradeManagement';
import InvoiceManagement from './components/Invoices/InvoiceManagement';
import MessageCenter from './components/Messages/MessageCenter';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import ParentManagement from './components/Parents/ParentManagement';
import CalendarView from './components/Calendar/CalendarView';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return user?.role === 'teacher' ? <TeacherDashboard /> : <ParentDashboard />;
      case 'students':
      case 'children':
        return <StudentManagement />;
      case 'courses':
        return <CourseManagement />;
      case 'grades':
        return <GradeManagement />;
      case 'invoices':
        return <InvoiceManagement />;
      case 'parents':
        return <ParentManagement />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'messages':
        return <MessageCenter />;
      case 'calendar':
        return <CalendarView />;
      default:
        return user?.role === 'teacher' ? <TeacherDashboard /> : <ParentDashboard />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className={`flex-1 overflow-y-auto ${activeTab === 'messages' ? '' : 'p-6'}`}>
          {activeTab === 'messages' ? (
            renderContent()
          ) : (
            <div>
              {renderContent()}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;