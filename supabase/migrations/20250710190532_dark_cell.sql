/*
  # Schéma initial pour EduManage Pro

  1. Tables principales
    - `users` - Tous les utilisateurs (admin, professeurs, élèves, parents)
    - `students` - Informations spécifiques aux élèves
    - `teachers` - Informations spécifiques aux professeurs
    - `parents` - Informations spécifiques aux parents
    - `groups` - Groupes d'élèves
    - `courses` - Cours individuels ou en groupe
    - `course_materials` - Supports de cours
    - `grades` - Notes des élèves
    - `attendance` - Présences aux cours

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques selon les rôles
    - Seul l'admin peut créer des utilisateurs

  3. Compte admin par défaut
    - Email: admin@edumanage.com
    - Mot de passe: admin123
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (profils utilisateurs)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'parent')),
  phone text,
  address text,
  avatar_url text,
  can_change_password boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  subjects text[] DEFAULT '{}',
  hourly_rate decimal(10,2),
  bio text,
  experience_years integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  level text NOT NULL,
  teacher_id uuid REFERENCES teachers(id),
  parent_id uuid REFERENCES users(id),
  date_of_birth date,
  notes text,
  subjects text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Parents table
CREATE TABLE IF NOT EXISTS parents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  children_ids uuid[] DEFAULT '{}',
  emergency_contact jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  student_ids uuid[] DEFAULT '{}',
  subject text NOT NULL,
  level text NOT NULL,
  description text,
  max_students integer DEFAULT 10,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  date timestamptz NOT NULL,
  duration integer NOT NULL, -- en minutes
  subject text NOT NULL,
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  group_id uuid REFERENCES groups(id),
  student_id uuid REFERENCES students(id),
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  location text,
  notes text,
  homework text,
  price decimal(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT course_target CHECK (
    (group_id IS NOT NULL AND student_id IS NULL) OR 
    (group_id IS NULL AND student_id IS NOT NULL)
  )
);

-- Course materials table
CREATE TABLE IF NOT EXISTS course_materials (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id),
  group_id uuid REFERENCES groups(id),
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Grades table
CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  subject text NOT NULL,
  grade decimal(5,2) NOT NULL,
  max_grade decimal(5,2) NOT NULL DEFAULT 20,
  coefficient decimal(3,2) DEFAULT 1.0,
  comment text,
  date date NOT NULL,
  type text DEFAULT 'quiz' CHECK (type IN ('quiz', 'exam', 'homework', 'participation')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, course_id)
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Admins can manage all users" ON users
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "Users can read their own profile" ON users
  FOR SELECT TO authenticated
  USING (auth_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE TO authenticated
  USING (auth_id = auth.uid())
  WITH CHECK (auth_id = auth.uid());

-- RLS Policies for teachers table
CREATE POLICY "Admins and teachers can read teachers" ON teachers
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() 
      AND u.role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Admins can manage teachers" ON teachers
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "Teachers can update their own profile" ON teachers
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.id = teachers.user_id
    )
  );

-- RLS Policies for students table
CREATE POLICY "Admins and teachers can read students" ON students
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() 
      AND u.role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Students can read their own data" ON students
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.id = students.user_id
    )
  );

CREATE POLICY "Parents can read their children data" ON students
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() 
      AND u.role = 'parent' 
      AND u.id = students.parent_id
    )
  );

CREATE POLICY "Admins can manage students" ON students
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.role = 'admin'
    )
  );

-- RLS Policies for parents table
CREATE POLICY "Admins can manage parents" ON parents
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "Parents can read their own data" ON parents
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.id = parents.user_id
    )
  );

-- RLS Policies for groups table
CREATE POLICY "Teachers can manage their groups" ON groups
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      JOIN teachers t ON u.id = t.user_id
      WHERE u.auth_id = auth.uid() AND t.id = groups.teacher_id
    )
  );

CREATE POLICY "Students can read their groups" ON groups
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      JOIN students s ON u.id = s.user_id
      WHERE u.auth_id = auth.uid() AND s.id = ANY(groups.student_ids)
    )
  );

-- RLS Policies for courses table
CREATE POLICY "Teachers can manage their courses" ON courses
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      JOIN teachers t ON u.id = t.user_id
      WHERE u.auth_id = auth.uid() AND t.id = courses.teacher_id
    )
  );

CREATE POLICY "Students can read their courses" ON courses
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      JOIN students s ON u.id = s.user_id
      WHERE u.auth_id = auth.uid() 
      AND (s.id = courses.student_id OR s.id = ANY(
        SELECT unnest(g.student_ids) FROM groups g WHERE g.id = courses.group_id
      ))
    )
  );

-- RLS Policies for course_materials table
CREATE POLICY "Teachers can manage their materials" ON course_materials
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      JOIN teachers t ON u.id = t.user_id
      WHERE u.auth_id = auth.uid() AND t.id = course_materials.teacher_id
    )
  );

CREATE POLICY "Students can read course materials" ON course_materials
  FOR SELECT TO authenticated
  USING (
    course_materials.is_public = true OR
    EXISTS (
      SELECT 1 FROM users u 
      JOIN students s ON u.id = s.user_id
      WHERE u.auth_id = auth.uid() 
      AND (
        s.id = ANY(
          SELECT unnest(g.student_ids) FROM groups g WHERE g.id = course_materials.group_id
        ) OR
        EXISTS (
          SELECT 1 FROM courses c 
          WHERE c.id = course_materials.course_id 
          AND (c.student_id = s.id OR s.id = ANY(
            SELECT unnest(g.student_ids) FROM groups g WHERE g.id = c.group_id
          ))
        )
      )
    )
  );

-- RLS Policies for grades table
CREATE POLICY "Teachers can manage grades for their students" ON grades
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      JOIN teachers t ON u.id = t.user_id
      WHERE u.auth_id = auth.uid() AND t.id = grades.teacher_id
    )
  );

CREATE POLICY "Students can read their own grades" ON grades
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      JOIN students s ON u.id = s.user_id
      WHERE u.auth_id = auth.uid() AND s.id = grades.student_id
    )
  );

CREATE POLICY "Parents can read their children grades" ON grades
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      JOIN students s ON u.id = s.parent_id
      WHERE u.auth_id = auth.uid() AND s.id = grades.student_id
    )
  );

-- RLS Policies for attendance table
CREATE POLICY "Teachers can manage attendance" ON attendance
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      JOIN teachers t ON u.id = t.user_id
      JOIN courses c ON t.id = c.teacher_id
      WHERE u.auth_id = auth.uid() AND c.id = attendance.course_id
    )
  );

CREATE POLICY "Students can read their attendance" ON attendance
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      JOIN students s ON u.id = s.user_id
      WHERE u.auth_id = auth.uid() AND s.id = attendance.student_id
    )
  );

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parents_updated_at BEFORE UPDATE ON parents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_materials_updated_at BEFORE UPDATE ON course_materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();