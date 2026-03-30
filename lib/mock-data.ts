import type { AttendantMetrics } from './types'

export function getRankedAttendants(attendants: AttendantMetrics[]): AttendantMetrics[] {
  return [...attendants]
    .sort((a, b) => b.total - a.total)
    .map((att, index) => ({ ...att, rank: index + 1 }))
}
