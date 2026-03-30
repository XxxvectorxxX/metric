'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Users, Clock, CheckCircle2, AlertCircle, Star } from 'lucide-react'
import type { AttendantMetrics } from '@/lib/types'

interface StatsCardsProps {
  attendants: AttendantMetrics[]
}

export function StatsCards({ attendants }: StatsCardsProps) {
  const totals = attendants.reduce(
    (acc, att) => ({
      pendentes: acc.pendentes + att.pendentes,
      atendendo: acc.atendendo + att.atendendo,
      finalizados: acc.finalizados + att.finalizados,
      total: acc.total + att.total,
    }),
    { pendentes: 0, atendendo: 0, finalizados: 0, total: 0 }
  )

  const avgRating = attendants
    .filter(a => a.media_avaliacoes !== null)
    .reduce((acc, a, _, arr) => acc + (a.media_avaliacoes || 0) / arr.length, 0)

  const stats = [
    {
      label: 'Total de Atendimentos',
      value: totals.total.toLocaleString('pt-BR'),
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Pendentes',
      value: totals.pendentes.toLocaleString('pt-BR'),
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'Em Atendimento',
      value: totals.atendendo.toLocaleString('pt-BR'),
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Finalizados',
      value: totals.finalizados.toLocaleString('pt-BR'),
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Media Avaliacoes',
      value: avgRating.toFixed(1),
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
