'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createTransaction } from '@/app/actions/dashboard'

export default function TransactionForm({ accounts }: { accounts: { id: string, name: string }[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(formData: FormData) {
    setIsLoading(true)
    setError('')
    try {
      await createTransaction(formData)
      setIsOpen(false)
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao salvar o lançamento.')
    } finally {
      setIsLoading(false)
    }
  }

  if (accounts.length === 0) {
    return null; // Don't show button if no accounts
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} variant="default">
        + Novo Lançamento
      </Button>
    )
  }

  return (
    <Card className="w-full md:w-[28rem] mb-6">
      <CardHeader>
        <CardTitle>Novo Lançamento</CardTitle>
        <CardDescription>Registre uma receita ou despesa.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <select 
                id="type" 
                name="type" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background disabled:opacity-50 md:text-sm"
                required
              >
                <option value="income">Receita (Entrada)</option>
                <option value="expense">Despesa (Saída)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input id="amount" name="amount" required placeholder="0.00" step="0.01" type="number" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account_id">Conta / Caixinha</Label>
            <select 
              id="account_id" 
              name="account_id" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background disabled:opacity-50 md:text-sm"
              required
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" name="description" required placeholder="Ex: Mercado, Salário..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input id="date" name="date" required type="date" defaultValue={new Date().toISOString().split('T')[0]} />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
