import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AccountForm from '@/components/account-form'
import TransactionForm from '@/components/transaction-form'
import AccountList from '@/components/account-list'
import TransactionList from '@/components/transaction-list'
import { createClient } from '@/utils/supabase/server'
import { formatCurrency } from '@/lib/format'

export default async function Home() {
  const supabase = await createClient()
  
  // Buscar contas
  const { data: accounts } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: false })

  const accountsList = accounts || []
  
  // Buscar lançamentos
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, accounts(name)')
    .order('date', { ascending: false })

  const txList = transactions || []

  // Calcular saldos
  const balances: Record<string, number> = {}
  let totalBalance = 0

  txList.forEach(tx => {
    const amount = Number(tx.amount)
    const val = tx.type === 'expense' ? -amount : amount
    balances[tx.account_id] = (balances[tx.account_id] || 0) + val
    totalBalance += val
  })
  
  const personalAccounts = accountsList.filter(a => a.type !== 'shared_box')
  const sharedBoxes = accountsList.filter(a => a.type === 'shared_box')


  return (
    <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral das suas finanças e caixinhas.</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <AccountForm />
        <TransactionForm accounts={accountsList} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <span className="text-xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalBalance < 0 ? 'text-red-500' : ''}`}>
              {formatCurrency(totalBalance)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Minhas Contas</CardTitle>
            <span className="text-xl">💳</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personalAccounts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Caixinhas</CardTitle>
            <span className="text-xl">📦</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sharedBoxes.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Minhas Contas</CardTitle>
            <CardDescription>Contas correntes, cartões e investimentos.</CardDescription>
          </CardHeader>
          <CardContent>
            <AccountList accounts={personalAccounts} balances={balances} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Caixinhas Compartilhadas</CardTitle>
            <CardDescription>Dinheiro guardado em conjunto com a família.</CardDescription>
          </CardHeader>
          <CardContent>
            <AccountList accounts={sharedBoxes} balances={balances} />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Últimos Lançamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionList transactions={txList} accounts={accountsList} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
