export type UserRole = 'admin' | 'supervisor' | 'user'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: Date
}

export interface AttendantMetrics {
  id: string
  name: string
  pendentes: number
  atendendo: number
  finalizados: number
  total: number
  media_avaliacoes: number | null
  rank?: number
}

export interface DatabaseConfig {
  id: string
  name: string
  host: string
  port: number
  database: string
  username: string
  password: string
  ssl: boolean
  customQuery: string
  isActive: boolean
  createdAt: Date
}

export interface AppSettings {
  refreshInterval: number // in seconds
  dateRangeFilter: number // in days
  tenantId: number
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}
