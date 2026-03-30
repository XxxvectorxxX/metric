'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Users, Plus, Pencil, Trash2, Shield } from 'lucide-react'
import type { User, UserRole } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrador',
  supervisor: 'Supervisor',
  user: 'Usuario',
}

const roleBadgeVariants: Record<UserRole, 'default' | 'secondary' | 'outline'> = {
  admin: 'default',
  supervisor: 'secondary',
  user: 'outline',
}

export default function UsersPage() {
  const { user: currentUser } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as UserRole,
    password: '',
  })
{/*
  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [currentUser, router])
*/}
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users')
        if (response.ok) {
          const data: User[] = await response.json()
          setUsers(data)
        } else {
          console.error('Failed to fetch users')
          setUsers([])
        }
      } catch (error) {
        console.error('Error fetching users:', error)
        setUsers([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchUsers()
  }, [])
{/*
  if (currentUser?.role !== 'admin') {
    return null
  }
*/}
  function handleOpenDialog(user?: User) {
    if (user) {
      setEditingUser(user)
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
      })
    } else {
      setEditingUser(null)
      setFormData({
        name: '',
        email: '',
        role: 'user',
        password: '',
      })
    }
    setIsDialogOpen(true)
  }

  function handleSave() {
    if (editingUser) {
      setUsers(prev =>
        prev.map(u =>
          u.id === editingUser.id
            ? { ...u, name: formData.name, email: formData.email, role: formData.role }
            : u
        )
      )
    } else {
      const newUser: User = {
        id: String(users.length + 1),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        createdAt: new Date(),
      }
      setUsers(prev => [...prev, newUser])
    }
    setIsDialogOpen(false)
  }

  function handleDelete(userId: string) {
    if (userId === currentUser?.id) {
      return // Can't delete yourself
    }
    setUsers(prev => prev.filter(u => u.id !== userId))
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gerenciamento de Usuarios</h1>
          <p className="text-sm text-muted-foreground">
            Adicione, edite ou remova usuarios do sistema
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Editar Usuario' : 'Novo Usuario'}
              </DialogTitle>
              <DialogDescription>
                {editingUser
                  ? 'Atualize as informacoes do usuario'
                  : 'Preencha os dados para criar um novo usuario'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Cargo</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: UserRole) => setFormData(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="user">Usuario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {!editingUser && (
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Senha"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingUser ? 'Salvar' : 'Criar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Usuarios do Sistema
          </CardTitle>
          <CardDescription>
            {users.length} usuarios cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {user.name}
                        {user.id === currentUser?.id && (
                          <Badge variant="outline" className="text-xs">Voce</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={roleBadgeVariants[user.role]}>
                        <Shield className="w-3 h-3 mr-1" />
                        {roleLabels[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.createdAt.toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(user)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user.id)}
                          disabled={user.id === currentUser?.id}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
