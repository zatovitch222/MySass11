import React from 'react';
import { Calendar, Users, Euro, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const TeacherDashboard: React.FC = () => {
  const { appState } = useAuth();
  const { students, courses, invoices } = appState;

  const todayCourses = courses.filter(course => 
    new Date(course.date).toDateString() === new Date().toDateString()
  );

  const thisWeekCourses = courses.filter(course => {
    const courseDate = new Date(course.date);
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return courseDate >= weekStart && courseDate <= weekEnd;
  });

  const completedCourses = courses.filter(course => course.status === 'completed');
  const totalRevenue = invoices.reduce((sum, invoice) => 
    invoice.status === 'paid' ? sum + invoice.amount : sum, 0
  );

  const stats = [
    {
      title: 'Élèves actifs',
      value: students.length,
      icon: Users,
      color: 'bg-blue-500',
      change: '+2 ce mois'
    },
    {
      title: 'Cours cette semaine',
      value: thisWeekCourses.length,
      icon: Calendar,
      color: 'bg-green-500',
      change: `${todayCourses.length} aujourd'hui`
    },
    {
      title: 'Revenus du mois',
      value: `${totalRevenue}€`,
      icon: Euro,
      color: 'bg-purple-500',
      change: '+15% vs mois dernier'
    },
    {
      title: 'Cours terminés',
      value: completedCourses.length,
      icon: CheckCircle,
      color: 'bg-orange-500',
      change: 'Taux de réussite: 95%'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
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

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-500" />
            Cours d'aujourd'hui
          </h3>
          
          {todayCourses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun cours prévu aujourd'hui</p>
          ) : (
            <div className="space-y-4">
              {todayCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{course.title}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(course.date).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })} - {course.duration} min
                    </p>
                    <p className="text-sm text-gray-500">{course.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{course.price}€</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      course.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course.status === 'completed' ? 'Terminé' : 'Prévu'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Students */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Élèves récents
          </h3>
          
          <div className="space-y-4">
            {students.slice(0, 3).map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {student.firstName[0]}{student.lastName[0]}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">{student.grade} - {student.subjects.join(', ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(student.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;