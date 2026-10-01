'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { getSavedAccounts, saveAccount, removeAccount, clearAllAccounts, SavedAccount } from '@/lib/account-store'

interface UserMenuProps {
  currentUserId: string
  currentEmail: string
  currentFirstName: string
}

export default function UserMenu({ currentUserId, currentEmail, currentFirstName }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([])
  const [isSwitching, setIsSwitching] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Salvar conta atual e carregar lista ao montar
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        saveAccount({
          user_id: currentUserId,
          email: currentEmail,
          first_name: currentFirstName,
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        })
      }
      setSavedAccounts(getSavedAccounts())
    })
  }, [currentUserId, currentEmail, currentFirstName])

  // Fechar menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function switchToAccount(account: SavedAccount) {
    if (account.user_id === currentUserId) {
      setIsOpen(false)
      return
    }
    setIsSwitching(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.setSession({
        access_token: account.access_token,
        refresh_token: account.refresh_token,
      })
      if (error) {
        // Token expirado, remover conta salva e avisar
        removeAccount(account.user_id)
        setSavedAccounts(getSavedAccounts())
        alert(`Sessão de "${account.first_name}" expirou. Faça login novamente.`)
        setIsSwitching(false)
        return
      }
      // Recarregar página para aplicar nova sessão
      router.refresh()
      window.location.reload()
    } catch {
      setIsSwitching(false)
    }
  }

  function handleAddAccount() {
    setIsOpen(false)
    // Redirecionar para login sem fazer logout
    router.push('/login?switch=true')
  }

  async function handleLogout() {
    setIsOpen(false)
    removeAccount(currentUserId)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const otherAccounts = savedAccounts.filter(a => a.user_id !== currentUserId)

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
          {currentFirstName.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm hidden sm:inline-block">
          Olá, {currentFirstName}
        </span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-popover border rounded-lg shadow-lg z-50 overflow-hidden">
          {/* Conta atual */}
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {currentFirstName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{currentFirstName}</p>
                <p className="text-xs text-muted-foreground truncate">{currentEmail}</p>
              </div>
            </div>
          </div>

          {/* Outras contas salvas */}
          {otherAccounts.length > 0 && (
            <div className="border-b">
              <p className="text-xs text-muted-foreground px-4 pt-3 pb-1">Trocar para</p>
              {otherAccounts.map(account => (
                <button
                  key={account.user_id}
                  onClick={() => switchToAccount(account)}
                  disabled={isSwitching}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors text-left disabled:opacity-50"
                >
                  <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold">
                    {account.first_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{account.first_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{account.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Ações */}
          <div className="p-2">
            <button
              onClick={handleAddAccount}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-left text-sm"
            >
              <span className="text-lg">➕</span>
              Adicionar outra conta
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-left text-sm text-red-500"
            >
              <span className="text-lg">🚪</span>
              Sair desta conta
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
