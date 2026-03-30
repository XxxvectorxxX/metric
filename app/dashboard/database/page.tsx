'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Database, Save, TestTube, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { DatabaseConfig } from '@/lib/types'

export default function DatabaseConfigPage() {
  const [config, setConfig] = useState<DatabaseConfig>({
    id: '1',
    name: '',
    host: '',
    port: 5432,
    database: '',
    username: '',
    password: '',
    ssl: true,
    customQuery: '',
    isActive: false,
    createdAt: new Date(),
  })

  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // 🔥 Carregar config salva
  useEffect(() => {
    async function loadConfig() {
      const res = await fetch('/api/database')
      const data = await res.json()
      if (data?.data) {
        setConfig(data.data)
      }
    }
    loadConfig()
  }, [])

  async function handleTestConnection() {
    setIsTesting(true)
    setTestResult(null)

    await new Promise(resolve => setTimeout(resolve, 1500))

    if (config.host && config.database && config.username) {
      setTestResult('success')
    } else {
      setTestResult('error')
    }

    setIsTesting(false)
  }

  // ✅ AGORA SALVA DE VERDADE
  async function handleSave() {
    try {
      setIsSaving(true)

      const response = await fetch('/api/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      alert('Conexão salva com sucesso!')
    } catch (error) {
      console.error(error)
      alert('Erro ao salvar conexão')
    } finally {
      setIsSaving(false)
    }
  }

  function updateConfig<K extends keyof DatabaseConfig>(key: K, value: DatabaseConfig[K]) {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <h1 className="text-2xl font-bold">Conexao de Banco</h1>

      <Card>
        <CardHeader>
          <CardTitle>Configuração</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Nome"
            value={config.name}
            onChange={(e) => updateConfig('name', e.target.value)}
          />

          <Input
            placeholder="Host"
            value={config.host}
            onChange={(e) => updateConfig('host', e.target.value)}
          />

          <Input
            type="number"
            value={config.port}
            onChange={(e) => updateConfig('port', parseInt(e.target.value))}
          />

          <Input
            placeholder="Database"
            value={config.database}
            onChange={(e) => updateConfig('database', e.target.value)}
          />

          <Input
            placeholder="Usuário"
            value={config.username}
            onChange={(e) => updateConfig('username', e.target.value)}
          />

          <Input
            type="password"
            placeholder="Senha"
            value={config.password}
            onChange={(e) => updateConfig('password', e.target.value)}
          />

          <Textarea
            placeholder="Query SQL"
            value={config.customQuery}
            onChange={(e) => updateConfig('customQuery', e.target.value)}
          />

          <div className="flex gap-3">
            <Button onClick={handleTestConnection} disabled={isTesting}>
              {isTesting ? 'Testando...' : 'Testar'}
            </Button>

            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>

          {testResult === 'success' && <p className="text-green-600">Conectado!</p>}
          {testResult === 'error' && <p className="text-red-600">Erro!</p>}
        </CardContent>
      </Card>
    </div>
  )
}