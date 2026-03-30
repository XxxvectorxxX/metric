'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Settings, Save, Clock, Calendar, Building } from 'lucide-react'
import type { AppSettings } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState<AppSettings>({
    refreshInterval: 30,
    dateRangeFilter: 30,
    tenantId: 1,
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (user?.role === 'user') {
      router.push('/dashboard')
    }
  }, [user, router])

  if (user?.role === 'user') {
    return null
  }

  async function handleSave() {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuracoes</h1>
        <p className="text-sm text-muted-foreground">
          Configure os parametros do sistema de metrificacao
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Atualizacao de Dados
            </CardTitle>
            <CardDescription>
              Configure o intervalo de atualizacao automatica dos dados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="refreshInterval">Intervalo de Atualizacao</Label>
              <Select
                value={String(settings.refreshInterval)}
                onValueChange={(value) => setSettings(s => ({ ...s, refreshInterval: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 segundos</SelectItem>
                  <SelectItem value="30">30 segundos</SelectItem>
                  <SelectItem value="60">1 minuto</SelectItem>
                  <SelectItem value="300">5 minutos</SelectItem>
                  <SelectItem value="600">10 minutos</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Frequencia com que os dados serao buscados do banco externo
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Filtro de Periodo
            </CardTitle>
            <CardDescription>
              Defina o periodo padrao para exibicao dos dados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dateRange">Periodo de Dados</Label>
              <Select
                value={String(settings.dateRangeFilter)}
                onValueChange={(value) => setSettings(s => ({ ...s, dateRangeFilter: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Ultimo dia</SelectItem>
                  <SelectItem value="7">Ultimos 7 dias</SelectItem>
                  <SelectItem value="15">Ultimos 15 dias</SelectItem>
                  <SelectItem value="30">Ultimos 30 dias</SelectItem>
                  <SelectItem value="60">Ultimos 60 dias</SelectItem>
                  <SelectItem value="90">Ultimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Periodo de dados considerado para as metricas
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Configuracao de Tenant
            </CardTitle>
            <CardDescription>
              Configure o ID do tenant para filtrar os dados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tenantId">Tenant ID</Label>
              <Input
                id="tenantId"
                type="number"
                value={settings.tenantId}
                onChange={(e) => setSettings(s => ({ ...s, tenantId: parseInt(e.target.value) || 1 }))}
                placeholder="1"
              />
              <p className="text-xs text-muted-foreground">
                Identificador do tenant no banco de dados externo
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Salvar Configuracoes
            </CardTitle>
            <CardDescription>
              Salve todas as alteracoes feitas nas configuracoes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSave} disabled={isSaving} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar Configuracoes'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
