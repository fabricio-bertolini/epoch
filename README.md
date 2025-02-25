# Central de Viagens

Este é um projeto de uma aplicação de gerenciamento de viagens temporais construída com Node.js, Express, TypeScript e TypeORM. A aplicação permite gerenciar viajantes viagens e infrações com autenticação JWT e registro de logs usando Winston e Morgan.

## Considerações:
- Eu fiquei entre devolver a entidade por completo das entidades relacionais, ou somente os ids para fins de operações. Acabei decidindo passar a entidade por completo nas funções de criação.
- Acabei tendo de criar entidades a mais:
    1. Fiscal para validar o login e autenticação, assim como também servindo de mais uma conexão com Infração, uma vez que é necessário um Fiscal para aplicar a infração.
    2. Viagem para utilizar das verificações/services de regras de negócio, e também forticiar mais o relacionamento entre as entidades existentes.
- Por questões de limitações decidir somente permitir uma infração por viagem.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Framework web para Node.js.
- **TypeScript**: Superset de JavaScript que adiciona tipagem estática.
- **TypeORM**: ORM para TypeScript e JavaScript (ES7, ES6, ES5).
- **JWT (jsonwebtoken)**: Biblioteca para autenticação baseada em tokens.
- **bcrypt**: Biblioteca para hashing de senhas.
- **date-fns**: Biblioteca para manipulação de datas.
- **dotenv**: Biblioteca para carregar variáveis de ambiente de um arquivo `.env`.
- **Morgan**: Middleware de logger para requisições HTTP.
- **Winston**: Biblioteca de logging.
- **Jest**: Framework de testes para JavaScript.

## Instalação

1. Clone o repositório:

   ```sh
   git clone https://github//com/fabricio-bertolini/epoch//git
   cd CentralDeViagens
    ```

2. Instale as dependências:
  ```sh
    yarn
  ```

4. Configure as variáveis de ambiente:
Crie um arquivo //env na raiz do projeto e adicione suas variáveis de ambiente// 
Exemplo:
  ```sh
    DB_HOST=localhost   # Database host  
    DB_PORT=5432        # Database port
    DB_USER=postgres    # Username
    DB_PASS=admin       # Password
    DB_NAME=postgres    # Database name
    
    PORT=3000           # Server port
    
    JWT_SECRET=f3fec87749742253dd1743cec1872da4671f655a   # JWT secret key  
  ```
5. Execute as migrações do banco de dados:
   ```sh
   yarn migration:generate
   yarn migration:run
   ```
## Scripts Disponíveis:

- **yarn dev** > Inicia a aplicação em modo de desenvolvimento usando nodemon e ts-node//
- **yarn build** > Compila o projeto TypeScript para JavaScript//
- **yarn test** > Executa os testes usando Jest//
- **yarn migration:generate** > Gera uma nova migração com base nas mudanças nas entidades//
- **yarn migration:run** > Executa as migrações pendentes no banco de dados//
- **yarn migration:revert** > Reverte a última migração executada//

## Estrutura do Projeto:
  ```bash
CentralDeViagens/
├── src/
│   ├── controllers/
│   │   ├── FiscalController.ts
│   │   ├── InfracaoController.ts
│   │   ├── ViajanteController.ts
│   │   └── ViagemController.ts
│   ├── entities/
│   │   ├── Fiscal.ts
│   │   ├── Infracao.ts
│   │   ├── Viajante.ts
│   │   └── Viagem.ts
│   ├── helpers/
│   │   └── api-errors.ts
│   ├── middlewares/
│   │   ├── auth.ts
│   │   ├── error.ts
│   │   └── morgan.ts
│   ├── repositories/
│   │   ├── fiscalRepository.ts
│   │   ├── infracaoRepository.ts
│   │   ├── viajanteRepository.ts
│   │   └── viagemRepository.ts
│   ├── services/
│   │   └── services.ts
│   ├── utils/
│   │   └── logger.ts
│   ├── data-source.ts
│   ├── index.ts
│   └── routes.ts
├── .env
├── .gitignore
├── jest.config.js
├── package.json
├── tsconfig.json
└── README.md
  ```

## Rotas
  ```sh
# API Rotas e Funções

## Login
| **Rota**  | **Função**  |
|-----------|------------|
| `/login`  | `.login`   |

## Fiscal
| **Rota**  | **Função**  |
|-----------|------------|
| `/fiscal` | `.createFiscal` |
| `/fiscal` | `.listFiscal` |
| `/fiscal/:fiscalId` | `.getFiscal` |
| `/fiscal/:cpf` | `.getFiscalByCpf` |
| `/fiscal/:fiscalId` | `.updateFiscal` |
| `/fiscal/:fiscalId` | `.deleteFiscal` |
| `/profile` | `.getProfile` |

## Viajante
| **Rota**  | **Função**  |
|-----------|------------|
| `/viajante` | `.listViajante` |
| `/viajante/:viajanteId` | `.getViajante` |
| `/viajante/:numeroPassaporte` | `.getViajanteByNumeroDePassaporte` |
| `/viajante` | `.createViajante` |
| `/viajante/:viajanteId` | `.updateViajante` |
| `/viajante/:viajanteId` | `.deleteViajante` |

## Infração
| **Rota**  | **Função**  |
|-----------|------------|
| `/viajante/:viajanteId/infracao` | `.listInfracao` |
| `/viajante/:viajanteId/infracao/:infracaoId` | `.getInfracao` |
| `/viajante/:viajanteId/:viagemId/:fiscalId/infracao/` | `.createInfracao` |
| `/viajante/:viajanteId/infracao/:infracaoId` | `.updateInfracao` |
| `/viajante/:viajanteId/infracao/:infracaoId` | `.deleteInfracao` |

## Viagem
| **Rota**  | **Função**  |
|-----------|------------|
| `/viajante/:viajanteId/viagem` | `.listViagem` |
| `/viajante/:viajanteId/viagem/:viagemId` | `.getViagem` |
| `/viajante/:viajanteId/viagem` | `.createViagem` |
| `/viajante/:viajanteId/viagem/:viagemId` | `.updateViagem` |
| `/viajante/:viajanteId/viagem/:viagemId` | `.deleteViagem` |

```

## Testes
Os testes são escritos usando Jest. Para executar os testes use o comando:
  ```sh
  yarn test
  ```

## Licença
Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

**obs.: sim o nome do repositório foi inspirado na nave de Chrono Trigger que faz viagens no tempo.**
