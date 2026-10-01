import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import TransactionForm from '@/components/transaction-form'
import TransactionList from '@/components/transaction-list'
import { createClient } from '@/utils/supabase/server'
import { formatCurrency } from '@/lib/format'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function AccountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Buscar a conta
  const { data: account } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', id)
    .single()

  if (!account) {
    notFound()
  }

  // Buscar todas as transações dessa conta
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, accounts(name)')
    .eq('account_id', id)
    .order('date', { ascending: false })

  const txList = transactions || []

  // Calcular saldo
  let balance = 0
  txList.forEach(tx => {
    const amount = Number(tx.amount)
    balance += tx.type === 'expense' ? -amount : amount
  })

  // Calcular receitas e despesas do mês atual
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  let monthIncome = 0
  let monthExpense = 0

  txList.forEach(tx => {
    if (tx.date && tx.date.startsWith(currentMonth)) {
      const amount = Number(tx.amount)
      if (tx.type === 'income') monthIncome += amount
      else if (tx.type === 'expense') monthExpense += amount
    }
  })

  const typeLabels: Record<string, string> = {
    checking: 'Conta Corrente',
    savings: 'Poupança',
    credit: 'Cartão de Crédito',
    investment: 'Investimento',
    shared_box: 'Caixinha Compartilhada',
  }

  return (
    <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">Dashboard</Link>
        <span>/</span>
        <span>{account.name}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{account.name}</h1>
          <p className="text-muted-foreground">{typeLabels[account.type] || account.type} · {account.currency}</p>
        </div>
        <TransactionForm accounts={[account]} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <span className="text-xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance < 0 ? 'text-red-500' : ''}`}>
              {formatCurrency(balance)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
            <span className="text-xl">📈</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(monthIncome)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
            <span className="text-xl">📉</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {formatCurrency(monthExpense)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Extrato Completo</CardTitle>
          <CardDescription>Todos os lançamentos desta conta.</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionList transactions={txList} accounts={[account]} />
        </CardContent>
      </Card>
    </main>
  )
}
