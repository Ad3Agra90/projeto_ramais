# 📞 Projeto Ramais

Bem-vindo ao Projeto Ramais! Este projeto é uma aplicação completa para gerenciamento de ramais telefônicos, composta por um backend em Java com Spring Boot e um frontend em React com Vite.

---

## 🚀 Descrição do Projeto

O Projeto Ramais oferece uma API RESTful para gerenciamento de ramais, com funcionalidades para consulta e controle de logs. A interface frontend permite interação amigável com o sistema.

---

## 🏗️ Estrutura do Projeto

- **backend/**: Código fonte do backend em Java (Spring Boot)
- **src/**: Código fonte do frontend em React
- **ramais.session.sql**: Script SQL para criação do banco de dados MySQL
- **package.json**: Configurações e dependências do frontend
- **backend/pom.xml**: Configurações e dependências do backend

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

## 📋 Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- Java 17 JDK
- Maven
- Node.js (versão 18 ou superior recomendada)
- npm ou yarn
- MySQL Server

---

## 🛠️ Configuração e Execução

### Banco de Dados

1. Crie um banco de dados MySQL.
2. Importe o script SQL para criar as tabelas e dados iniciais:

```bash
mysql -u seu_usuario -p nome_do_banco < ramais.session.sql
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

## 📦 Build para Produção

### Backend

No diretório `backend`, execute:

```bash
mvn clean package
```

O arquivo `.jar` gerado estará em `backend/target/`.

### Frontend

Na raiz do projeto, execute:

```bash
npm run build
```

Os arquivos estáticos serão gerados na pasta `dist/`.

---

## 🗂️ Visão Geral da Estrutura do Código

### Backend

- `RamaisApiApplication.java`: Classe principal que inicia o Spring Boot.
- `controller/`: Controladores REST para endpoints da API.
- `service/`: Lógica de negócio.
- `repository/`: Interfaces para acesso a dados via JPA.
- `model/`: Entidades JPA que representam tabelas do banco.
- `exception/`: Tratamento global de exceções.

### Frontend

- `src/main.jsx`: Ponto de entrada do React.
- `src/App.jsx`: Componente principal que engloba Header e Footer.
- `src/components/`: Componentes reutilizáveis.
- `src/Pages/`: Páginas da aplicação.
- `src/assets/`: Imagens e recursos estáticos.
- `src/global.scss`: Estilos globais.

---

## 🤝 Como Contribuir

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`).
4. Faça push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

---

## 📸 Exemplos de Código

### Backend - Classe Principal

```java
@SpringBootApplication
public class RamaisApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(RamaisApiApplication.class, args);
    }
}
```

### Frontend - Entrada React

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

---

## 🎉 Obrigado por usar o Projeto Ramais!

Se tiver dúvidas ou sugestões, abra uma issue no GitHub.
