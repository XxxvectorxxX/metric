"use client"

import { useState, useEffect, useCallback } from "react"
import type { AttendantMetrics } from "@/lib/types"
import { Trophy, Clock, Users, CheckCircle2, Star, Phone, Pause, RefreshCw, Maximize, Settings2 } from "lucide-react"
import { cn } from "@/lib/utils"

const REFRESH_INTERVALS = [
  { label: "10s", value: 10000 },
  { label: "30s", value: 30000 },
  { label: "1min", value: 60000 },
  { label: "2min", value: 120000 },
]

export default function TVDisplayPage() {
  const [attendants, setAttendants] = useState<AttendantMetrics[]>([])
  const [lastUpdateTime, setLastUpdateTime] = useState<string>("")
  const [refreshInterval, setRefreshInterval] = useState(30000)
  const [showSettings, setShowSettings] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
  try {
    const response = await fetch('/api/attendants')

    if (!response.ok) {
      throw new Error('Erro na requisição')
    }

    const json = await response.json()

    // ✅ SUPORTE AOS DOIS FORMATOS
    const raw = Array.isArray(json) ? json : json.data

    if (!Array.isArray(raw)) {
      console.error('Formato inválido:', json)
      setAttendants([])
      return
    }

    // ✅ NORMALIZAÇÃO DOS DADOS DO BANCO
    const normalized: AttendantMetrics[] = raw.map((att: any) => ({
      id: att.id ?? att.name ?? att.nome,

      nome: att.nome ?? att.name ?? "---",
      setor: att.setor ?? "---",

      pendentes: Number(att.pendentes) || 0,
      atendendo: Number(att.atendendo) || 0,
      finalizados: Number(att.finalizados) || 0,

      total:
        Number(att.total) ||
        (Number(att.atendendo) || 0) +
          (Number(att.finalizados) || 0) +
          (Number(att.pendentes) || 0),

      mediaAvaliacao:
        Number(att.mediaAvaliacao ?? att.media_avaliacoes) || 0,
    }))

    // ✅ ORDENAÇÃO
    const sorted = normalized.sort(
      (a, b) => b.finalizados - a.finalizados
    )

    setAttendants(sorted)
    setLastUpdateTime(new Date().toLocaleTimeString('pt-BR'))

  } catch (error) {
    console.error('Error fetching data:', error)
    setAttendants([])
  } finally {
    setIsLoading(false)
  }
}, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    fetchData()
    const interval = setInterval(fetchData, refreshInterval)
    return () => clearInterval(interval)
  }, [fetchData, refreshInterval, mounted])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const top3 = attendants.slice(0, 3)

  const totals = attendants.reduce(
    (acc, att) => ({
      pendentes: acc.pendentes + (att.pendentes ?? 0),
      atendendo: acc.atendendo + (att.atendendo ?? 0),
      finalizados: acc.finalizados + (att.finalizados ?? 0),
      total: acc.total + (att.total ?? 0),
    }),
    { pendentes: 0, atendendo: 0, finalizados: 0, total: 0 }
  )

  const avgRating = attendants.length > 0 
    ? (attendants.reduce((sum, att) => sum + (att.mediaAvaliacao ?? 0), 0) / attendants.length).toFixed(1)
    : "0.0"

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 text-foreground p-6 lg:p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 lg:mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-primary text-primary-foreground">
            <Trophy className="w-6 h-6 lg:w-8 lg:h-8" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Ranking de Atendentes</h1>
            <p className="text-muted-foreground text-sm lg:text-base">Metricas em tempo real</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
            <span>Atualizado: {lastUpdateTime || "--:--:--"}</span>
          </div>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <Settings2 className="w-5 h-5" />
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-6 p-4 bg-card rounded-xl border border-border">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Intervalo de atualizacao:</span>
            <div className="flex gap-2">
              {REFRESH_INTERVALS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setRefreshInterval(value)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-lg transition-colors",
                    refreshInterval === value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <StatCard
          icon={<Pause className="w-5 h-5" />}
          label="Pendentes"
          value={totals.pendentes}
          color="warning"
        />
        <StatCard
          icon={<Phone className="w-5 h-5" />}
          label="Atendendo"
          value={totals.atendendo}
          color="primary"
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          label="Finalizados"
          value={totals.finalizados}
          color="success"
        />
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Total"
          value={totals.total}
          color="secondary"
        />
        <StatCard
          icon={<Star className="w-5 h-5" />}
          label="Media Geral"
          value={avgRating}
          color="accent"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Top 3 Podium */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border p-6 h-full">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Top 3 do Dia
            </h2>
            <div className="flex flex-col gap-4">
              {top3.map((att, index) => (
                <PodiumCard key={att.id} attendant={att} position={index + 1} />
              ))}
            </div>
          </div>
        </div>

        {/* Full Ranking Table */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl border border-border p-6 h-full">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Ranking Completo
            </h2>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">#</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Atendente</th>
                    <th className="text-center p-3 text-sm font-medium text-muted-foreground">Pendentes</th>
                    <th className="text-center p-3 text-sm font-medium text-muted-foreground">Atendendo</th>
                    <th className="text-center p-3 text-sm font-medium text-muted-foreground">Finalizados</th>
                    <th className="text-center p-3 text-sm font-medium text-muted-foreground">Total</th>
                    <th className="text-center p-3 text-sm font-medium text-muted-foreground">Avaliacao</th>
                  </tr>
                </thead>
                <tbody>
                  {attendants.slice(0, 10).map((att, index) => (
                    <tr 
                      key={att.id} 
                      className={cn(
                        "border-t border-border transition-colors",
                        index < 3 && "bg-primary/5"
                      )}
                    >
                      <td className="p-3">
                        <span className={cn(
                          "inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold",
                          index === 0 && "bg-yellow-500/20 text-yellow-600",
                          index === 1 && "bg-gray-400/20 text-gray-600",
                          index === 2 && "bg-orange-500/20 text-orange-600",
                          index > 2 && "bg-muted text-muted-foreground"
                        )}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                            {getInitials(att.nome)}
                          </div>
                          <span className="font-medium">{att.nome ?? "---"}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-md bg-warning/10 text-warning-foreground text-sm font-medium">
                          {att.pendentes ?? 0}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-md bg-primary/10 text-primary text-sm font-medium">
                          {att.atendendo ?? 0}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-md bg-success/10 text-success text-sm font-bold">
                          {att.finalizados ?? 0}
                        </span>
                      </td>
                      <td className="p-3 text-center font-semibold">{att.total ?? 0}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{(att.mediaAvaliacao ?? 0).toFixed(1)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-muted-foreground text-sm">
        <p>AtendMax - Sistema de Metrificacao de Atendentes</p>
      </footer>
    </div>
  )
}

function getInitials(name: string | undefined | null): string {
  if (!name) return "?"
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function StatCard({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode
  label: string
  value: number | string
  color: "primary" | "secondary" | "success" | "warning" | "accent"
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary text-secondary-foreground border-border",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning-foreground border-warning/20",
    accent: "bg-accent/10 text-accent border-accent/20",
  }

  return (
    <div className={cn("rounded-xl border p-4 lg:p-5", colorClasses[color])}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium opacity-80">{label}</span>
      </div>
      <p className="text-2xl lg:text-3xl font-bold">{value}</p>
    </div>
  )
}

function PodiumCard({ 
  attendant, 
  position 
}: { 
  attendant: AttendantMetrics
  position: number 
}) {
  const positionStyles = {
    1: {
      bg: "bg-gradient-to-br from-yellow-500/20 to-yellow-600/10",
      border: "border-yellow-500/30",
      badge: "bg-yellow-500 text-yellow-950",
    },
    2: {
      bg: "bg-gradient-to-br from-gray-400/20 to-gray-500/10",
      border: "border-gray-400/30",
      badge: "bg-gray-400 text-gray-950",
    },
    3: {
      bg: "bg-gradient-to-br from-orange-500/20 to-orange-600/10",
      border: "border-orange-500/30",
      badge: "bg-orange-500 text-orange-950",
    },
  }

  const style = positionStyles[position as 1 | 2 | 3]

  return (
    <div className={cn("rounded-xl border p-4", style.bg, style.border)}>
      <div className="flex items-center gap-4">
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold", style.badge)}>
          {position}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{attendant.nome ?? "---"}</p>
          <p className="text-sm text-muted-foreground">{attendant.setor ?? "---"}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{attendant.finalizados ?? 0}</p>
          <p className="text-xs text-muted-foreground">finalizados</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span>{(attendant.mediaAvaliacao ?? 0).toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <span>{attendant.pendentes ?? 0} pend.</span>
          <span>{attendant.atendendo ?? 0} atend.</span>
        </div>
      </div>
    </div>
  )
}
