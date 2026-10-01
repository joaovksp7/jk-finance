# Plano de Desenvolvimento - JK Finance

Este é o roteiro completo para a construção do nosso aplicativo de controle financeiro. Utilize este documento para guiar os próximos passos.

## Fase 1: Setup e Autenticação (Em Andamento)
- [x] Criar o projeto base Next.js.
- [x] Instalar dependências (Supabase e componentes do Shadcn UI).
- [x] Criar tabelas e regras de segurança (RLS) no Supabase.
- [x] Configurar as chaves de acesso no arquivo `.env.local`.
- [x] Criar conectores do Supabase (`client.ts` e `server.ts`).
- [x] Criar as funções de Login e Cadastro (`actions.ts`).
- [x] Concluir a interface da Tela de Login (`src/app/login/page.tsx`).
- [x] Criar o `middleware.ts` para proteger o site (só logados podem acessar).
- [x] Testar a criação do 1º usuário.

## Fase 2: Dashboard e Contas (Em Andamento)
- [x] Criar a estrutura base visual (Navegação Superior ou Lateral).
- [x] Construir a tela do Dashboard (`/`).
- [x] Fazer a listagem de Contas: separar "Minhas Contas" (Privadas) das "Caixinhas" (Compartilhadas).
- [x] Criar o formulário para cadastrar "Nova Conta/Caixinha".

## Fase 3: Lançamentos e Transações (Concluída)
- [x] Criar botão de "Novo Lançamento" (Receita, Despesa ou Transferência).
- [x] Tela de visualização de Extrato por Conta.
- [x] Cálculo dinâmico de Saldo Atual.

## Fase 4: Colaboração Familiar (Em Andamento)
- [ ] Criar interface para convidar um familiar para uma Caixinha (adicionando-o na tabela `account_members`).
- [ ] Definir níveis de permissão (Visualizador vs Editor).

## Fase 5: Open Finance (Visão de Futuro)
- [ ] Estudo de viabilidade (Pluggy, Belvo ou similar).
- [ ] Integração de Webhooks para salvar os dados preenchendo a coluna `open_finance_id`.

