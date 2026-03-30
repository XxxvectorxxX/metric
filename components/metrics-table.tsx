'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Star, TrendingUp } from 'lucide-react'
import type { AttendantMetrics } from '@/lib/types'
import { cn } from '@/lib/utils'

interface MetricsTableProps {
  attendants: AttendantMetrics[]
}

function getRankBadgeVariant(rank: number): 'default' | 'secondary' | 'outline' {
  if (rank <= 3) return 'default'
  if (rank <= 5) return 'secondary'
  return 'outline'
}

function getRatingColor(rating: number | null): string {
  if (rating === null) return 'text-muted-foreground'
  if (rating >= 4.5) return 'text-green-600'
  if (rating >= 4.0) return 'text-yellow-600'
  if (rating >= 3.5) return 'text-orange-500'
  return 'text-red-500'
}

export function MetricsTable({ attendants }: MetricsTableProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-primary" />
          Ranking Completo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-6 px-6">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Atendente</TableHead>
                <TableHead className="text-center w-24">Pendentes</TableHead>
                <TableHead className="text-center w-24">Atendendo</TableHead>
                <TableHead className="text-center w-24">Finalizados</TableHead>
                <TableHead className="text-center w-20">Total</TableHead>
                <TableHead className="text-center w-28">Avaliacao</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendants.map((attendant) => (
                <TableRow 
                  key={attendant.id}
                  className={cn(
                    'transition-colors',
                    attendant.rank === 1 && 'bg-yellow-500/5'
                  )}
                >
                  <TableCell>
                    <Badge variant={getRankBadgeVariant(attendant.rank || 0)}>
                      #{attendant.rank}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{attendant.name}</TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-md bg-orange-500/10 text-orange-600 text-sm font-medium">
                      {attendant.pendentes}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-md bg-blue-500/10 text-blue-600 text-sm font-medium">
                      {attendant.atendendo}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-md bg-green-500/10 text-green-600 text-sm font-medium">
                      {attendant.finalizados}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    {attendant.total}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={cn(
                      'inline-flex items-center gap-1 font-medium',
                      getRatingColor(attendant.media_avaliacoes)
                    )}>
                      <Star className="w-4 h-4 fill-current" />
                      {attendant.media_avaliacoes?.toFixed(1) || '-'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
