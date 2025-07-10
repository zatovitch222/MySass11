import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AppState } from '../types';
import { mockData } from '../utils/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<boolean>;
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appState, setAppState] = useState<AppState>({
    currentUser: null,
    isAuthenticated: false,
    students: [],
    courses: [],
    grades: [],
    invoices: [],
    notifications: [],
    parents: []
  });

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
      loadUserData(userData);
    } else {
      // Initialize with mock data
      setAppState(mockData);
    }
  }, []);

  const loadUserData = (userData: User) => {
    // In a real app, this would fetch from API
    const filteredData = {
      ...mockData,
      currentUser: userData,
      isAuthenticated: true,
      students: userData.role === 'teacher' 
        ? mockData.students.filter(s => s.teacherId === userData.id)
        : mockData.students.filter(s => s.parentIds.includes(userData.id)),
      courses: userData.role === 'teacher'
        ? mockData.courses.filter(c => c.teacherId === userData.id)
        : mockData.courses.filter(c => {
          const userStudents = mockData.students.filter(s => s.parentIds.includes(userData.id));
          return c.studentIds.some(id => userStudents.some(s => s.id === id));
        }),
      grades: userData.role === 'teacher'
        ? mockData.grades.filter(g => g.teacherId === userData.id)
        : mockData.grades.filter(g => {
          const userStudents = mockData.students.filter(s => s.parentIds.includes(userData.id));
          return userStudents.some(s => s.id === g.studentId);
        }),
      invoices: userData.role === 'teacher'
        ? mockData.invoices.filter(i => i.teacherId === userData.id)
        : mockData.invoices.filter(i => i.parentId === userData.id)
    };
    setAppState(filteredData);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    const mockUser = mockData.students.find(s => s.teacherId === 'teacher-1') ? 
      { id: 'teacher-1', email, firstName: 'Marie', lastName: 'Dupont', role: 'teacher' as const, createdAt: new Date() } :
      { id: 'parent-1', email, firstName: 'Jean', lastName: 'Martin', role: 'parent' as const, createdAt: new Date() };
    
    if (email && password) {
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      loadUserData(mockUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    setAppState(mockData);
  };

  const register = async (userData: Partial<User>): Promise<boolean> => {
    // Mock registration
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      role: userData.role || 'teacher',
      createdAt: new Date()
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    loadUserData(newUser);
    return true;
  };

  const updateAppState = (updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      register,
      appState,
      updateAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};