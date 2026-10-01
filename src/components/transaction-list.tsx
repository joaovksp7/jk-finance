'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateTransaction, deleteTransaction } from '@/app/actions/dashboard'
import { formatCurrency, formatDate } from '@/lib/format'

interface Transaction {
  id: string
  account_id: string
  amount: number
  type: string
  description: string
  date: string
  accounts?: { name: string }
}

interface Account {
  id: string
  name: string
}

export default function TransactionList({ transactions, accounts }: {
  transactions: Transaction[]
  accounts: Account[]
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState({ amount: '', type: '', description: '', date: '', account_id: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  function startEdit(tx: Transaction) {
    setEditingId(tx.id)
    setEditData({
      amount: String(tx.amount),
      type: tx.type,
      description: tx.description || '',
      date: tx.date,
      account_id: tx.account_id,
    })
    setError('')
  }

  async function handleUpdate() {
    setIsLoading(true)
    setError('')
    try {
      const amount = parseFloat(editData.amount.replace(',', '.'))
      if (isNaN(amount) || amount <= 0) throw new Error('Valor inválido.')
      await updateTransaction(editingId!, {
        amount,
        type: editData.type,
        description: editData.description,
        date: editData.date,
        account_id: editData.account_id,
      })
      setEditingId(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: string, desc: string) {
    if (!confirm(`Tem certeza que deseja excluir o lançamento "${desc}"?`)) return
    setIsLoading(true)
    setError('')
    try {
      await deleteTransaction(id)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-md text-muted-foreground">
        Nenhum dado disponível
      </div>
    )
  }

  return (
    <div>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr>
              <th className="px-4 py-3 rounded-tl-md">Data</th>
              <th className="px-4 py-3">Descrição</th>
              <th className="px-4 py-3">Conta</th>
              <th className="px-4 py-3 text-right">Valor</th>
              <th className="px-4 py-3 rounded-tr-md text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 10).map((tx) => (
              editingId === tx.id ? (
                <tr key={tx.id} className="border-b">
                  <td className="px-4 py-2">
                    <Input type="date" value={editData.date} onChange={e => setEditData({...editData, date: e.target.value})} className="h-8 text-xs" />
                  </td>
                  <td className="px-4 py-2">
                    <Input value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} className="h-8 text-xs" />
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={editData.account_id}
                      onChange={e => setEditData({...editData, account_id: e.target.value})}
                      className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                    >
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-1 items-center">
                      <select
                        value={editData.type}
                        onChange={e => setEditData({...editData, type: e.target.value})}
                        className="h-8 rounded-md border border-input bg-background px-1 text-xs"
                      >
                        <option value="income">Receita</option>
                        <option value="expense">Despesa</option>
                      </select>
                      <Input type="number" step="0.01" value={editData.amount} onChange={e => setEditData({...editData, amount: e.target.value})} className="h-8 text-xs w-24" />
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)} disabled={isLoading} className="h-7 text-xs">Cancelar</Button>
                      <Button size="sm" onClick={handleUpdate} disabled={isLoading} className="h-7 text-xs">{isLoading ? '...' : 'Salvar'}</Button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={tx.id} className="border-b last:border-0">
                  <td className="px-4 py-3">{formatDate(tx.date)}</td>
                  <td className="px-4 py-3 font-medium">{tx.description}</td>
                  <td className="px-4 py-3 text-muted-foreground">{tx.accounts?.name}</td>
                  <td className={`px-4 py-3 text-right font-bold ${tx.type === 'expense' ? 'text-red-500' : 'text-green-600'}`}>
                    {tx.type === 'expense' ? '-' : '+'}{formatCurrency(tx.amount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost" onClick={() => startEdit(tx)} title="Editar" className="h-7">✏️</Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(tx.id, tx.description)} title="Excluir" className="h-7">🗑️</Button>
                    </div>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
