-- Setup Database Script para Supabase
-- Cria todas as tabelas necessárias para o sistema de metrificação

-- Extensão para hash de senha (bcrypt)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'supervisor', 'user')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de atendentes (métricas)
CREATE TABLE IF NOT EXISTS attendants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  pendentes INTEGER DEFAULT 0,
  atendendo INTEGER DEFAULT 0,
  finalizados INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  media_avaliacoes DECIMAL(3,1) DEFAULT 0.0,
  tenant_id INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de tickets
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'open', 'closed')),
  tenant_id INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de avaliações de tickets
CREATE TABLE IF NOT EXISTS ticket_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  evaluation DECIMAL(3,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações de banco de dados
CREATE TABLE IF NOT EXISTS database_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  host VARCHAR(255),
  port INTEGER DEFAULT 5432,
  database VARCHAR(255),
  username VARCHAR(255),
  password VARCHAR(255),
  ssl BOOLEAN DEFAULT true,
  custom_query TEXT,
  is_active BOOLEAN DEFAULT false,
  tenant_id INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações da aplicação
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  refresh_interval INTEGER DEFAULT 30,
  date_range_filter INTEGER DEFAULT 30,
  tenant_id INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Função para criar usuário com hash de senha
CREATE OR REPLACE FUNCTION create_user(
  p_email VARCHAR,
  p_password VARCHAR,
  p_name VARCHAR DEFAULT NULL,
  p_role VARCHAR DEFAULT 'user'
)
RETURNS TABLE(id UUID, email VARCHAR, name VARCHAR, role VARCHAR, created_at TIMESTAMP WITH TIME ZONE) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO users (email, password_hash, name, role)
  VALUES (
    p_email,
    crypt(p_password, gen_salt('bf')),
    COALESCE(p_name, p_email),
    p_role
  )
  RETURNING users.id, users.email, users.name, users.role, users.created_at;
END;
$$ LANGUAGE plpgsql;

-- Função para validar login (email + senha)
CREATE OR REPLACE FUNCTION validate_user(
  p_email VARCHAR,
  p_password VARCHAR
)
RETURNS TABLE(id UUID, email VARCHAR, name VARCHAR, role VARCHAR, is_active BOOLEAN) AS $$
BEGIN
  RETURN QUERY
  SELECT users.id, users.email, users.name, users.role, users.is_active
  FROM users
  WHERE users.email = p_email
  AND users.password_hash = crypt(p_password, users.password_hash)
  AND users.is_active = true
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_attendants_user_id ON attendants(user_id);
CREATE INDEX IF NOT EXISTS idx_attendants_tenant_id ON attendants(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_tenant_id ON tickets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ticket_evaluations_ticket_id ON ticket_evaluations(ticket_id);

-- Inserir usuário admin padrão
SELECT create_user(
  'admin@atendmax.com',
  'senha123',
  'Administrador',
  'admin'
);

-- Inserir usuário supervisor padrão
SELECT create_user(
  'supervisor@atendmax.com',
  'senha123',
  'Supervisor',
  'supervisor'
);

-- Inserir usuário comum padrão
SELECT create_user(
  'user@atendmax.com',
  'senha123',
  'Usuário Teste',
  'user'
);

-- Verificar usuários criados
SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC;
