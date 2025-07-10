import React from 'react';
import { Calendar, GraduationCap, FileText, CreditCard, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ParentDashboard: React.FC = () => {
  const { appState } = useAuth();
  const { students, courses, grades, invoices } = appState;

  const upcomingCourses = courses.filter(course => 
    new Date(course.date) > new Date() && course.status === 'scheduled'
  ).slice(0, 3);

  const recentGrades = grades.slice(-3).reverse();
  const pendingInvoices = invoices.filter(invoice => invoice.status === 'sent');

  const stats = [
    {
      title: 'Mes enfants',
      value: students.length,
      icon: GraduationCap,
      color: 'bg-blue-500',
      change: 'Inscrits'
    },
    {
      title: 'Cours à venir',
      value: upcomingCourses.length,
      icon: Calendar,
      color: 'bg-green-500',
      change: 'Cette semaine'
    },
    {
      title: 'Dernières notes',
      value: recentGrades.length,
      icon: FileText,
      color: 'bg-purple-500',
      change: 'Nouvelles'
    },
    {
      title: 'Factures en attente',
      value: pendingInvoices.length,
      icon: CreditCard,
      color: 'bg-orange-500',
      change: `${pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0)}€`
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord parent</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Courses */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-500" />
            Prochains cours
          </h3>
          
          {upcomingCourses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun cours à venir</p>
          ) : (
            <div className="space-y-4">
              {upcomingCourses.map((course) => {
                const student = students.find(s => course.studentIds.includes(s.id));
                return (
                  <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{course.title}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(course.date).toLocaleDateString('fr-FR')} à {' '}
                        {new Date(course.date).toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {student?.firstName} {student?.lastName} - {course.subject}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{course.price}€</p>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        Programmé
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Grades */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Dernières notes
          </h3>
          
          {recentGrades.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune note récente</p>
          ) : (
            <div className="space-y-4">
              {recentGrades.map((grade) => {
                const student = students.find(s => s.id === grade.studentId);
                return (
                  <div key={grade.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{grade.subject}</h4>
                      <p className="text-sm text-gray-600">
                        {student?.firstName} {student?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(grade.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {grade.grade}/{grade.maxGrade}
                      </p>
                      <p className={`text-sm font-medium ${
                        grade.grade >= grade.maxGrade * 0.8 
                          ? 'text-green-600' 
                          : grade.grade >= grade.maxGrade * 0.6
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}>
                        {Math.round((grade.grade / grade.maxGrade) * 100)}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;