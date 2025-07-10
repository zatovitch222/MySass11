import React, { useState } from 'react';
import { Plus, Eye, Send, Download, CreditCard, Filter, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Invoice } from '../../types';

const InvoiceManagement: React.FC = () => {
  const { appState, updateAppState, user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = appState.invoices.filter(invoice => {
    const matchesStatus = selectedStatus === '' || invoice.status === selectedStatus;
    return matchesStatus;
  });

  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = filteredInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = filteredInvoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = filteredInvoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);

  const handleCreateInvoice = (invoiceData: Partial<Invoice>) => {
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(appState.invoices.length + 1).padStart(3, '0')}`,
      teacherId: user?.id || '',
      parentId: invoiceData.parentId || '',
      studentId: invoiceData.studentId || '',
      courseIds: invoiceData.courseIds || [],
      amount: invoiceData.amount || 0,
      currency: 'EUR',
      status: 'draft',
      dueDate: invoiceData.dueDate || new Date(),
      createdAt: new Date(),
      items: invoiceData.items || [],
      taxes: invoiceData.taxes || 0,
      discount: invoiceData.discount || 0,
      notes: invoiceData.notes || ''
    };

    updateAppState({
      invoices: [...appState.invoices, newInvoice]
    });
    setShowAddForm(false);
  };

  const handleSendInvoice = (invoiceId: string) => {
    updateAppState({
      invoices: appState.invoices.map(inv => 
        inv.id === invoiceId ? { ...inv, status: 'sent' as const } : inv
      )
    });
  };

  const handleMarkPaid = (invoiceId: string) => {
    updateAppState({
      invoices: appState.invoices.map(inv => 
        inv.id === invoiceId ? { 
          ...inv, 
          status: 'paid' as const, 
          paidDate: new Date(),
          paymentMethod: 'manual'
        } : inv
      )
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payée';
      case 'sent':
        return 'Envoyée';
      case 'overdue':
        return 'En retard';
      case 'cancelled':
        return 'Annulée';
      default:
        return 'Brouillon';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des factures</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nouvelle facture</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{totalAmount}€</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Payées</p>
              <p className="text-2xl font-bold text-green-600">{paidAmount}€</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-blue-600">{pendingAmount}€</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En retard</p>
              <p className="text-2xl font-bold text-red-600">{overdueAmount}€</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <CreditCard className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les statuts</option>
            <option value="draft">Brouillon</option>
            <option value="sent">Envoyée</option>
            <option value="paid">Payée</option>
            <option value="overdue">En retard</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Factures ({filteredInvoices.length})
          </h2>
        </div>
        
        {filteredInvoices.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Aucune facture trouvée
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numéro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'échéance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => {
                  const parent = appState.parents.find(p => p.id === invoice.parentId);
                  const student = appState.students.find(s => s.id === invoice.studentId);
                  
                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {invoice.invoiceNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(invoice.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {parent?.firstName} {parent?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Pour: {student?.firstName} {student?.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {invoice.amount}€
                        </div>
                        {invoice.discount && (
                          <div className="text-sm text-green-600">
                            Remise: -{invoice.discount}€
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                          {getStatusText(invoice.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                        {invoice.paidDate && (
                          <div className="text-xs text-green-600">
                            Payée le {new Date(invoice.paidDate).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedInvoice(invoice)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Voir"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {invoice.status === 'draft' && (
                            <button
                              onClick={() => handleSendInvoice(invoice.id)}
                              className="text-green-600 hover:text-green-900 p-1 rounded"
                              title="Envoyer"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          )}
                          
                          {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                            <button
                              onClick={() => handleMarkPaid(invoice.id)}
                              className="text-purple-600 hover:text-purple-900 p-1 rounded"
                              title="Marquer comme payée"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          
                          <button
                            className="text-gray-600 hover:text-gray-900 p-1 rounded"
                            title="Télécharger PDF"
                          >
                            <Download className="h-4 w-4" />
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

      {/* Add Invoice Modal */}
      {showAddForm && (
        <InvoiceForm
          students={appState.students}
          parents={appState.parents}
          courses={appState.courses}
          onSave={handleCreateInvoice}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <InvoiceDetail
          invoice={selectedInvoice}
          parent={appState.parents.find(p => p.id === selectedInvoice.parentId)}
          student={appState.students.find(s => s.id === selectedInvoice.studentId)}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

interface InvoiceFormProps {
  students: any[];
  parents: any[];
  courses: any[];
  onSave: (invoice: Partial<Invoice>) => void;
  onCancel: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ students, parents, courses, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    parentId: '',
    studentId: '',
    courseIds: [] as string[],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    discount: 0,
    notes: ''
  });

  const [items, setItems] = useState([
    { description: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);

  const selectedStudent = students.find(s => s.id === formData.studentId);
  const availableCourses = courses.filter(c => 
    c.studentIds.includes(formData.studentId) && c.status === 'completed'
  );

  const calculateTotal = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    return subtotal - formData.discount;
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const invoiceData = {
      ...formData,
      dueDate: new Date(formData.dueDate),
      amount: calculateTotal(),
      items: items.filter(item => item.description && item.unitPrice > 0),
      taxes: 0
    };

    onSave(invoiceData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Créer une facture
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent
              </label>
              <select
                value={formData.parentId}
                onChange={(e) => setFormData({...formData, parentId: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionner un parent</option>
                {parents.map(parent => (
                  <option key={parent.id} value={parent.id}>
                    {parent.firstName} {parent.lastName}
                  </option>
                ))}
              </select>
            </div>
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
                {students.filter(s => s.parentIds.includes(formData.parentId)).map(student => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date d'échéance
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Articles
              </label>
              <button
                type="button"
                onClick={addItem}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                + Ajouter un article
              </button>
            </div>
            
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Qté"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      min="1"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Prix"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm font-medium">{item.total.toFixed(2)}€</span>
                  </div>
                  <div className="col-span-1">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remise (€)
              </label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value) || 0})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex items-end">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">{calculateTotal().toFixed(2)}€</p>
              </div>
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
              placeholder="Notes ou conditions de paiement..."
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
              Créer la facture
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface InvoiceDetailProps {
  invoice: Invoice;
  parent?: any;
  student?: any;
  onClose: () => void;
}

const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ invoice, parent, student, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Facture {invoice.invoiceNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Invoice Header */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Facturé à:</h3>
              <p className="text-gray-600">
                {parent?.firstName} {parent?.lastName}<br />
                {parent?.email}<br />
                {parent?.phone}<br />
                {parent?.address}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Date: {new Date(invoice.createdAt).toLocaleDateString('fr-FR')}</p>
              <p className="text-sm text-gray-600">Échéance: {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</p>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {invoice.status === 'paid' ? 'Payée' :
                 invoice.status === 'sent' ? 'Envoyée' :
                 invoice.status === 'overdue' ? 'En retard' : 'Brouillon'}
              </span>
            </div>
          </div>

          {/* Invoice Items */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Détails</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Qté</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Prix unit.</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-center">{item.quantity}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">{item.unitPrice.toFixed(2)}€</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right font-medium">{item.total.toFixed(2)}€</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Total */}
          <div className="border-t pt-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total:</span>
                  <span className="font-medium">{(invoice.amount + (invoice.discount || 0)).toFixed(2)}€</span>
                </div>
                {invoice.discount && invoice.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Remise:</span>
                    <span>-{invoice.discount.toFixed(2)}€</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>{invoice.amount.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-600 text-sm">{invoice.notes}</p>
            </div>
          )}

          {/* Payment Info */}
          {invoice.paidDate && (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 font-medium">
                Facture payée le {new Date(invoice.paidDate).toLocaleDateString('fr-FR')}
                {invoice.paymentMethod && ` par ${invoice.paymentMethod}`}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Fermer
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Télécharger PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceManagement;