'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { 
  BarChart3, 
  LayoutDashboard, 
  Database, 
  Users, 
  Settings,
  LogOut,
  Monitor
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'supervisor', 'user'] },
  { href: '/tv', label: 'Tela TV', icon: Monitor, roles: ['admin', 'supervisor', 'user'], external: true },
  { href: '/dashboard/database', label: 'Conexão DB', icon: Database, roles: ['admin'] },
  { href: '/dashboard/users', label: 'Usuários', icon: Users, roles: ['admin'] },
  { href: '/dashboard/settings', label: 'Configurações', icon: Settings, roles: ['admin', 'supervisor'] },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // 🔐 dados seguros
  const name = user?.user_metadata?.name || user?.email || ''
  const role = user?.user_metadata?.role || 'user'

  // ✅ função segura
  const getInitial = (value: string) => {
    if (!value || typeof value !== 'string') return '?'
    return value.charAt(0).toUpperCase()
  }

  const initial = getInitial(name)

  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(role)
  )

  // 🧠 evita render antes do user
  if (!user) return null

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-card border-r border-border">
        
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-border">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">AtendMax</span>
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Usuário */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
              {initial}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {name || 'Usuário'}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {role}
              </p>
            </div>
          </div>

          {/* Logout */}
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="flex items-center justify-around h-16">
          {filteredNavItems.slice(0, 4).map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label.split(' ')[0]}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}