import React, { useState } from 'react';
import { Plus, Edit, Trash2, TrendingUp, Award, Calendar, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Grade, Student } from '../../types';

const GradeManagement: React.FC = () => {
  const { appState, updateAppState } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);

  const filteredGrades = appState.grades.filter(grade => {
    const matchesStudent = selectedStudent === '' || grade.studentId === selectedStudent;
    const matchesSubject = selectedSubject === '' || grade.subject === selectedSubject;
    return matchesStudent && matchesSubject;
  });

  const subjects = [...new Set(appState.grades.map(g => g.subject))];
  const students = appState.students;

  const getStudentAverage = (studentId: string, subject?: string) => {
    const studentGrades = appState.grades.filter(g => 
      g.studentId === studentId && (!subject || g.subject === subject)
    );
    if (studentGrades.length === 0) return 0;
    
    const weightedSum = studentGrades.reduce((sum, grade) => 
      sum + (grade.grade / grade.maxGrade) * grade.weight, 0
    );
    const totalWeight = studentGrades.reduce((sum, grade) => sum + grade.weight, 0);
    
    return totalWeight > 0 ? (weightedSum / totalWeight) * 20 : 0;
  };

  const handleAddGrade = (gradeData: Partial<Grade>) => {
    const newGrade: Grade = {
      id: Date.now().toString(),
      studentId: gradeData.studentId || '',
      courseId: gradeData.courseId || '',
      teacherId: appState.currentUser?.id || '',
      subject: gradeData.subject || '',
      grade: gradeData.grade || 0,
      maxGrade: gradeData.maxGrade || 20,
      comment: gradeData.comment || '',
      date: gradeData.date || new Date(),
      type: gradeData.type || 'quiz',
      weight: gradeData.weight || 1.0
    };

    updateAppState({
      grades: [...appState.grades, newGrade]
    });
    setShowAddForm(false);
  };

  const handleEditGrade = (updatedGrade: Grade) => {
    updateAppState({
      grades: appState.grades.map(g => 
        g.id === updatedGrade.id ? updatedGrade : g
      )
    });
    setEditingGrade(null);
  };

  const handleDeleteGrade = (gradeId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      updateAppState({
        grades: appState.grades.filter(g => g.id !== gradeId)
      });
    }
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exam': return '📝';
      case 'quiz': return '❓';
      case 'homework': return '📚';
      case 'participation': return '🗣️';
      default: return '📊';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des notes</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Ajouter une note</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les élèves</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName}
                </option>
              ))}
            </select>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les matières</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Student Averages */}
      {selectedStudent && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Moyennes de l'élève
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Moyenne générale</p>
              <p className="text-2xl font-bold text-blue-900">
                {getStudentAverage(selectedStudent).toFixed(1)}/20
              </p>
            </div>
            {subjects.map(subject => {
              const avg = getStudentAverage(selectedStudent, subject);
              return (
                <div key={subject} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">{subject}</p>
                  <p className={`text-2xl font-bold ${getGradeColor((avg / 20) * 100)}`}>
                    {avg.toFixed(1)}/20
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Grades List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Notes ({filteredGrades.length})
          </h2>
        </div>
        
        {filteredGrades.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Aucune note trouvée
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Élève
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matière
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commentaire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGrades.map((grade) => {
                  const student = students.find(s => s.id === grade.studentId);
                  const percentage = (grade.grade / grade.maxGrade) * 100;
                  
                  return (
                    <tr key={grade.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {student?.firstName[0]}{student?.lastName[0]}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {student?.firstName} {student?.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {grade.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-lg font-bold ${getGradeColor(percentage)}`}>
                            {grade.grade}/{grade.maxGrade}
                          </span>
                          <span className={`ml-2 text-sm ${getGradeColor(percentage)}`}>
                            ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {getTypeIcon(grade.type)} {grade.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(grade.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {grade.comment}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingGrade(grade)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteGrade(grade.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Grade Modal */}
      {(showAddForm || editingGrade) && (
        <GradeForm
          grade={editingGrade}
          students={students}
          courses={appState.courses}
          onSave={editingGrade ? handleEditGrade : handleAddGrade}
          onCancel={() => {
            setShowAddForm(false);
            setEditingGrade(null);
          }}
        />
      )}
    </div>
  );
};

interface GradeFormProps {
  grade?: Grade | null;
  students: Student[];
  courses: any[];
  onSave: (grade: Grade | Partial<Grade>) => void;
  onCancel: () => void;
}

const GradeForm: React.FC<GradeFormProps> = ({ grade, students, courses, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    studentId: grade?.studentId || '',
    courseId: grade?.courseId || '',
    subject: grade?.subject || '',
    grade: grade?.grade || 0,
    maxGrade: grade?.maxGrade || 20,
    comment: grade?.comment || '',
    date: grade?.date ? new Date(grade.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    type: grade?.type || 'quiz',
    weight: grade?.weight || 1.0
  });

  const subjects = ['Mathématiques', 'Français', 'Anglais', 'Physique', 'Chimie', 'Histoire', 'Géographie', 'SVT'];
  const gradeTypes = [
    { value: 'quiz', label: 'Contrôle' },
    { value: 'exam', label: 'Examen' },
    { value: 'homework', label: 'Devoir maison' },
    { value: 'participation', label: 'Participation' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const gradeData = {
      ...formData,
      date: new Date(formData.date),
      ...(grade && { id: grade.id })
    };

    onSave(gradeData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {grade ? 'Modifier la note' : 'Ajouter une note'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Élève
            </label>
            <select
              value={formData.studentId}
              onChange={(e) => setFormData({...formData, studentId: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Sélectionner un élève</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName}
                </option>
              ))}
            </select>
          </div>

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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note
              </label>
              <input
                type="number"
                value={formData.grade}
                onChange={(e) => setFormData({...formData, grade: parseFloat(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.5"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note max
              </label>
              <input
                type="number"
                value={formData.maxGrade}
                onChange={(e) => setFormData({...formData, maxGrade: parseFloat(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                step="0.5"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {gradeTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coefficient
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0.1"
                max="3"
                step="0.1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Commentaire
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({...formData, comment: e.target.value})}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Commentaire sur la note..."
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
              {grade ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradeManagement;