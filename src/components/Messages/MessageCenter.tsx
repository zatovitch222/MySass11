import React, { useState } from 'react';
import { Send, Search, Paperclip, Star, Archive, Trash2, Reply } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Message } from '../../types';

const MessageCenter: React.FC = () => {
  const { appState, updateAppState, user } = useAuth();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'sent'>('all');

  const messages = appState.messages.filter(msg => 
    msg.senderId === user?.id || msg.receiverId === user?.id
  );

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !msg.read && msg.receiverId === user?.id) ||
                         (filter === 'sent' && msg.senderId === user?.id);
    
    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = (messageData: Partial<Message>) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user?.id || '',
      receiverId: messageData.receiverId || '',
      subject: messageData.subject || '',
      content: messageData.content || '',
      read: false,
      createdAt: new Date(),
      threadId: messageData.threadId
    };

    updateAppState({
      messages: [...appState.messages, newMessage]
    });
    setShowCompose(false);
  };

  const handleMarkAsRead = (messageId: string) => {
    updateAppState({
      messages: appState.messages.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      updateAppState({
        messages: appState.messages.filter(msg => msg.id !== messageId)
      });
      setSelectedMessage(null);
    }
  };

  const getSenderName = (senderId: string) => {
    const sender = [...appState.parents, ...appState.teachers].find(u => u.id === senderId);
    return sender ? `${sender.firstName} ${sender.lastName}` : 'Utilisateur inconnu';
  };

  const getRecipientOptions = () => {
    if (user?.role === 'teacher') {
      return appState.parents.map(parent => ({
        id: parent.id,
        name: `${parent.firstName} ${parent.lastName}`,
        type: 'Parent'
      }));
    } else {
      return appState.teachers.map(teacher => ({
        id: teacher.id,
        name: `${teacher.firstName} ${teacher.lastName}`,
        type: 'Professeur'
      }));
    }
  };

  return (
    <div className="h-full flex">
      {/* Messages List */}
      <div className="w-1/3 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <button
              onClick={() => setShowCompose(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Nouveau
            </button>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs rounded-full ${
                filter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 text-xs rounded-full ${
                filter === 'unread' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Non lus
            </button>
            <button
              onClick={() => setFilter('sent')}
              className={`px-3 py-1 text-xs rounded-full ${
                filter === 'sent' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Envoyés
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto h-full">
          {filteredMessages.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Aucun message trouvé
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                onClick={() => {
                  setSelectedMessage(message);
                  if (!message.read && message.receiverId === user?.id) {
                    handleMarkAsRead(message.id);
                  }
                }}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedMessage?.id === message.id ? 'bg-blue-50 border-blue-200' : ''
                } ${
                  !message.read && message.receiverId === user?.id ? 'bg-blue-25' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className={`text-sm ${
                        !message.read && message.receiverId === user?.id ? 'font-semibold' : 'font-medium'
                      } text-gray-900 truncate`}>
                        {message.senderId === user?.id ? 'À: ' : 'De: '}
                        {getSenderName(message.senderId === user?.id ? message.receiverId : message.senderId)}
                      </p>
                      {!message.read && message.receiverId === user?.id && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-900 font-medium truncate mt-1">
                      {message.subject}
                    </p>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {message.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(message.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Detail */}
      <div className="flex-1 bg-white">
        {selectedMessage ? (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedMessage.subject}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedMessage.senderId === user?.id ? 'À: ' : 'De: '}
                    {getSenderName(selectedMessage.senderId === user?.id ? selectedMessage.receiverId : selectedMessage.senderId)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(selectedMessage.createdAt).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowCompose(true)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    title="Répondre"
                  >
                    <Reply className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="prose max-w-none">
                <p className="text-gray-900 whitespace-pre-wrap">
                  {selectedMessage.content}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Send className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Sélectionnez un message pour le lire</p>
            </div>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <ComposeMessage
          recipients={getRecipientOptions()}
          replyTo={selectedMessage}
          onSend={handleSendMessage}
          onCancel={() => setShowCompose(false)}
        />
      )}
    </div>
  );
};

interface ComposeMessageProps {
  recipients: { id: string; name: string; type: string }[];
  replyTo?: Message | null;
  onSend: (message: Partial<Message>) => void;
  onCancel: () => void;
}

const ComposeMessage: React.FC<ComposeMessageProps> = ({ recipients, replyTo, onSend, onCancel }) => {
  const [formData, setFormData] = useState({
    receiverId: replyTo?.senderId || '',
    subject: replyTo ? `Re: ${replyTo.subject}` : '',
    content: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend({
      ...formData,
      threadId: replyTo?.threadId || replyTo?.id
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {replyTo ? 'Répondre' : 'Nouveau message'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destinataire
            </label>
            <select
              value={formData.receiverId}
              onChange={(e) => setFormData({...formData, receiverId: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={!!replyTo}
            >
              <option value="">Sélectionner un destinataire</option>
              {recipients.map(recipient => (
                <option key={recipient.id} value={recipient.id}>
                  {recipient.name} ({recipient.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sujet
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              rows={8}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tapez votre message..."
              required
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Envoyer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageCenter;