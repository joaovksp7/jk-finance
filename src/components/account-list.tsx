'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateAccount, deleteAccount } from '@/app/actions/dashboard'
import { formatCurrency } from '@/lib/format'
import Link from 'next/link'

interface Account {
  id: string
  name: string
  type: string
}

export default function AccountList({ accounts, balances }: {
  accounts: Account[]
  balances: Record<string, number>
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editType, setEditType] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  function startEdit(acc: Account) {
    setEditingId(acc.id)
    setEditName(acc.name)
    setEditType(acc.type)
    setError('')
  }

  async function handleUpdate() {
    setIsLoading(true)
    setError('')
    try {
      await updateAccount(editingId!, editName, editType)
      setEditingId(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Tem certeza que deseja excluir a conta "${name}"? Todos os lançamentos dela serão apagados.`)) return
    setIsLoading(true)
    setError('')
    try {
      await deleteAccount(id)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const typeLabels: Record<string, string> = {
    checking: 'Conta Corrente',
    savings: 'Poupança',
    credit: 'Cartão de Crédito',
    investment: 'Investimento',
    shared_box: 'Caixinha',
  }

  if (accounts.length === 0) {
    return <div className="text-sm text-muted-foreground">Nenhuma conta cadastrada.</div>
  }

  return (
    <div>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <ul className="space-y-4">
        {accounts.map((acc) => (
          <li key={acc.id} className="border-b pb-2 last:border-0">
            {editingId === acc.id ? (
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label>Nome</Label>
                  <Input value={editName} onChange={e => setEditName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Tipo</Label>
                  <select
                    value={editType}
                    onChange={e => setEditType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="checking">Conta Corrente</option>
                    <option value="savings">Poupança</option>
                    <option value="credit">Cartão de Crédito</option>
                    <option value="investment">Investimento</option>
                    <option value="shared_box">Caixinha Compartilhada</option>
                  </select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)} disabled={isLoading}>Cancelar</Button>
                  <Button size="sm" onClick={handleUpdate} disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar'}</Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <Link href={`/account/${acc.id}`} className="font-medium hover:underline hover:text-primary transition-colors">{acc.name}</Link>
                  <p className="text-xs text-muted-foreground">{typeLabels[acc.type] || acc.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-sm ${(balances[acc.id] || 0) < 0 ? 'text-red-500' : ''}`}>
                    {formatCurrency(balances[acc.id] || 0)}
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => startEdit(acc)} title="Editar">✏️</Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(acc.id, acc.name)} title="Excluir">🗑️</Button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
