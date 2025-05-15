# 📞 Projeto Ramais

Bem-vindo ao Projeto Ramais! Este projeto é uma aplicação completa para gerenciamento de ramais telefônicos, composta por um backend em Java com Spring Boot e um frontend em React com Vite.

---

## 🚀 Descrição do Projeto

O Projeto Ramais oferece uma API RESTful para gerenciamento de ramais, com funcionalidades para consulta e controle de logs. A interface frontend permite interação amigável com o sistema.

---

## 🏗️ Estrutura do Projeto

- **backend/**: Código fonte do backend em Java (Spring Boot)
- **src/**: Código fonte do frontend em React
- **script_sql_create_table.sql**: Script SQL para criação do banco de dados MySQL
- **ramaisapi_postman_collection.json**: Script do Postman para testes da API
- **package.json**: Configurações e dependências do frontend
- **backend/pom.xml**: Configurações e dependências do backend

---

## 📥 Instalação

### Banco de Dados

1. Crie um banco de dados MySQL.
2. O script para criação do banco de dados e tabelas está localizado em:
   ```
   backend/src/main/resources/script_sql_create_table.sql
   ```
3. Importe o script SQL para criar as tabelas e dados iniciais:

```bash
mysql -u seu_usuario -p < backend/src/main/resources/script_sql_create_table.sql
```

### Backend

1. Navegue até a pasta `backend`:

```bash
cd backend
```

2. Compile e rode a aplicação Spring Boot:

```bash
mvn clean install
mvn spring-boot:run
```

O backend estará disponível em `http://localhost:8080`.

### Frontend

1. Na raiz do projeto, instale as dependências do frontend:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento Vite:

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173` (ou porta indicada no terminal).

---

## 📋 Testes com Postman

Para facilitar os testes da API, utilize o arquivo de coleção do Postman localizado na raiz do projeto:

```
ramaisapi_postman_collection.json
```

Importe este arquivo no Postman para acessar todos os endpoints configurados para testes rápidos.

---

## 🔗 Endpoints da API

A API possui os seguintes endpoints principais:

| Método | Endpoint                           | Descrição                                       |
|--------|------------------------------------|-------------------------------------------------|
| GET    | `/api/range`                       | Retorna o intervalo atual configurado.          |
| POST   | `/api/range`                       | Define um novo intervalo.                       |
| GET    | `/api/extensions`                  | Lista todos os ramais (extensões).              |
| POST   | `/api/extensions/login/{id}`       | Realiza login de um usuário em um ramal.        |
| POST   | `/api/extensions/logout/{id}`      | Realiza logout de um ramal específico.          |
| POST   | `/api/extensions/logoutAll/{user}` | Realiza logout de todos os ramais de um usuário.|
| GET    | `/api/logs`                        | Retorna os logs de ações realizadas.            |

### Exemplos de uso

#### GET /api/range

Retorna o intervalo configurado:

```json
{
  "start": 1000,
  "end": 1010
}
```

#### POST /api/range

Define um novo intervalo:

```json
{
  "start": 1000,
  "end": 1010,
  "user": "admin"
}
```

#### GET /api/extensions

Retorna a lista de ramais:

```json
[
  {
    "id": 1,
    "extensionNumber": "1001",
    "user": "user1",
    "loggedUser": true
  },
  {
    "id": 2,
    "extensionNumber": "1002",
    "user": null,
    "loggedUser": false
  }
]
```

#### POST /api/extensions/login/{id}

Realiza login de um usuário em um ramal específico:

```json
{
  "user": "testuser"
}
```

#### POST /api/extensions/logout/{id}

Realiza logout de um ramal específico.

#### POST /api/extensions/logoutAll/{user}

Realiza logout de todos os ramais associados a um usuário.

#### GET /api/logs

Retorna os logs de ações realizadas:

```json
[
  {
    "id": 1,
    "user": "admin",
    "action": "Set range 1000-1010",
    "timestamp": "2024-06-01T12:00:00"
  },
  {
    "id": 2,
    "user": "testuser",
    "action": "Login extension 1001",
    "timestamp": "2024-06-01T12:05:00"
  }
]
```

---

## 🗂️ Estrutura do Backend

O backend é estruturado da seguinte forma:

- `RamaisApiApplication.java`: Classe principal que inicia o Spring Boot.
- `controller/`: Contém os controladores REST que expõem os endpoints da API. Exemplo:
  
  ```java
  @RestController
  @RequestMapping("/api")
  public class RamalController {
      // Endpoints para gerenciar ramais, intervalos e logs
  }
  ```
- `service/`: Contém a lógica de negócio da aplicação, como manipulação de ramais e logs.
- `repository/`: Interfaces para acesso a dados via JPA, responsáveis por operações no banco.
- `model/`: Entidades JPA que representam as tabelas do banco de dados.
- `exception/`: Tratamento global de exceções para a API.

---

## ⚙️ Tecnologias Utilizadas

### Backend
- Java 17
- Spring Boot 3.0.5
- Spring Data JPA
- MySQL Connector
- Lombok

### Frontend
- React 19
- Vite
- Axios
- Sass

---

## 🎉 Obrigado por usar o Projeto Ramais!

Se tiver dúvidas ou sugestões, abra uma issue no GitHub.
