export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'teacher' | 'parent' | 'admin';
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface Teacher extends User {
  role: 'teacher';
  subjects: string[];
  hourlyRate: number;
  availableHours: TimeSlot[];
  bio?: string;
  phone?: string;
  address?: string;
  subscriptionPlan: 'free' | 'basic' | 'premium';
  subscriptionExpiry?: Date;
  stripeCustomerId?: string;
  totalRevenue: number;
  totalCourses: number;
  rating: number;
  certifications: string[];
  experience: number; // years
}

export interface Parent extends User {
  role: 'parent';
  phone?: string;
  address?: string;
  children: string[]; // student IDs
  preferredPaymentMethod?: 'card' | 'bank_transfer' | 'paypal';
  notifications: NotificationSettings;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  grade: string;
  subjects: string[];
  parentIds: string[];
  teacherId: string;
  notes?: string;
  createdAt: Date;
  avatar?: string;
  academicLevel: 'beginner' | 'intermediate' | 'advanced';
  learningGoals: string[];
  specialNeeds?: string;
  emergencyContact?: EmergencyContact;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  date: Date;
  duration: number; // in minutes
  subject: string;
  studentIds: string[];
  teacherId: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  price: number;
  location?: string;
  notes?: string;
  createdAt: Date;
  recurringPattern?: RecurringPattern;
  materials?: CourseMaterial[];
  homework?: Homework[];
  attendance: AttendanceRecord[];
}

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  teacherId: string;
  subject: string;
  grade: number;
  maxGrade: number;
  comment?: string;
  date: Date;
  type: 'quiz' | 'exam' | 'homework' | 'participation';
  weight: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  teacherId: string;
  parentId: string;
  studentId: string;
  courseIds: string[];
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  paidDate?: Date;
  createdAt: Date;
  paymentMethod?: string;
  stripePaymentIntentId?: string;
  items: InvoiceItem[];
  taxes: number;
  discount?: number;
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'course_reminder' | 'payment_due' | 'grade_added' | 'course_cancelled' | 'message' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  subject: string;
  content: string;
  read: boolean;
  createdAt: Date;
  attachments?: MessageAttachment[];
  threadId?: string;
}

export interface Report {
  id: string;
  studentId: string;
  teacherId: string;
  period: {
    start: Date;
    end: Date;
  };
  type: 'progress' | 'attendance' | 'behavior' | 'academic';
  content: ReportSection[];
  createdAt: Date;
  sharedWithParents: boolean;
}

export interface Subscription {
  id: string;
  teacherId: string;
  plan: 'free' | 'basic' | 'premium';
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  stripeSubscriptionId?: string;
  features: SubscriptionFeature[];
}

export interface Analytics {
  teacherId: string;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    totalRevenue: number;
    totalCourses: number;
    totalStudents: number;
    averageRating: number;
    completionRate: number;
    noShowRate: number;
    paymentRate: number;
  };
  trends: AnalyticsTrend[];
}

// Supporting interfaces
export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  courseReminders: boolean;
  paymentReminders: boolean;
  gradeUpdates: boolean;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface RecurringPattern {
  frequency: 'weekly' | 'biweekly' | 'monthly';
  daysOfWeek: number[];
  endDate?: Date;
  occurrences?: number;
}

export interface CourseMaterial {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'audio' | 'link' | 'image';
  url: string;
  description?: string;
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  submittedAt?: Date;
  grade?: number;
  feedback?: string;
}

export interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface ReportSection {
  title: string;
  content: string;
  grade?: number;
  recommendations?: string[];
}

export interface SubscriptionFeature {
  name: string;
  enabled: boolean;
  limit?: number;
}

export interface AnalyticsTrend {
  metric: string;
  data: { date: Date; value: number }[];
}

export interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  students: Student[];
  courses: Course[];
  grades: Grade[];
  invoices: Invoice[];
  notifications: Notification[];
  parents: Parent[];
  teachers: Teacher[];
  messages: Message[];
  reports: Report[];
  subscriptions: Subscription[];
  analytics: Analytics[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'course' | 'meeting' | 'break';
  color: string;
  course?: Course;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4: string;
  brand?: string;
  isDefault: boolean;
}

export interface Settings {
  general: {
    timezone: string;
    language: string;
    dateFormat: string;
    currency: string;
  };
  notifications: NotificationSettings;
  privacy: {
    profileVisibility: 'public' | 'private';
    allowMessages: boolean;
    showOnlineStatus: boolean;
  };
  billing: {
    autoPayment: boolean;
    invoiceEmail: string;
    taxId?: string;
  };
}