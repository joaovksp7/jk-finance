// Gerenciador de múltiplas contas salvas no localStorage
// Funciona similar ao seletor de contas do Gmail

export interface SavedAccount {
  user_id: string
  email: string
  first_name: string
  access_token: string
  refresh_token: string
}

const STORAGE_KEY = 'jk_saved_accounts'

export function getSavedAccounts(): SavedAccount[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveAccount(account: SavedAccount) {
  const accounts = getSavedAccounts()
  // Atualiza se já existe, senão adiciona
  const index = accounts.findIndex(a => a.user_id === account.user_id)
  if (index >= 0) {
    accounts[index] = account
  } else {
    accounts.push(account)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts))
}

export function removeAccount(userId: string) {
  const accounts = getSavedAccounts().filter(a => a.user_id !== userId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts))
}

export function clearAllAccounts() {
  localStorage.removeItem(STORAGE_KEY)
}
