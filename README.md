
## 📦 Código do Projeto

```
plf-es-2025-1-ti3-898110-grupo-6-instituto-educa-cidades
│
└── Codigo
    ├── backend
    │   ├── src
    │   │   ├── main
    │   │   │   ├── java
    │   │   │   │   └── com
    │   │   │   │       └── educaCidades
    │   │   │   │           ├── controllers      # Camada de controle (API REST)
    │   │   │   │           ├── config            # Configurações gerais
    │   │   │   │           ├── exceptions        # Tratamento de exceções
    │   │   │   │           ├── models            # Modelos (Entidades)
    │   │   │   │           ├── repositories      # Persistência (JPA)
    │   │   │   │           ├── services          # Regras de negócio
    │   │   │   │           ├── security          # Segurança e autenticação
    │   │   │   │           ├── util              # Utilitários e helpers
    │   │   │   │           └── EducaCidadesApplication.java  # Classe principal
    │   │   │   └── resources
    │   │   │       ├── application.properties        # Configurações padrão
    │   │   │       ├── application-dev.properties    # Configuração ambiente DEV
    │   │   │       ├── application-prod.properties   # Configuração ambiente PROD
    │   │   │       └── reports                       # Templates de relatórios
    │   ├── Dockerfile
    │   └── pom.xml                                    # Gerenciador de dependências Maven
    │
    ├── frontend
    │   ├── src
    │   │   ├── assets           # Arquivos estáticos (imagens, ícones, etc.)
    │   │   ├── components       # Componentes reutilizáveis do React
    │   │   ├── pages            # Páginas principais da aplicação
    │   │   ├── services         # Serviços de comunicação com a API
    │   │   └── main.jsx         # Arquivo principal de inicialização do React
    │   ├── Dockerfile
    │   ├── index.html           # Página HTML raiz
    │   ├── package-lock.json    # Lock de dependências Node
    │   ├── package.json         # Gerenciamento de dependências
    │   └── vite.config.js       # Configurações do Vite
    │
    ├── docker-compose.yml       # Orquestração dos containers (Backend, Frontend, DB)
    └── README.md                # Documentação do projeto
```
