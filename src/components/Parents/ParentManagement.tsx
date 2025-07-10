import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Mail, Phone, MapPin, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Parent } from '../../types';

const ParentManagement: React.FC = () => {
  const { appState, updateAppState } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);

  const filteredParents = appState.parents.filter(parent => 
    parent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddParent = (parentData: Partial<Parent>) => {
    const newParent: Parent = {
      id: Date.now().toString(),
      email: parentData.email || '',
      firstName: parentData.firstName || '',
      lastName: parentData.lastName || '',
      role: 'parent',
      phone: parentData.phone || '',
      address: parentData.address || '',
      children: parentData.children || [],
      createdAt: new Date(),
      isActive: true,
      preferredPaymentMethod: parentData.preferredPaymentMethod || 'card',
      notifications: {
        email: true,
        sms: true,
        push: true,
        courseReminders: true,
        paymentReminders: true,
        gradeUpdates: true
      }
    };

    updateAppState({
      parents: [...appState.parents, newParent]
    });
    setShowAddForm(false);
  };

  const handleEditParent = (updatedParent: Parent) => {
    updateAppState({
      parents: appState.parents.map(p => 
        p.id === updatedParent.id ? updatedParent : p
      )
    });
    setEditingParent(null);
  };

  const handleDeleteParent = (parentId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce parent ?')) {
      updateAppState({
        parents: appState.parents.filter(p => p.id !== parentId)
      });
    }
  };

  const getParentChildren = (parentId: string) => {
    return appState.students.filter(student => student.parentIds.includes(parentId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des parents</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Ajouter un parent</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Rechercher un parent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Parents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParents.map((parent) => {
          const children = getParentChildren(parent.id);
          return (
            <div key={parent.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {parent.firstName[0]}{parent.lastName[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {parent.firstName} {parent.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{children.length} enfant{children.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setEditingParent(parent)}
                    className="p-1 text-blue-600 hover:text-blue-900 rounded"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteParent(parent.id)}
                    className="p-1 text-red-600 hover:text-red-900 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {parent.email}
                </div>
                
                {parent.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {parent.phone}
                  </div>
                )}
                
                {parent.address && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="truncate">{parent.address}</span>
                  </div>
                )}
              </div>

              {children.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Enfants:</p>
                  <div className="space-y-1">
                    {children.map(child => (
                      <div key={child.id} className="flex items-center text-sm text-gray-600">
                        <User className="h-3 w-3 mr-2" />
                        {child.firstName} {child.lastName} ({child.grade})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Inscrit le:</span>
                  <span className="text-gray-900">
                    {new Date(parent.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600">Paiement préféré:</span>
                  <span className="text-gray-900 capitalize">
                    {parent.preferredPaymentMethod === 'card' ? 'Carte' :
                     parent.preferredPaymentMethod === 'bank_transfer' ? 'Virement' : 'PayPal'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedParent(parent)}
                className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Voir les détails
              </button>
            </div>
          );
        })}
      </div>

      {filteredParents.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500">Aucun parent trouvé</p>
        </div>
      )}

      {/* Add/Edit Parent Modal */}
      {(showAddForm || editingParent) && (
        <ParentForm
          parent={editingParent}
          students={appState.students}
          onSave={editingParent ? handleEditParent : handleAddParent}
          onCancel={() => {
            setShowAddForm(false);
            setEditingParent(null);
          }}
        />
      )}

      {/* Parent Detail Modal */}
      {selectedParent && (
        <ParentDetail
          parent={selectedParent}
          children={getParentChildren(selectedParent.id)}
          invoices={appState.invoices.filter(inv => inv.parentId === selectedParent.id)}
          onClose={() => setSelectedParent(null)}
        />
      )}
    </div>
  );
};

interface ParentFormProps {
  parent?: Parent | null;
  students: any[];
  onSave: (parent: Parent | Partial<Parent>) => void;
  onCancel: () => void;
}

const ParentForm: React.FC<ParentFormProps> = ({ parent, students, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: parent?.firstName || '',
    lastName: parent?.lastName || '',
    email: parent?.email || '',
    phone: parent?.phone || '',
    address: parent?.address || '',
    children: parent?.children || [],
    preferredPaymentMethod: parent?.preferredPaymentMethod || 'card',
    notifications: parent?.notifications || {
      email: true,
      sms: true,
      push: true,
      courseReminders: true,
      paymentReminders: true,
      gradeUpdates: true
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parentData = {
      ...formData,
      ...(parent && { id: parent.id, role: parent.role, createdAt: parent.createdAt, isActive: parent.isActive })
    };

    onSave(parentData);
  };

  const handleChildChange = (studentId: string) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.includes(studentId)
        ? prev.children.filter(id => id !== studentId)
        : [...prev.children, studentId]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {parent ? 'Modifier le parent' : 'Ajouter un parent'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mode de paiement préféré
              </label>
              <select
                value={formData.preferredPaymentMethod}
                onChange={(e) => setFormData({...formData, preferredPaymentMethod: e.target.value as any})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="card">Carte bancaire</option>
                <option value="bank_transfer">Virement bancaire</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enfants
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {students.map(student => (
                <label key={student.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.children.includes(student.id)}
                    onChange={() => handleChildChange(student.id)}
                    className="mr-2"
                  />
                  <span className="text-sm">{student.firstName} {student.lastName}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Préférences de notification
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.notifications.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    notifications: { ...formData.notifications, email: e.target.checked }
                  })}
                  className="mr-2"
                />
                <span className="text-sm">Notifications par email</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.notifications.sms}
                  onChange={(e) => setFormData({
                    ...formData,
                    notifications: { ...formData.notifications, sms: e.target.checked }
                  })}
                  className="mr-2"
                />
                <span className="text-sm">Notifications par SMS</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.notifications.courseReminders}
                  onChange={(e) => setFormData({
                    ...formData,
                    notifications: { ...formData.notifications, courseReminders: e.target.checked }
                  })}
                  className="mr-2"
                />
                <span className="text-sm">Rappels de cours</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.notifications.gradeUpdates}
                  onChange={(e) => setFormData({
                    ...formData,
                    notifications: { ...formData.notifications, gradeUpdates: e.target.checked }
                  })}
                  className="mr-2"
                />
                <span className="text-sm">Mises à jour des notes</span>
              </label>
            </div>
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
              {parent ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ParentDetailProps {
  parent: Parent;
  children: any[];
  invoices: any[];
  onClose: () => void;
}

const ParentDetail: React.FC<ParentDetailProps> = ({ parent, children, invoices, onClose }) => {
  const totalPaid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const totalPending = invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Détails de {parent.firstName} {parent.lastName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Informations de contact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{parent.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Téléphone</p>
                <p className="font-medium">{parent.phone || 'Non renseigné'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Adresse</p>
                <p className="font-medium">{parent.address || 'Non renseignée'}</p>
              </div>
            </div>
          </div>

          {/* Children */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Enfants ({children.length})</h3>
            <div className="space-y-2">
              {children.map(child => (
                <div key={child.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{child.firstName} {child.lastName}</p>
                    <p className="text-sm text-gray-600">{child.grade} - {child.subjects.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Summary */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Résumé financier</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Total payé</p>
                <p className="text-xl font-bold text-green-900">{totalPaid}€</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600">En attente</p>
                <p className="text-xl font-bold text-yellow-900">{totalPending}€</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Factures</p>
                <p className="text-xl font-bold text-blue-900">{invoices.length}</p>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Préférences de notification</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${parent.notifications.email ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm">Email</span>
              </div>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${parent.notifications.sms ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm">SMS</span>
              </div>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${parent.notifications.courseReminders ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm">Rappels de cours</span>
              </div>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${parent.notifications.gradeUpdates ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm">Mises à jour des notes</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentManagement;