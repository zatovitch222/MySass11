import React, { useState } from 'react';
import { TrendingUp, DollarSign, Users, Calendar, Award, Clock, Target, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AnalyticsDashboard: React.FC = () => {
  const { appState } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Calculate metrics
  const totalRevenue = appState.invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalCourses = appState.courses.length;
  const completedCourses = appState.courses.filter(c => c.status === 'completed').length;
  const totalStudents = appState.students.length;
  const averageGrade = appState.grades.length > 0 
    ? appState.grades.reduce((sum, grade) => sum + (grade.grade / grade.maxGrade) * 20, 0) / appState.grades.length
    : 0;

  const completionRate = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;
  const noShowRate = appState.courses.filter(c => c.status === 'cancelled').length / totalCourses * 100;

  // Monthly revenue data (mock)
  const monthlyRevenue = [
    { month: 'Jan', revenue: 1200, courses: 15 },
    { month: 'Fév', revenue: 1450, courses: 18 },
    { month: 'Mar', revenue: 1300, courses: 16 },
    { month: 'Avr', revenue: 1600, courses: 20 },
    { month: 'Mai', revenue: 1750, courses: 22 },
    { month: 'Jun', revenue: 1900, courses: 24 },
  ];

  // Subject performance data
  const subjectPerformance = [
    { subject: 'Mathématiques', students: 8, avgGrade: 15.2, revenue: 2400 },
    { subject: 'Physique', students: 5, avgGrade: 16.1, revenue: 1800 },
    { subject: 'Français', students: 6, avgGrade: 14.8, revenue: 1600 },
    { subject: 'Chimie', students: 3, avgGrade: 15.9, revenue: 900 },
  ];

  const stats = [
    {
      title: 'Revenus totaux',
      value: `${totalRevenue}€`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+12% vs mois dernier',
      trend: 'up'
    },
    {
      title: 'Élèves actifs',
      value: totalStudents,
      icon: Users,
      color: 'bg-blue-500',
      change: '+3 nouveaux ce mois',
      trend: 'up'
    },
    {
      title: 'Cours donnés',
      value: completedCourses,
      icon: Calendar,
      color: 'bg-purple-500',
      change: `${totalCourses - completedCourses} programmés`,
      trend: 'neutral'
    },
    {
      title: 'Note moyenne',
      value: `${averageGrade.toFixed(1)}/20`,
      icon: Award,
      color: 'bg-orange-500',
      change: '+0.3 vs mois dernier',
      trend: 'up'
    }
  ];

  const kpis = [
    {
      title: 'Taux de réalisation',
      value: `${completionRate.toFixed(1)}%`,
      description: 'Cours terminés vs programmés',
      color: 'text-green-600'
    },
    {
      title: 'Taux d\'absence',
      value: `${noShowRate.toFixed(1)}%`,
      description: 'Cours annulés ou non honorés',
      color: 'text-red-600'
    },
    {
      title: 'Revenus par élève',
      value: `${totalStudents > 0 ? (totalRevenue / totalStudents).toFixed(0) : 0}€`,
      description: 'Moyenne par élève actif',
      color: 'text-blue-600'
    },
    {
      title: 'Cours par semaine',
      value: `${(completedCourses / 24).toFixed(1)}`,
      description: 'Moyenne hebdomadaire',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Statistiques et Analytics</h1>
        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-xs mt-1 ${
                    stat.trend === 'up' ? 'text-green-600' : 
                    stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* KPIs */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-blue-500" />
          Indicateurs clés de performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, index) => (
            <div key={index} className="text-center">
              <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
              <p className="text-sm font-medium text-gray-900 mt-1">{kpi.title}</p>
              <p className="text-xs text-gray-500 mt-1">{kpi.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Évolution des revenus
          </h3>
          <div className="space-y-4">
            {monthlyRevenue.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-600 w-8">{data.month}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(data.revenue / 2000) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{data.revenue}€</p>
                  <p className="text-xs text-gray-500">{data.courses} cours</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-purple-500" />
            Performance par matière
          </h3>
          <div className="space-y-4">
            {subjectPerformance.map((subject, index) => (
              <div key={index} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{subject.subject}</h4>
                  <span className="text-sm font-bold text-blue-600">{subject.revenue}€</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Élèves</p>
                    <p className="font-medium">{subject.students}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Note moyenne</p>
                    <p className={`font-medium ${
                      subject.avgGrade >= 16 ? 'text-green-600' :
                      subject.avgGrade >= 12 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {subject.avgGrade}/20
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-gray-500" />
          Activité récente
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Facture payée</p>
              <p className="text-xs text-gray-600">INV-2024-002 - 30€ - Sophie Dubois</p>
            </div>
            <span className="text-xs text-gray-500">Il y a 2h</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Cours terminé</p>
              <p className="text-xs text-gray-600">Mathématiques - Alice Martin</p>
            </div>
            <span className="text-xs text-gray-500">Il y a 4h</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Note ajoutée</p>
              <p className="text-xs text-gray-600">Physique - 17/20 - Alice Martin</p>
            </div>
            <span className="text-xs text-gray-500">Hier</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Nouveau message</p>
              <p className="text-xs text-gray-600">Jean Martin - Question sur les devoirs</p>
            </div>
            <span className="text-xs text-gray-500">Il y a 2 jours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;