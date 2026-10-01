import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import UserMenu from '@/components/user-menu'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Se não tiver usuário, não renderiza a navbar (ex: tela de login)
  if (!user) {
    return null
  }

  const firstName = user.user_metadata?.first_name || 'Usuário'

  return (
    <nav className="border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight text-primary">
          JK Finance
        </Link>
        
        <UserMenu
          currentUserId={user.id}
          currentEmail={user.email || ''}
          currentFirstName={firstName}
        />
      </div>
    </nav>
  )
}
