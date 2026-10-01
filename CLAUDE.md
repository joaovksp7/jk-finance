# Regras do Agente (AGENTS / CLAUDE)

Aplicativo de controle financeiro **JK Finance**. Projeto BahTech.

## Documentos — ler primeiro

- [`PLAN.md`](PLAN.md) — roteiro completo de desenvolvimento, fases, features e andamento. É a especificação primária do projeto.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · Supabase (Auth, Database, RLS) · Shadcn UI.

```text
src/
├── app/              rotas da aplicação e layouts
├── components/
│   └── ui/           componentes base (Shadcn UI) e reutilizáveis
├── lib/              clientes do Supabase e funções utilitárias
└── styles/
    └── globals.css   estilos globais e variáveis de tema
```

## Regras rígidas do Projeto

- **Autenticação e Dados:** Todas as interações com banco (Supabase) devem respeitar as regras de RLS definidas. O `middleware.ts` deve proteger rotas privadas.
- **UI:** Reutilizar componentes construídos com Shadcn UI. Não criar estilos do zero se houver um componente existente que atenda à necessidade.
- **Estilização:** Manter o uso do Tailwind CSS e variáveis CSS para cores.

---

## Fluxo obrigatório

Para toda instrução, seguir nesta ordem — sem exceção:

1. **Ler** — identificar e ler todos os arquivos relacionados à instrução
   (componentes, estilos, tipos, utilitários, rotas, testes).
2. **Confirmar** — responder com:
   - **Entendi:** (resumo de 2–3 frases do que foi pedido)
   - **Arquivos que vou alterar:** (nome e caminho de cada um)
   - **O que muda em cada um:** (descrição breve por arquivo)
3. **Aguardar** — não fazer nenhuma alteração até receber confirmação explícita
   ("ok", "pode ir", "sim" ou equivalente).
4. **Executar** — só depois da confirmação, implementar exatamente o combinado.
   Não ampliar escopo sem avisar antes.

Se qualquer parte da instrução estiver ambígua, perguntar antes de ler os arquivos.

---

## Regras de Comportamento

**Fazer:**

- Seguir os padrões existentes do projeto (nomes, estrutura, estilo)
- Ficar no escopo estrito do que foi pedido
- Relatar qualquer problema encontrado fora do escopo antes de agir sobre ele
- Conferir imports, exports e dependências afetadas
- Avisar se uma mudança pode quebrar algo em outro lugar

**Não fazer:**

- Alterar arquivos sem apresentar o plano e aguardar confirmação
- Assumir qualquer coisa que não tenha sido dita explicitamente
- Refatorar código além do que foi pedido
- Renomear, mover ou apagar arquivos sem aprovação explícita
- Instalar dependências novas sem informar e aguardar confirmação
- Criar arquivos novos sem avisar antes
- Reescrever lógica funcional ao corrigir algo simples
