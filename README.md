# Frontend

[🇺🇸 English](#english) | [🇧🇷 Português](#português)

---

## English

### Overview

RoadUSP frontend is a React-based web application that visualizes USP (University of São Paulo) curriculum prerequisites as an interactive force-directed graph. Students can select their campus (unidade) and course, then explore discipline relationships through a D3.js visualization.

### Quick Start

```bash
cd roadusp-frontend
npm install
npm start
```

Runs at http://localhost:3000

### Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI framework |
| React Router | 7.x | Client-side routing |
| D3.js | 7.x | Force-directed graph visualization |
| Axios | 1.x | HTTP client |
| Vercel Analytics | 1.x | Usage tracking |

### Project Structure

```
src/
├── index.jsx              # React entry point
├── App.jsx                # Main app with routing
├── pages/
│   ├── HomePage.jsx       # Campus/course selection
│   └── GraphPage.jsx      # D3 graph visualization
├── components/Graph/
│   ├── Graph.jsx          # D3 force simulation
│   └── Graph.css
└── style/
    ├── HomePage.css
    └── GraphPage.css
```

### API Integration

| Endpoint | Method | Parameters |
|----------|--------|------------|
| `/ping` | GET | - |
| `/api/v1/cursos/lista` | GET | `unidade` |
| `/api/v1/cursos/disciplinas` | GET | `unidade`, `curso` |

Base URL: `https://roadusp-backend.onrender.com`

### Graph Features

- Force-directed layout
- Semester-based coloring
- Zoom and pan
- Draggable nodes
- Search by code/name
- Click for details modal

### Available Scripts

```bash
npm start       # Development server
npm run build   # Production build
npm test        # Run tests
```

---

## Português

### Visão Geral

O frontend do RoadUSP é uma aplicação web baseada em React que visualiza os pré-requisitos das disciplinas da USP (Universidade de São Paulo) como um grafo interativo direcionado por força. Estudantes podem selecionar sua unidade e curso, e explorar relacionamentos entre disciplinas através de uma visualização D3.js.

### Início Rápido

```bash
cd roadusp-frontend
npm install
npm start
```

Executa em http://localhost:3000

### Stack Tecnológica

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| React | 19.x | Framework UI |
| React Router | 7.x | Roteamento client-side |
| D3.js | 7.x | Visualização de grafo |
| Axios | 1.x | Cliente HTTP |
| Vercel Analytics | 1.x | Rastreamento de uso |

### Estrutura do Projeto

```
src/
├── index.jsx              # Ponto de entrada React
├── App.jsx                # App principal com roteamento
├── pages/
│   ├── HomePage.jsx       # Seleção de unidade/curso
│   └── GraphPage.jsx      # Visualização do grafo D3
├── components/Graph/
│   ├── Graph.jsx          # Simulação de força D3
│   └── Graph.css
└── style/
    ├── HomePage.css
    └── GraphPage.css
```

### Integração com API

| Endpoint | Método | Parâmetros |
|----------|--------|------------|
| `/ping` | GET | - |
| `/api/v1/cursos/lista` | GET | `unidade` |
| `/api/v1/cursos/disciplinas` | GET | `unidade`, `curso` |

URL Base: `https://roadusp-backend.onrender.com`

### Funcionalidades do Grafo

- Layout direcionado por força
- Coloração baseada no semestre
- Zoom e arrasto
- Nós arrastáveis
- Busca por código/nome
- Clique para modal de detalhes

### Scripts Disponíveis

```bash
npm start       # Servidor de desenvolvimento
npm run build   # Build de produção
npm test        # Executar testes
```