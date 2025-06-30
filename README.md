🛒 Força de Vendas - API de Produtos
Este repositório contém a API de Produtos do sistema Força de Vendas, responsável por gerenciar produtos, variantes e SKUs de forma eficiente. Desenvolvida com Node.js e TypeScript, esta API RESTful oferece funcionalidades robustas como filtros avançados, paginação e a segurança do soft delete, garantindo a integridade dos dados.

🚀 Tecnologias Utilizadas
A API foi construída com um conjunto de tecnologias modernas e performáticas:

Node.js: Plataforma de execução JavaScript assíncrona.

Express: Framework web rápido e flexível para Node.js.

TypeScript: Superconjunto do JavaScript que adiciona tipagem estática.

Prisma ORM: ORM de última geração para acesso a banco de dados.

MySQL/MariaDB: Sistema de gerenciamento de banco de dados relacional robusto.

📂 Estrutura do Projeto
O projeto segue uma estrutura organizada para facilitar o desenvolvimento e a manutenção:

src/
├── controllers/    # Camada de controle: Lida com as requisições e respostas HTTP.
├── database/       # Configuração do Prisma: Conexão e esquemas do banco de dados.
├── middlewares/    # Interceptadores: Tratamento de erros, autenticação e validações.
├── models/         # Modelos de dados: Tipagens e interfaces para as entidades.
├── routes/         # Definição de rotas: Mapeamento dos endpoints da API.
├── services/       # Regras de negócio: Lógica central da aplicação.
└── utils/          # Utilitários: Funções auxiliares para paginação, filtros, etc.
⚙️ Como Executar o Projeto
Siga os passos abaixo para configurar e rodar a API em seu ambiente local:

1. Clone o Repositório
Comece clonando o projeto para sua máquina:

Bash

git clone https://github.com/seu-usuario/forca-vendas-api.git
cd forca-vendas-api
2. Instale as Dependências
Dentro do diretório do projeto, instale todas as dependências necessárias:

Bash

npm install
3. Configure o Ambiente
Crie um arquivo .env na raiz do projeto e configure as seguintes variáveis:

Snippet de código

DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"
NODE_ENV=development
PORT=3000
DATABASE_URL: String de conexão com seu banco de dados MySQL/MariaDB.

NODE_ENV: Define o ambiente de execução (ex: development, production).

PORT: Porta em que a API será executada.

4. Configure o Banco de Dados
É necessário importar o dump SQL fornecido no desafio para o seu banco de dados MariaDB/MySQL. Após isso, gere os clientes do Prisma e execute as migrações:

Bash

npx prisma generate
npx prisma db pull
5. Inicie a Aplicação
Com tudo configurado, você pode iniciar a API em modo de desenvolvimento:

Bash

npm run dev
A API estará disponível em http://localhost:3000 (ou na porta que você configurou).

🧠 Regras de Negócio Essenciais
Para um melhor entendimento do funcionamento da API, observe as seguintes regras de negócio:

Um Produto pode conter múltiplas Variantes.

Cada Variante possui múltiplos SKUs (referentes a tamanhos, por exemplo).

Serão retornadas apenas as variantes onde todos os SKUs estão vinculados à mesma tabela de preço.

A funcionalidade de Soft Delete garante que produtos removidos não são fisicamente apagados, mas sim marcados com uma data de exclusão (deleted_at).

📌 Endpoints Disponíveis
A seguir, a lista dos principais endpoints da API:

🔍 Produtos
Método

Rota

Descrição

GET

/products

Lista todos os produtos com suporte a filtros, paginação e query params.

GET

/products/:id

Retorna os detalhes de um produto específico pelo ID.

POST

/products

Cria um novo produto, incluindo suas variantes e SKUs.

PUT

/products/:id

Atualiza um produto existente (inclui variantes e SKUs).

DELETE

/products/:id

Realiza o soft delete, marcando o produto como deletado.


Exportar para as Planilhas
🧹 Produtos Deletados
Método

Rota

Descrição

GET

/products/deleted

Lista todos os produtos que foram deletados.

GET

/products/deleted/:id

Retorna um produto deletado pelo ID.


Exportar para as Planilhas
🎯 Filtros e Contagem
Método

Rota

Descrição

GET

/products/filters

Retorna os filtros disponíveis (marcas, tipos, categorias) para uso nas listagens de produtos.

GET

/products/count
