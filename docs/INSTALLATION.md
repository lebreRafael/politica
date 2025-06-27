# Guia de Instalação - Política Transparência

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter os seguintes softwares instalados:

### Software Obrigatório
- **Node.js** (versão 18.17 ou superior)
- **npm** (versão 9.0 ou superior) ou **yarn** (versão 1.22 ou superior)
- **Git** (versão 2.30 ou superior)

### Software Opcional (Recomendado)
- **PostgreSQL** (versão 14 ou superior) - para desenvolvimento local
- **Redis** (versão 6.0 ou superior) - para cache local
- **VS Code** - editor recomendado com extensões

### Verificação
```bash
# Verificar versões instaladas
node --version
npm --version
git --version

# Se estiver usando yarn
yarn --version
```

## 🚀 Instalação Rápida

### 1. Clone o Repositório
```bash
git clone https://github.com/lebreRafael/politica.git
cd politica
```

### 2. Instalar Dependências
```bash
npm install
# ou
yarn install
```

### 3. Configurar Variáveis de Ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env.local

# Editar variáveis (ver seção de configuração abaixo)
nano .env.local
```

### 4. Executar em Desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

### 5. Acessar a Aplicação
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## ⚙️ Configuração Detalhada

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Configurações da Aplicação
NEXT_PUBLIC_APP_NAME=Política Transparência
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# APIs Externas
NEXT_PUBLIC_CAMARA_API_URL=https://dadosabertos.camara.leg.br/api/v2
NEXT_PUBLIC_SENADO_API_URL=https://legis.senado.leg.br/dadosabertos
NEXT_PUBLIC_TRANSPARENCIA_API_URL=https://www.portaltransparencia.gov.br/api-de-dados

# Banco de Dados (Opcional para desenvolvimento)
DATABASE_URL=postgresql://username:password@localhost:5432/politica
REDIS_URL=redis://localhost:6379

# Autenticação (Opcional)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Analytics (Opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Monitoramento
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### Configuração do Banco de Dados (Opcional)

Para desenvolvimento local com banco de dados:

#### PostgreSQL
```bash
# Instalar PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Criar banco de dados
sudo -u postgres createdb politica
sudo -u postgres createuser politica_user
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE politica TO politica_user;"

# Ou usar Docker
docker run --name postgres-politica \
  -e POSTGRES_DB=politica \
  -e POSTGRES_USER=politica_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:14
```

#### Redis
```bash
# Instalar Redis (Ubuntu/Debian)
sudo apt install redis-server

# Ou usar Docker
docker run --name redis-politica \
  -p 6379:6379 \
  -d redis:6-alpine
```

## 🛠️ Scripts Disponíveis

### Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm run start

# Verificar tipos TypeScript
npm run type-check

# Linting
npm run lint

# Linting com correção automática
npm run lint:fix
```

### Testes
```bash
# Executar testes
npm run test

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm run test:coverage

# Executar testes E2E
npm run test:e2e
```

### Qualidade de Código
```bash
# Formatação com Prettier
npm run format

# Verificação de segurança
npm audit

# Verificação de dependências desatualizadas
npm outdated
```

## 📁 Estrutura do Projeto

```
politica/
├── app/                    # Next.js App Router
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI básicos
│   ├── layout/           # Componentes de layout
│   └── features/         # Componentes específicos
├── lib/                  # Utilitários e configurações
│   ├── api.ts           # Cliente da API
│   ├── utils.ts         # Funções utilitárias
│   └── constants.ts     # Constantes da aplicação
├── types/               # Definições TypeScript
│   └── index.ts         # Tipos principais
├── docs/                # Documentação
├── public/              # Assets estáticos
├── .env.example         # Exemplo de variáveis de ambiente
├── package.json         # Dependências e scripts
├── tailwind.config.js   # Configuração do Tailwind
├── tsconfig.json        # Configuração do TypeScript
└── README.md           # Documentação principal
```

## 🔧 Configuração do Editor

### VS Code (Recomendado)

Instale as seguintes extensões:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### Configurações do VS Code

Crie um arquivo `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

## 🐳 Docker (Opcional)

### Docker Compose

Crie um arquivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: politica
      POSTGRES_USER: politica_user
      POSTGRES_PASSWORD: your_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 🧪 Testes

### Configuração de Testes

```bash
# Instalar dependências de teste
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Executar testes
npm test

# Executar testes específicos
npm test -- --testNamePattern="PoliticianCard"
```

### Exemplo de Teste

```typescript
// components/PoliticianCard.test.tsx
import { render, screen } from '@testing-library/react'
import PoliticianCard from './PoliticianCard'

describe('PoliticianCard', () => {
  it('renders politician information correctly', () => {
    const politician = {
      id: '1',
      name: 'João Silva',
      party: 'PTB',
      state: 'SP',
      house: 'deputado' as const,
    }

    render(<PoliticianCard politician={politician} />)
    
    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('PTB')).toBeInTheDocument()
    expect(screen.getByText('SP')).toBeInTheDocument()
  })
})
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas

- **Netlify**: Similar ao Vercel
- **Railway**: Para backend
- **Heroku**: Para aplicações full-stack
- **AWS**: Para infraestrutura customizada

## 🐛 Troubleshooting

### Problemas Comuns

#### Erro de Dependências
```bash
# Limpar cache do npm
npm cache clean --force

# Remover node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### Erro de TypeScript
```bash
# Verificar tipos
npm run type-check

# Reinstalar tipos
npm install --save-dev @types/node @types/react
```

#### Erro de Tailwind
```bash
# Rebuild do CSS
npm run build:css

# Verificar configuração
npx tailwindcss --help
```

#### Problemas de API
```bash
# Verificar conectividade
curl https://dadosabertos.camara.leg.br/api/v2/deputados

# Verificar rate limits
# Aguardar 1 minuto entre requests
```

## 📞 Suporte

### Recursos Úteis
- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)

### Comunidade
- [GitHub Issues](https://github.com/lebreRafael/politica/issues)
- [Discord](https://discord.gg/politica) (se disponível)
- [Email](mailto:contato@politica-transparencia.com)

---

*Este guia será atualizado conforme o projeto evolui. Para dúvidas específicas, consulte a documentação ou abra uma issue no GitHub.* 