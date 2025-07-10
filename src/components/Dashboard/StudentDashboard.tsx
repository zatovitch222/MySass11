import React from 'react'
import { Calendar, BookOpen, FileText, Clock, TrendingUp, Award } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const StudentDashboard: React.FC = () => {
  const { userProfile } = useAuth()

  const stats = [
    {
      title: 'Cours cette semaine',
      value: '5',
      icon: Calendar,
      color: 'bg-blue-500',
      change: '2 aujourd\'hui'
    },
    {
      title: 'Devoirs en cours',
      value: '3',
      icon: BookOpen,
      color: 'bg-orange-500',
      change: '1 à rendre demain'
    },
    {
      title: 'Moyenne générale',
      value: '15.2/20',
      icon: Award,
      color: 'bg-green-500',
      change: '+0.5 ce mois'
    },
    {
      title: 'Supports disponibles',
      value: '12',
      icon: FileText,
      color: 'bg-purple-500',
      change: '3 nouveaux'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bonjour {userProfile?.first_name} !
          </h1>
          <p className="text-gray-600 mt-1">Voici un aperçu de votre parcours scolaire</p>
        </div>
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
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
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
          )
        })}
      </div>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-500" />
            Cours d'aujourd'hui
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <h4 className="font-medium text-gray-900">Mathématiques</h4>
                <p className="text-sm text-gray-600">14:00 - 15:00</p>
                <p className="text-sm text-blue-600">Salle 201</p>
              </div>
              <div className="text-right">
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  Dans 2h
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div>
                <h4 className="font-medium text-gray-900">Physique</h4>
                <p className="text-sm text-gray-600">16:00 - 17:30</p>
                <p className="text-sm text-green-600">Laboratoire</p>
              </div>
              <div className="text-right">
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  Dans 4h
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Grades */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Dernières notes
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Contrôle de Mathématiques</h4>
                <p className="text-sm text-gray-600">Équations du second degré</p>
                <p className="text-sm text-gray-500">Il y a 2 jours</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">17/20</p>
                <p className="text-sm text-green-600">85%</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Devoir de Physique</h4>
                <p className="text-sm text-gray-600">Lois de Newton</p>
                <p className="text-sm text-gray-500">Il y a 5 jours</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">15/20</p>
                <p className="text-sm text-blue-600">75%</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Quiz de Français</h4>
                <p className="text-sm text-gray-600">Analyse littéraire</p>
                <p className="text-sm text-gray-500">Il y a 1 semaine</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-purple-600">14/20</p>
                <p className="text-sm text-purple-600">70%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Homework & Materials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Devoirs à faire</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div>
                <h4 className="font-medium text-gray-900">Exercices de Mathématiques</h4>
                <p className="text-sm text-gray-600">Chapitre 5, exercices 1 à 15</p>
              </div>
              <span className="text-xs font-medium text-orange-600">Pour demain</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div>
                <h4 className="font-medium text-gray-900">Rapport de Physique</h4>
                <p className="text-sm text-gray-600">Expérience sur la gravité</p>
              </div>
              <span className="text-xs font-medium text-yellow-600">Pour vendredi</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <h4 className="font-medium text-gray-900">Lecture de Français</h4>
                <p className="text-sm text-gray-600">Chapitre 3 du livre</p>
              </div>
              <span className="text-xs font-medium text-blue-600">Pour lundi</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nouveaux supports</h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                <FileText className="h-4 w-4 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Cours de Mathématiques</h4>
                <p className="text-sm text-gray-600">Les fonctions exponentielles</p>
              </div>
              <span className="text-xs text-gray-500">PDF</span>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">TP de Physique</h4>
                <p className="text-sm text-gray-600">Mesure de la vitesse du son</p>
              </div>
              <span className="text-xs text-gray-500">PDF</span>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                <FileText className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Exercices de Français</h4>
                <p className="text-sm text-gray-600">Analyse de texte</p>
              </div>
              <span className="text-xs text-gray-500">DOC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard