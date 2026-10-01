'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'

export async function createAccount(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const currency = 'BRL'
  const accountId = randomUUID()

  // Insert into accounts
  const { error: accountError } = await supabase
    .from('accounts')
    .insert([{ id: accountId, name, type, currency }])

  if (accountError) {
    throw new Error('Erro ao criar conta: ' + accountError.message)
  }

  // Insert into account_members
  const { error: memberError } = await supabase
    .from('account_members')
    .insert([{ account_id: accountId, user_id: user.id, role: 'owner' }])

  if (memberError) {
    throw new Error('Erro ao vincular membro à conta: ' + memberError.message)
  }

  revalidatePath('/')
  return { success: true }
}

export async function createTransaction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const account_id = formData.get('account_id') as string
  const amountStr = formData.get('amount') as string
  const amount = parseFloat(amountStr.replace(',', '.'))
  const type = formData.get('type') as string
  const description = formData.get('description') as string
  const date = formData.get('date') as string

  if (isNaN(amount) || amount <= 0) {
    throw new Error('Valor inválido.')
  }

  const { error } = await supabase
    .from('transactions')
    .insert([{ account_id, amount, type, description, date }])

  if (error) {
    throw new Error('Erro ao salvar lançamento: ' + error.message)
  }

  revalidatePath('/')
  return { success: true }
}

export async function updateAccount(id: string, name: string, type: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { error } = await supabase
    .from('accounts')
    .update({ name, type })
    .eq('id', id)

  if (error) throw new Error('Erro ao editar conta: ' + error.message)

  revalidatePath('/')
  return { success: true }
}

export async function deleteAccount(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id)

  if (error) throw new Error('Erro ao excluir conta: ' + error.message)

  revalidatePath('/')
  return { success: true }
}

export async function updateTransaction(id: string, data: { amount: number; type: string; description: string; date: string; account_id: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { error } = await supabase
    .from('transactions')
    .update(data)
    .eq('id', id)

  if (error) throw new Error('Erro ao editar lançamento: ' + error.message)

  revalidatePath('/')
  return { success: true }
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)

  if (error) throw new Error('Erro ao excluir lançamento: ' + error.message)

  revalidatePath('/')
  return { success: true }
}
