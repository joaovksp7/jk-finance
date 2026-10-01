'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createAccount } from '@/app/actions/dashboard'

export default function AccountForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(formData: FormData) {
    setIsLoading(true)
    setError('')
    try {
      await createAccount(formData)
      setIsOpen(false)
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao criar a conta.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        + Nova Conta ou Caixinha
      </Button>
    )
  }

  return (
    <Card className="w-full md:w-96 mb-6">
      <CardHeader>
        <CardTitle>Criar Nova Conta</CardTitle>
        <CardDescription>Adicione uma conta corrente, cartão ou caixinha.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Conta</Label>
            <Input id="name" name="name" required placeholder="Ex: Nubank, Caixinha da Viagem..." />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <select 
              id="type" 
              name="type" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              required
            >
              <option value="checking">Conta Corrente</option>
              <option value="savings">Poupança</option>
              <option value="credit">Cartão de Crédito</option>
              <option value="investment">Investimento</option>
              <option value="shared_box">Caixinha Compartilhada</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-2 justify-end">
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
