'use client'

import { useState, useEffect, useCallback } from 'react'
import { StatsCards } from '@/components/stats-cards'
import { RankingCard } from '@/components/ranking-card'
import { MetricsTable } from '@/components/metrics-table'
import { RefreshControl } from '@/components/refresh-control'
import { getRankedAttendants } from '@/lib/mock-data'
import type { AttendantMetrics, AppSettings } from '@/lib/types'

export default function DashboardPage() {
  const [attendants, setAttendants] = useState<AttendantMetrics[]>([])
  const [settings, setSettings] = useState<AppSettings>({
    refreshInterval: 30,
    dateRangeFilter: 30,
    tenantId: 1,
  })
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/attendants')
      if (response.ok) {
        const data: AttendantMetrics[] = await response.json()
        setAttendants(getRankedAttendants(data))
      } else {
        console.error('Failed to fetch attendants data')
        setAttendants([])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setAttendants([])
    } finally {
      setIsLoading(false)
    }
    setLastUpdate(new Date())
  }, [])

  const refreshData = useCallback(() => {
    fetchData()
  }, [fetchData])

  // Initial load
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Auto-refresh
  useEffect(() => {
    if (!isAutoRefresh) return
    
    const interval = setInterval(refreshData, settings.refreshInterval * 1000)
    return () => clearInterval(interval)
  }, [isAutoRefresh, settings.refreshInterval, refreshData])

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Metrificacao de atendentes em tempo real
          </p>
        </div>
        <RefreshControl
          lastUpdate={lastUpdate}
          isAutoRefresh={isAutoRefresh}
          refreshInterval={settings.refreshInterval}
          onRefresh={refreshData}
          onToggleAutoRefresh={() => setIsAutoRefresh(!isAutoRefresh)}
          onChangeInterval={(interval) => setSettings(s => ({ ...s, refreshInterval: interval }))}
        />
      </div>

      <StatsCards attendants={attendants} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RankingCard attendants={attendants} />
        </div>
        <div className="lg:col-span-2">
          <MetricsTable attendants={attendants} />
        </div>
      </div>
    </div>
  )
}
