'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Medal, Award } from 'lucide-react'
import type { AttendantMetrics } from '@/lib/types'
import { cn } from '@/lib/utils'

interface RankingCardProps {
  attendants: AttendantMetrics[]
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Trophy className="w-5 h-5 text-yellow-500" />
    case 2:
      return <Medal className="w-5 h-5 text-slate-400" />
    case 3:
      return <Award className="w-5 h-5 text-amber-600" />
    default:
      return null
  }
}

function getRankBadgeStyle(rank: number) {
  switch (rank) {
    case 1:
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
    case 2:
      return 'bg-slate-500/10 text-slate-500 border-slate-500/30'
    case 3:
      return 'bg-amber-500/10 text-amber-600 border-amber-500/30'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}

export function RankingCard({ attendants }: RankingCardProps) {
  const topThree = attendants.slice(0, 3)
  
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Top Atendentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topThree.map((attendant) => (
          <div
            key={attendant.id}
            className={cn(
              'flex items-center gap-4 p-4 rounded-xl border transition-all',
              attendant.rank === 1 
                ? 'bg-yellow-500/5 border-yellow-500/20' 
                : 'bg-card border-border/50'
            )}
          >
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center border font-bold text-sm',
              getRankBadgeStyle(attendant.rank || 0)
            )}>
              {getRankIcon(attendant.rank || 0) || attendant.rank}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{attendant.name}</p>
              <p className="text-sm text-muted-foreground">
                {attendant.total} atendimentos totais
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-lg font-bold text-foreground">{attendant.finalizados}</p>
              <p className="text-xs text-muted-foreground">finalizados</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
