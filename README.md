# 🛒 Força de Vendas - API de Produtos

Este repositório contém a **API de Produtos** do sistema **Força de Vendas**, responsável por gerenciar produtos, variantes e SKUs de forma eficiente. Desenvolvida com **Node.js** e **TypeScript**, esta API RESTful oferece funcionalidades robustas como filtros avançados, paginação e a segurança do soft delete, garantindo a integridade dos dados.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** – Plataforma de execução JavaScript assíncrona.
- **Express** – Framework web rápido e flexível para Node.js.
- **TypeScript** – Superconjunto do JavaScript que adiciona tipagem estática.
- **Prisma ORM** – ORM moderno para acesso a banco de dados.
- **MySQL** – Sistema de gerenciamento de banco de dados relacional.

---

## 📂 Estrutura do Projeto

src/ ├── controllers/ # Camada de controle: requisições e respostas HTTP ├── database/ # Configuração do Prisma e esquemas do banco ├── middlewares/ # Tratamento de erros, autenticação e validações ├── models/ # Tipagens e interfaces das entidades ├── routes/ # Mapeamento dos endpoints da API ├── services/ # Regras de negócio da aplicação └── utils/ # Funções auxiliares (paginação, filtros, etc.)


---

## ⚙️ Como Executar o Projeto

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/forca-vendas-api.git
cd forca-vendas-api
```
2. Instale as Dependências
bash
npm install
3. Configure o Ambiente
Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

env
DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"
NODE_ENV=development
PORT=3000
4. Configure o Banco de Dados
Importe o dump SQL fornecido no desafio para seu banco de dados MariaDB/MySQL. Em seguida, execute:

bash
npx prisma generate
npx prisma db pull
5. Inicie a Aplicação
bash
npm run dev
A API estará disponível em http://localhost:3000.

🧠 Regras de Negócio Essenciais
Um Produto pode conter múltiplas Variantes.

Cada Variante possui múltiplos SKUs (ex: tamanhos).

Apenas variantes com todos os SKUs vinculados à mesma tabela de preço são retornadas.

O Soft Delete marca produtos como deletados sem removê-los fisicamente (deleted_at).

📌 Endpoints Disponíveis
🔍 Produtos
Método	Rota	Descrição
GET	/products	Lista todos os produtos com filtros e paginação
GET	/products/:id	Retorna os detalhes de um produto específico
POST	/products	Cria um novo produto com variantes e SKUs
PUT	/products/:id	Atualiza um produto existente
DELETE	/products/:id	Realiza o soft delete do produto
🧹 Produtos Deletados
Método	Rota	Descrição
GET	/products/deleted	Lista todos os produtos deletados
GET	/products/deleted/:id	Retorna um produto deletado pelo ID
🎯 Filtros e Contagem
Método	Rota	Descrição
GET	/products/filters	Retorna filtros disponíveis (marcas, tipos, categorias)
GET	/products/count	Retorna a contagem total de produtos
