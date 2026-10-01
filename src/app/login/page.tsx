import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const resolvedParams = await searchParams
  
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">JK Finance</CardTitle>
          <CardDescription className="text-center">Acesse o controle financeiro da sua família</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Primeiro Nome (Apenas para cadastro)</Label>
              <Input id="first_name" name="first_name" placeholder="João" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" required placeholder="voce@exemplo.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            
            {resolvedParams?.message && (
              <p className="text-sm text-red-500 text-center">{resolvedParams.message}</p>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <Button type="submit" formAction={login} className="w-full">
                Entrar
              </Button>
              <Button type="submit" formAction={signup} variant="outline" className="w-full">
                Criar Conta
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

