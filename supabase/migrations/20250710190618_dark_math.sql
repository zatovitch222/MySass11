/*
  # Création du compte administrateur par défaut

  1. Compte admin
    - Email: admin@edumanage.com
    - Mot de passe: admin123
    - Rôle: admin
    - Peut créer tous les autres utilisateurs

  2. Fonction pour créer des utilisateurs
    - Accessible uniquement aux admins
    - Crée le compte auth + profil utilisateur
*/

-- Fonction pour créer un utilisateur (admin seulement)
CREATE OR REPLACE FUNCTION create_user_account(
  p_email text,
  p_password text,
  p_first_name text,
  p_last_name text,
  p_role text,
  p_phone text DEFAULT NULL,
  p_address text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
  new_auth_id uuid;
BEGIN
  -- Vérifier que l'utilisateur actuel est admin
  IF NOT EXISTS (
    SELECT 1 FROM users 
    WHERE auth_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Seuls les administrateurs peuvent créer des utilisateurs';
  END IF;

  -- Vérifier que le rôle est valide
  IF p_role NOT IN ('admin', 'teacher', 'student', 'parent') THEN
    RAISE EXCEPTION 'Rôle invalide: %', p_role;
  END IF;

  -- Créer l'utilisateur dans auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    p_email,
    crypt(p_password, gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO new_auth_id;

  -- Créer le profil utilisateur
  INSERT INTO users (
    auth_id,
    email,
    first_name,
    last_name,
    role,
    phone,
    address,
    can_change_password
  ) VALUES (
    new_auth_id,
    p_email,
    p_first_name,
    p_last_name,
    p_role,
    p_phone,
    p_address,
    CASE WHEN p_role = 'student' THEN true ELSE false END
  )
  RETURNING id INTO new_user_id;

  -- Créer les enregistrements spécifiques selon le rôle
  IF p_role = 'teacher' THEN
    INSERT INTO teachers (user_id) VALUES (new_user_id);
  ELSIF p_role = 'student' THEN
    INSERT INTO students (user_id, level) VALUES (new_user_id, 'Non défini');
  ELSIF p_role = 'parent' THEN
    INSERT INTO parents (user_id) VALUES (new_user_id);
  END IF;

  RETURN new_user_id;
END;
$$;

-- Fonction pour supprimer un utilisateur (admin seulement)
CREATE OR REPLACE FUNCTION delete_user_account(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_auth_id uuid;
BEGIN
  -- Vérifier que l'utilisateur actuel est admin
  IF NOT EXISTS (
    SELECT 1 FROM users 
    WHERE auth_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Seuls les administrateurs peuvent supprimer des utilisateurs';
  END IF;

  -- Récupérer l'auth_id de l'utilisateur à supprimer
  SELECT auth_id INTO target_auth_id
  FROM users
  WHERE id = p_user_id;

  IF target_auth_id IS NULL THEN
    RAISE EXCEPTION 'Utilisateur non trouvé';
  END IF;

  -- Supprimer l'utilisateur de auth.users (cascade vers users)
  DELETE FROM auth.users WHERE id = target_auth_id;

  RETURN true;
END;
$$;

-- Créer le compte admin par défaut
DO $$
DECLARE
  admin_auth_id uuid;
  admin_user_id uuid;
BEGIN
  -- Vérifier si l'admin existe déjà
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@edumanage.com') THEN
    
    -- Créer l'utilisateur auth
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@edumanage.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO admin_auth_id;

    -- Créer le profil admin
    INSERT INTO users (
      auth_id,
      email,
      first_name,
      last_name,
      role,
      can_change_password
    ) VALUES (
      admin_auth_id,
      'admin@edumanage.com',
      'Administrateur',
      'Système',
      'admin',
      false
    )
    RETURNING id INTO admin_user_id;

    RAISE NOTICE 'Compte administrateur créé avec succès';
  ELSE
    RAISE NOTICE 'Le compte administrateur existe déjà';
  END IF;
END;
$$;