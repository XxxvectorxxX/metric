#!/usr/bin/env node

/**
 * Script para criar usuários no banco de dados
 * Uso: node scripts/create-user.js <email> <password> [name] [role]
 * 
 * Exemplo:
 *   node scripts/create-user.js admin@atendmax.com senha123 "Administrador" admin
 *   node scripts/create-user.js usuario@atendmax.com senha123 "João Silva" user
 */

import { createClient } from '@supabase/supabase-js'
import process from 'process'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas!')
  console.error('Adicione ao .env:')
  console.error('  NEXT_PUBLIC_SUPABASE_URL=...')
  console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY=...')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function createUser(email, password, name = null, role = 'user') {
  try {
    console.log(`\n📝 Criando usuário: ${email}`)
    
    // Criar via Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email,
          role,
        },
      },
    })

    if (authError) {
      console.error('❌ Erro ao criar usuário:', authError.message)
      return
    }

    console.log('✅ Usuário criado com sucesso!')
    console.log('   ID:', authUser.user?.id)
    console.log('   Email:', authUser.user?.email)
    console.log('   Nome:', name || email)
    console.log('   Role:', role)
    console.log('   Criado em:', new Date().toLocaleString('pt-BR'))

  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

// Parse argumentos
const args = process.argv.slice(2)

if (args.length < 2) {
  console.log(`
📋 Uso: node scripts/create-user.js <email> <password> [name] [role]

Exemplos:
  node scripts/create-user.js admin@atendmax.com senha123 "Administrador" admin
  node scripts/create-user.js usuario@atendmax.com senha123 "João Silva" user
  node scripts/create-user.js test@atendmax.com senha123

Roles disponíveis: admin, supervisor, user (padrão)
  `)
  process.exit(1)
}

const [email, password, name, role] = args
await createUser(email, password, name, role)
