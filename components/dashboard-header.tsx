'use client'

import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { BarChart3, LogOut, Menu } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function DashboardHeader() {
  const { user, logout } = useAuth()

  // Função segura
  const getInitial = (name?: string) => {
    if (!name || typeof name !== 'string') return '?'
    return name.charAt(0).toUpperCase()
  }

  const userName = user?.name || 'Usuário'
  const userEmail = user?.email || 'sem-email'
  const userRole = user?.role || '...'

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">

        {/* Mobile Logo */}
        <div className="flex items-center gap-3 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">AtendMax</span>
        </div>

        {/* Desktop */}
        <div className="hidden lg:block" />

        {/* User Menu */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">

                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                  {getInitial(user?.name)}
                </div>

                {/* Nome */}
                <span className="hidden sm:inline text-sm font-medium">
                  {userName}
                </span>

                <Menu className="w-4 h-4 lg:hidden" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">
                    {userEmail}
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="text-muted-foreground">
                <span className="capitalize">
                  Cargo: {userRole}
                </span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={logout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}