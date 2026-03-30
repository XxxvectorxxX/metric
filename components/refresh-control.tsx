'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { RefreshCw, Clock, ChevronDown, Pause, Play } from 'lucide-react'

interface RefreshControlProps {
  lastUpdate: Date
  isAutoRefresh: boolean
  refreshInterval: number
  onRefresh: () => void
  onToggleAutoRefresh: () => void
  onChangeInterval: (interval: number) => void
}

const intervals = [
  { label: '10 segundos', value: 10 },
  { label: '30 segundos', value: 30 },
  { label: '1 minuto', value: 60 },
  { label: '5 minutos', value: 300 },
]

export function RefreshControl({
  lastUpdate,
  isAutoRefresh,
  refreshInterval,
  onRefresh,
  onToggleAutoRefresh,
  onChangeInterval,
}: RefreshControlProps) {
  const currentInterval = intervals.find(i => i.value === refreshInterval)

  return (
    <div className="flex items-center gap-2">
      <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span>
          Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        className="gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        <span className="hidden sm:inline">Atualizar</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            {isAutoRefresh ? (
              <Play className="w-4 h-4 text-green-600" />
            ) : (
              <Pause className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="hidden sm:inline">
              {isAutoRefresh ? currentInterval?.label : 'Pausado'}
            </span>
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Auto-atualização</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onToggleAutoRefresh}>
            {isAutoRefresh ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pausar
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Retomar
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            Intervalo
          </DropdownMenuLabel>
          {intervals.map((interval) => (
            <DropdownMenuItem
              key={interval.value}
              onClick={() => onChangeInterval(interval.value)}
              className={refreshInterval === interval.value ? 'bg-accent' : ''}
            >
              {interval.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
