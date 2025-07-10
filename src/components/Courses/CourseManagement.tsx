import React, { useState } from 'react';
import { Plus, Calendar, Clock, MapPin, User, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Course } from '../../types';

const CourseManagement: React.FC = () => {
  const { appState, updateAppState } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const filteredCourses = appState.courses.filter(course => {
    const courseDate = new Date(course.date).toISOString().split('T')[0];
    return courseDate === selectedDate;
  });

  const handleAddCourse = (courseData: Partial<Course>) => {
    const newCourse: Course = {
      id: Date.now().toString(),
      title: courseData.title || '',
      description: courseData.description || '',
      date: courseData.date || new Date(),
      duration: courseData.duration || 60,
      subject: courseData.subject || '',
      studentIds: courseData.studentIds || [],
      teacherId: appState.currentUser?.id || '',
      status: 'scheduled',
      price: courseData.price || 0,
      location: courseData.location || '',
      notes: courseData.notes || '',
      createdAt: new Date()
    };

    updateAppState({
      courses: [...appState.courses, newCourse]
    });
    setShowAddForm(false);
  };

  const handleEditCourse = (updatedCourse: Course) => {
    updateAppState({
      courses: appState.courses.map(c => 
        c.id === updatedCourse.id ? updatedCourse : c
      )
    });
    setEditingCourse(null);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      updateAppState({
        courses: appState.courses.filter(c => c.id !== courseId)
      });
    }
  };

  const handleMarkCompleted = (courseId: string) => {
    updateAppState({
      courses: appState.courses.map(c => 
        c.id === courseId ? { ...c, status: 'completed' as const } : c
      )
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return 'Programmé';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des cours</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau cours</span>
        </button>
      </div>

      {/* Date Filter */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <Calendar className="h-5 w-5 text-gray-400" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date sélectionnée
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-500">
            {filteredCourses.length} cours programmé{filteredCourses.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Cours du {new Date(selectedDate).toLocaleDateString('fr-FR')}
          </h2>
        </div>
        
        {filteredCourses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Aucun cours programmé pour cette date
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredCourses.map((course) => {
              const students = appState.students.filter(s => 
                course.studentIds.includes(s.id)
              );

              return (
                <div key={course.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {course.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
                          {getStatusText(course.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          {new Date(course.date).toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} ({course.duration} min)
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          {students.length} élève{students.length !== 1 ? 's' : ''}
                        </div>
                        
                        {course.location && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {course.location}
                          </div>
                        )}
                        
                        <div className="text-sm font-medium text-gray-900">
                          {course.price}€
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Matière:</strong> {course.subject}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Élèves:</strong> {students.map(s => `${s.firstName} ${s.lastName}`).join(', ')}
                        </p>
                      </div>
                      
                      {course.description && (
                        <p className="text-sm text-gray-600 mb-3">
                          {course.description}
                        </p>
                      )}
                      
                      {course.notes && (
                        <p className="text-sm text-gray-500 italic">
                          <strong>Notes:</strong> {course.notes}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => setEditingCourse(course)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      
                      {course.status === 'scheduled' && (
                        <button
                          onClick={() => handleMarkCompleted(course.id)}
                          className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                        >
                          Marquer terminé
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Course Modal */}
      {(showAddForm || editingCourse) && (
        <CourseForm
          course={editingCourse}
          students={appState.students}
          onSave={editingCourse ? handleEditCourse : handleAddCourse}
          onCancel={() => {
            setShowAddForm(false);
            setEditingCourse(null);
          }}
        />
      )}
    </div>
  );
};

interface CourseFormProps {
  course?: Course | null;
  students: any[];
  onSave: (course: Course | Partial<Course>) => void;
  onCancel: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ course, students, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    date: course?.date ? new Date(course.date).toISOString().slice(0, 16) : '',
    duration: course?.duration || 60,
    subject: course?.subject || '',
    studentIds: course?.studentIds || [],
    price: course?.price || 0,
    location: course?.location || '',
    notes: course?.notes || ''
  });

  const subjects = ['Mathématiques', 'Français', 'Anglais', 'Physique', 'Chimie', 'Histoire', 'Géographie', 'SVT'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const courseData = {
      ...formData,
      date: new Date(formData.date),
      ...(course && { id: course.id, status: course.status })
    };

    onSave(courseData);
  };

  const handleStudentChange = (studentId: string) => {
    setFormData(prev => ({
      ...prev,
      studentIds: prev.studentIds.includes(studentId)
        ? prev.studentIds.filter(id => id !== studentId)
        : [...prev.studentIds, studentId]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {course ? 'Modifier le cours' : 'Nouveau cours'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre du cours
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date et heure
              </label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durée (minutes)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="15"
                step="15"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Matière
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionner une matière</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix (€)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lieu
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Salle de classe, domicile, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Élèves participants
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {students.map(student => (
                <label key={student.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.studentIds.includes(student.id)}
                    onChange={() => handleStudentChange(student.id)}
                    className="mr-2"
                  />
                  <span className="text-sm">{student.firstName} {student.lastName}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Notes sur le cours..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {course ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseManagement;