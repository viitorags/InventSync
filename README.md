# InventSync

Um sistema de gerenciamento de inventário moderno e completo, desenvolvido com **Laravel** no backend e **React** no frontend. Aplicação ideal para controlar estoque, clientes, pedidos e gerar relatórios.

## Características

- **Autenticação JWT** - Segurança com tokens JWT
- **Gerenciamento de Estoque** - Controle completo de produtos
- **Gestão de Clientes** - Cadastro e acompanhamento de clientes
- **Gerenciamento de Pedidos** - Criação e rastreamento de pedidos
- **Geração de Relatórios** - Exportar dados em PDF
- **Dashboard** - Visualização rápida de informações
- **Interface Responsiva** - Desenvolvida com Ant Design

## Stack Tecnológico

### Backend
- **Laravel 12** - Framework PHP moderno
- **PHP 8.2+** - Linguagem de programação
- **JWT Auth** - Autenticação baseada em tokens
- **DomPDF** - Geração de relatórios em PDF
- **Pest** - Framework de testes
- **Vite** - Bundler para assets

### Frontend
- **React 19** - Biblioteca JavaScript para UI
- **React Router DOM 7** - Roteamento de páginas
- **Ant Design 5** - Componentes de interface de usuário
- **Vite** - Ferramenta de build rápida
- **ESLint** - Linter para qualidade de código

## Estrutura do Projeto

```
InventSync/
├── backend/                    # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/  # Controllers da aplicação
│   │   │   ├── AuthController.php
│   │   │   ├── ProductController.php
│   │   │   ├── CustomerController.php
│   │   │   ├── OrdersController.php
│   │   │   └── ReportController.php
│   │   └── Models/            # Modelos Eloquent
│   │       ├── User.php
│   │       ├── Product.php
│   │       ├── Customer.php
│   │       └── Order.php
│   ├── routes/                # Rotas da API
│   ├── database/              # Migrations e seeders
│   └── composer.json          # Dependências PHP
│
├── frontend/                  # Aplicação React
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   │   ├── AppForm.jsx
│   │   │   ├── AppTable.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── PublicRoute.jsx
│   │   ├── views/             # Páginas da aplicação
│   │   │   ├── Login.jsx
│   │   │   ├── Sign.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Stock.jsx
│   │   │   ├── Customer.jsx
│   │   │   ├── Orders.jsx
│   │   │   └── Configurations.jsx
│   │   ├── router/            # Configuração de rotas
│   │   │   └── index.jsx
│   │   ├── config/            # Configurações (API, etc)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json           # Dependências Node
│
├── shell.nix                  # Configuração Nix (Dev Environment)
├── .envrc                     # Configuração direnv
└── README.md                  # Este arquivo
```

## Como Começar

### Pré-requisitos

- **PHP 8.2+** com Composer
- **Node.js 18+** com npm
- **SQLite** ou outro banco de dados suportado por Laravel

### Instalação Rápida

#### 1. Clonar o repositório

```bash
git clone https://github.com/viitorags/InventSync.git
cd InventSync
```

#### 2. Configurar o Backend

```bash
cd backend

# Instalar dependências PHP
composer install

# Copiar arquivo de ambiente
cp .env.example .env

# Nota: Verifique o .env. Se estiver usando SQLite, altere DB_CONNECTION para sqlite
# e DB_DATABASE para o caminho do arquivo (ex: database/database.sqlite)

# Gerar chave da aplicação
php artisan key:generate

# Criar banco de dados
touch database/database.sqlite

# Executar migrations
php artisan migrate

# Instalar dependências Node (para assets)
npm install
```

#### 3. Configurar o Frontend

```bash
cd ../frontend

# Instalar dependências
npm install

# Criar arquivo .env se necessário
cp .env.example .env
```

### Desenvolvimento

#### Executar tudo com um comando:

```bash
cd backend
composer run dev
```

Este comando iniciará simultaneamente:
- **Servidor Laravel** (http://localhost:8000)
- **Fila de Jobs** (queue listener)
- **Logs em tempo real** (pail)
- **Compilação de Assets do Backend** (Vite)

**Nota:** O frontend (React) deve ser iniciado em um terminal separado.

#### Ou executar separadamente:

**Terminal 1 - Backend:**
```bash
cd backend
php artisan serve
```

**Terminal 2 - Fila de Jobs (opcional):**
```bash
cd backend
php artisan queue:listen --tries=1
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

## Testes

### Executar testes:

```bash
cd backend
composer test
```

## Build para Produção

### Frontend:

```bash
cd frontend
npm run build
```

Os arquivos compilados estarão em `frontend/dist/`

### Backend:

```bash
cd backend
npm run build
```

## Funcionalidades Principais

### Autenticação
- Registro de novos usuários
- Login com email e senha
- Autenticação baseada em JWT
- Logout seguro

### Estoque
- Cadastro de produtos
- Atualização de quantidades
- Listagem de produtos
- Controle de preços

### Clientes
- Registro de clientes
- Atualização de informações
- Listagem de clientes

### Pedidos
- Criação de novos pedidos
- Adição de produtos ao pedido
- Acompanhamento de status
- Relatório de vendas em PDF/Excel

### Relatórios
- Exportação de dados em PDF/Excel
- Relatórios de vendas
- Relatórios de produtos
- Relatórios de clientes

## Variáveis de Ambiente

### Backend (.env)

```env
APP_NAME=InventSync
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

JWT_SECRET=seu-secret-aqui
```

### Frontend (opcional)

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Rotas da API

As principais rotas disponíveis incluem:

- `POST /api/auth/login` - Autenticação
- `POST /api/auth/register` - Registro
- `GET/POST /api/products` - Gerenciamento de produtos
- `GET/POST /api/customers` - Gerenciamento de clientes
- `GET/POST /api/orders` - Gerenciamento de pedidos
- `GET /api/reports/{format}/{type}` - Geração de relatórios (vendas, produtos, clientes)

## Componentes Frontend

### AppForm
Componente genérico para formulários com validação

### AppTable
Componente de tabela com ordenação e paginação

### Sidebar
Menu lateral com navegação da aplicação

### PrivateRoute
Proteção de rotas autenticadas

### PublicRoute
Controle de rotas públicas (login, registro)

## Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## Autor

Desenvolvido por ![https://viitorags.github.io](viitorags)
