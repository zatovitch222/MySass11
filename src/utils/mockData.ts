import { AppState, Student, Course, Grade, Invoice, Notification, Parent, Teacher, Message, Report, Subscription, Analytics } from '../types';

export const mockData: AppState = {
  currentUser: null,
  isAuthenticated: false,
  students: [
    {
      id: 'student-1',
      firstName: 'Alice',
      lastName: 'Martin',
      dateOfBirth: new Date('2010-05-15'),
      grade: '4ème',
      subjects: ['Mathématiques', 'Physique'],
      parentIds: ['parent-1'],
      teacherId: 'teacher-1',
      notes: 'Excellente élève, très motivée',
      createdAt: new Date('2024-01-15'),
      academicLevel: 'advanced',
      learningGoals: ['Améliorer en algèbre', 'Préparer le brevet'],
      emergencyContact: {
        name: 'Marie Martin',
        relationship: 'Mère',
        phone: '+33123456789',
        email: 'marie.martin@email.com'
      }
    },
    {
      id: 'student-2',
      firstName: 'Lucas',
      lastName: 'Dubois',
      dateOfBirth: new Date('2011-08-22'),
      grade: '3ème',
      subjects: ['Français', 'Histoire'],
      parentIds: ['parent-2'],
      teacherId: 'teacher-1',
      notes: 'Besoin de plus de confiance en soi',
      createdAt: new Date('2024-02-01'),
      academicLevel: 'intermediate',
      learningGoals: ['Améliorer l\'expression écrite', 'Gagner en confiance'],
      specialNeeds: 'Dyslexie légère'
    },
    {
      id: 'student-3',
      firstName: 'Emma',
      lastName: 'Bernard',
      dateOfBirth: new Date('2009-12-10'),
      grade: '2nde',
      subjects: ['Mathématiques', 'Chimie'],
      parentIds: ['parent-3'],
      teacherId: 'teacher-1',
      createdAt: new Date('2024-01-20'),
      academicLevel: 'intermediate',
      learningGoals: ['Préparer le bac scientifique', 'Améliorer en chimie organique']
    }
  ],
  courses: [
    {
      id: 'course-1',
      title: 'Mathématiques - Algèbre',
      description: 'Révision des équations du second degré',
      date: new Date('2024-12-20T14:00:00'),
      duration: 60,
      subject: 'Mathématiques',
      studentIds: ['student-1', 'student-3'],
      teacherId: 'teacher-1',
      status: 'scheduled',
      price: 30,
      location: 'Salle 1',
      createdAt: new Date('2024-12-15'),
      materials: [
        {
          id: 'mat-1',
          name: 'Exercices d\'algèbre',
          type: 'pdf',
          url: '/materials/algebra-exercises.pdf',
          description: 'Feuille d\'exercices sur les équations'
        }
      ],
      homework: [
        {
          id: 'hw-1',
          title: 'Exercices 1 à 10',
          description: 'Résoudre les équations du second degré',
          dueDate: new Date('2024-12-22'),
          completed: false
        }
      ],
      attendance: [
        { studentId: 'student-1', status: 'present' },
        { studentId: 'student-3', status: 'present' }
      ]
    },
    {
      id: 'course-2',
      title: 'Physique - Mécanique',
      description: 'Les lois de Newton',
      date: new Date('2024-12-19T16:00:00'),
      duration: 90,
      subject: 'Physique',
      studentIds: ['student-1'],
      teacherId: 'teacher-1',
      status: 'completed',
      price: 45,
      notes: 'Très bonne compréhension',
      createdAt: new Date('2024-12-10'),
      attendance: [
        { studentId: 'student-1', status: 'present', notes: 'Très participatif' }
      ]
    },
    {
      id: 'course-3',
      title: 'Français - Expression écrite',
      description: 'Rédaction de dissertations',
      date: new Date('2024-12-21T10:00:00'),
      duration: 60,
      subject: 'Français',
      studentIds: ['student-2'],
      teacherId: 'teacher-1',
      status: 'scheduled',
      price: 30,
      createdAt: new Date('2024-12-16'),
      recurringPattern: {
        frequency: 'weekly',
        daysOfWeek: [6], // Saturday
        endDate: new Date('2025-06-21')
      },
      attendance: []
    }
  ],
  grades: [
    {
      id: 'grade-1',
      studentId: 'student-1',
      courseId: 'course-2',
      teacherId: 'teacher-1',
      subject: 'Physique',
      grade: 17,
      maxGrade: 20,
      comment: 'Excellent travail, continue comme ça !',
      date: new Date('2024-12-19'),
      type: 'exam',
      weight: 1.0
    },
    {
      id: 'grade-2',
      studentId: 'student-2',
      courseId: 'course-3',
      teacherId: 'teacher-1',
      subject: 'Français',
      grade: 14,
      maxGrade: 20,
      comment: 'Bonne amélioration, quelques points à revoir',
      date: new Date('2024-12-18'),
      type: 'homework',
      weight: 0.5
    },
    {
      id: 'grade-3',
      studentId: 'student-3',
      courseId: 'course-1',
      teacherId: 'teacher-1',
      subject: 'Mathématiques',
      grade: 16,
      maxGrade: 20,
      comment: 'Très bonne maîtrise des concepts',
      date: new Date('2024-12-17'),
      type: 'quiz',
      weight: 0.3
    }
  ],
  invoices: [
    {
      id: 'invoice-1',
      invoiceNumber: 'INV-2024-001',
      teacherId: 'teacher-1',
      parentId: 'parent-1',
      studentId: 'student-1',
      courseIds: ['course-1', 'course-2'],
      amount: 75,
      currency: 'EUR',
      status: 'sent',
      dueDate: new Date('2024-12-30'),
      createdAt: new Date('2024-12-15'),
      items: [
        { description: 'Cours de Mathématiques', quantity: 1, unitPrice: 30, total: 30 },
        { description: 'Cours de Physique', quantity: 1, unitPrice: 45, total: 45 }
      ],
      taxes: 0,
      notes: 'Paiement par virement bancaire accepté'
    },
    {
      id: 'invoice-2',
      invoiceNumber: 'INV-2024-002',
      teacherId: 'teacher-1',
      parentId: 'parent-2',
      studentId: 'student-2',
      courseIds: ['course-3'],
      amount: 30,
      currency: 'EUR',
      status: 'paid',
      dueDate: new Date('2024-12-25'),
      paidDate: new Date('2024-12-20'),
      createdAt: new Date('2024-12-16'),
      paymentMethod: 'card',
      items: [
        { description: 'Cours de Français', quantity: 1, unitPrice: 30, total: 30 }
      ],
      taxes: 0
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      userId: 'teacher-1',
      type: 'course_reminder',
      title: 'Cours dans 1 heure',
      message: 'Mathématiques avec Alice Martin et Emma Bernard',
      read: false,
      createdAt: new Date('2024-12-20T13:00:00'),
      priority: 'high'
    },
    {
      id: 'notif-2',
      userId: 'parent-1',
      type: 'grade_added',
      title: 'Nouvelle note disponible',
      message: 'Alice a reçu une note de 17/20 en Physique',
      read: false,
      createdAt: new Date('2024-12-19T18:00:00'),
      priority: 'medium',
      actionUrl: '/grades'
    },
    {
      id: 'notif-3',
      userId: 'teacher-1',
      type: 'payment_due',
      title: 'Facture en attente',
      message: 'La facture #INV-2024-001 est due dans 10 jours',
      read: true,
      createdAt: new Date('2024-12-18T09:00:00'),
      priority: 'medium',
      actionUrl: '/invoices'
    }
  ],
  parents: [
    {
      id: 'parent-1',
      email: 'martin@email.com',
      firstName: 'Jean',
      lastName: 'Martin',
      role: 'parent',
      phone: '+33123456789',
      address: '123 rue de la Paix, 75001 Paris',
      children: ['student-1'],
      createdAt: new Date('2024-01-15'),
      isActive: true,
      preferredPaymentMethod: 'card',
      notifications: {
        email: true,
        sms: true,
        push: true,
        courseReminders: true,
        paymentReminders: true,
        gradeUpdates: true
      }
    },
    {
      id: 'parent-2',
      email: 'dubois@email.com',
      firstName: 'Sophie',
      lastName: 'Dubois',
      role: 'parent',
      phone: '+33987654321',
      address: '456 avenue des Champs, 75008 Paris',
      children: ['student-2'],
      createdAt: new Date('2024-02-01'),
      isActive: true,
      preferredPaymentMethod: 'bank_transfer',
      notifications: {
        email: true,
        sms: false,
        push: true,
        courseReminders: true,
        paymentReminders: true,
        gradeUpdates: true
      }
    },
    {
      id: 'parent-3',
      email: 'bernard@email.com',
      firstName: 'Pierre',
      lastName: 'Bernard',
      role: 'parent',
      phone: '+33555666777',
      address: '789 boulevard Saint-Germain, 75007 Paris',
      children: ['student-3'],
      createdAt: new Date('2024-01-20'),
      isActive: true,
      preferredPaymentMethod: 'card',
      notifications: {
        email: true,
        sms: true,
        push: false,
        courseReminders: true,
        paymentReminders: true,
        gradeUpdates: true
      }
    }
  ],
  teachers: [
    {
      id: 'teacher-1',
      email: 'marie.dupont@email.com',
      firstName: 'Marie',
      lastName: 'Dupont',
      role: 'teacher',
      subjects: ['Mathématiques', 'Physique', 'Chimie'],
      hourlyRate: 35,
      availableHours: [
        { day: 'Monday', startTime: '14:00', endTime: '18:00' },
        { day: 'Tuesday', startTime: '14:00', endTime: '18:00' },
        { day: 'Wednesday', startTime: '14:00', endTime: '18:00' },
        { day: 'Thursday', startTime: '14:00', endTime: '18:00' },
        { day: 'Friday', startTime: '14:00', endTime: '18:00' },
        { day: 'Saturday', startTime: '09:00', endTime: '17:00' }
      ],
      bio: 'Professeure de mathématiques et sciences avec 10 ans d\'expérience. Spécialisée dans l\'accompagnement des élèves en difficulté.',
      phone: '+33123456789',
      address: '15 rue de la République, 75011 Paris',
      subscriptionPlan: 'premium',
      subscriptionExpiry: new Date('2025-12-31'),
      totalRevenue: 2450,
      totalCourses: 87,
      rating: 4.8,
      certifications: ['CAPES Mathématiques', 'Formation pédagogie différenciée'],
      experience: 10,
      createdAt: new Date('2024-01-01'),
      isActive: true
    }
  ],
  messages: [
    {
      id: 'msg-1',
      senderId: 'parent-1',
      receiverId: 'teacher-1',
      subject: 'Question sur les devoirs d\'Alice',
      content: 'Bonjour, Alice a des difficultés avec les exercices d\'algèbre. Pourriez-vous lui donner quelques conseils supplémentaires ?',
      read: false,
      createdAt: new Date('2024-12-19T10:30:00')
    },
    {
      id: 'msg-2',
      senderId: 'teacher-1',
      receiverId: 'parent-1',
      subject: 'Re: Question sur les devoirs d\'Alice',
      content: 'Bonjour, je vais préparer des exercices supplémentaires pour Alice. Elle progresse très bien, il faut juste qu\'elle continue à s\'entraîner.',
      read: true,
      createdAt: new Date('2024-12-19T14:15:00'),
      threadId: 'msg-1'
    }
  ],
  reports: [
    {
      id: 'report-1',
      studentId: 'student-1',
      teacherId: 'teacher-1',
      period: {
        start: new Date('2024-11-01'),
        end: new Date('2024-11-30')
      },
      type: 'progress',
      content: [
        {
          title: 'Mathématiques',
          content: 'Alice montre d\'excellents progrès en algèbre. Elle maîtrise bien les équations du premier degré.',
          grade: 17,
          recommendations: ['Continuer les exercices d\'entraînement', 'Aborder les équations du second degré']
        },
        {
          title: 'Physique',
          content: 'Très bonne compréhension des concepts de base. Participation active en cours.',
          grade: 16,
          recommendations: ['Approfondir la mécanique', 'Travailler les exercices d\'application']
        }
      ],
      createdAt: new Date('2024-12-01'),
      sharedWithParents: true
    }
  ],
  subscriptions: [
    {
      id: 'sub-1',
      teacherId: 'teacher-1',
      plan: 'premium',
      status: 'active',
      currentPeriodStart: new Date('2024-01-01'),
      currentPeriodEnd: new Date('2024-12-31'),
      features: [
        { name: 'Unlimited Students', enabled: true },
        { name: 'Advanced Analytics', enabled: true },
        { name: 'Custom Branding', enabled: true },
        { name: 'Priority Support', enabled: true }
      ]
    }
  ],
  analytics: [
    {
      teacherId: 'teacher-1',
      period: {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31')
      },
      metrics: {
        totalRevenue: 2450,
        totalCourses: 87,
        totalStudents: 12,
        averageRating: 4.8,
        completionRate: 0.95,
        noShowRate: 0.05,
        paymentRate: 0.98
      },
      trends: [
        {
          metric: 'revenue',
          data: [
            { date: new Date('2024-01-01'), value: 180 },
            { date: new Date('2024-02-01'), value: 220 },
            { date: new Date('2024-03-01'), value: 195 },
            { date: new Date('2024-04-01'), value: 240 },
            { date: new Date('2024-05-01'), value: 210 },
            { date: new Date('2024-06-01'), value: 185 }
          ]
        }
      ]
    }
  ]
};