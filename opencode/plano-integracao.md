# Plano de Integração Frontend ↔ Backend (Login + Histórico)

## 1. Infraestrutura Base

### Criar `src/services/api.js`
- Instância centralizada do Axios com `baseURL: https://roadusp-backend.onrender.com`
- Interceptor de request que anexa `Authorization: Bearer <token>` automaticamente
- Interceptor de response que trata 401 (token expirado → logout)

### Criar `src/contexts/AuthContext.jsx`
- Contexto global com: `user`, `token`, `isLoggedIn`, `historicoStatus`
- `login(email, senha)` → `POST /api/v1/conta/login`, salva token no localStorage
- `register(email, senha)` → `POST /api/v1/conta/criar`, faz login automático após criar
- `logout()` → limpa token + historicoStatus do localStorage
- `changePassword(email, senhaAntiga, novaSenha)` → `UPDATE /api/v1/conta/alterar`
- `uploadHistory(file)` → `POST /api/v1/conta/upload/historico`, retorna `processamento_id`
- `pollProcessing(id, onUpdate)` → polling GET `/api/v1/conta/processamento/<id>` a cada 2s

### Modificar `src/App.jsx`
- Envolver `<Routes>` com `<AuthProvider>`

---

## 2. Autenticação — Telas e Componentes

### Criar `src/components/Auth/AuthModal.jsx`
- Modal de boas-vindas que aparece na Home
- Duas abas: **Login** e **Criar Conta**
- Campos: email, senha (confirmação para criar conta)
- Botão "Depois" no canto para fechar sem autenticar
- Loading state, mensagens de erro inline

### Criar `src/components/Auth/ChangePasswordModal.jsx`
- Modal de alteração de senha
- Campos: email, senha antiga, nova senha
- Chama `PATCH /api/v1/conta/alterar`

### Criar `src/components/Profile/ProfileMenu.jsx`
- Ícone de perfil no canto superior direito da Home
- Dropdown com 3 opções:
  - **Upload Histórico** → `input type="file" accept=".pdf"` oculto
  - **Alterar Senha** → abre ChangePasswordModal
  - **Sair** → logout
- Fecha ao clicar fora

### Modificar `src/pages/HomePage.jsx`
- Adicionar ProfileMenu no topo direito (fixed)
- Exibir AuthModal se não logado e primeira visita (flag `roadusp_welcomed`)
- Após login, ProfileMenu aparece
- Integrar fluxo de upload com UploadToast

---

## 3. Upload de Histórico + Toast Animado

### Criar `src/components/Upload/UploadToast.jsx`
- Toast no canto inferior direito
- Estados: `idle` (invisível) → `uploading` (animado "Fazendo upload...") → `done` ("Finalizado ✓" por 5s)
- Animações com Tailwind: `animate-pulse`, `fade-in`, `slide-in-from-right`

### Fluxo
1. Usuário seleciona PDF → `uploadHistory(file)`
2. Recebe `processamento_id`, inicia polling a cada 2s
3. Toast exibe "Fazendo upload..." com animação
4. Quando `status === "concluido"`: toast "Finalizado ✓", salva `resultado` no localStorage
5. Se `status === "erro"`: toast de erro
6. Após 5s, toast some

---

## 4. Colorização do Grafo por Status

### Modificar `src/pages/GraphPage.jsx`
- No mount, ler `historicoStatus` do localStorage / AuthContext
- Se existir, passar `aprovadas` e `cursando` para `<Graph>`

### Modificar `src/components/Graph/Graph.jsx`
- Aceitar props: `aprovadasIds`, `cursandoIds`
- Nós **cursando**: cor de destaque (verde `#22c55e` com glow)
- Nós **aprovadas**: cor apagada/muted (`#475569` com opacidade reduzida)
- Demais: cor normal por semestre

---

## 5. Resumo de Arquivos

| Arquivo | Ação |
|---|---|
| `src/services/api.js` | Criar |
| `src/contexts/AuthContext.jsx` | Criar |
| `src/components/Auth/AuthModal.jsx` | Criar |
| `src/components/Auth/ChangePasswordModal.jsx` | Criar |
| `src/components/Profile/ProfileMenu.jsx` | Criar |
| `src/components/Upload/UploadToast.jsx` | Criar |
| `src/App.jsx` | Modificar |
| `src/pages/HomePage.jsx` | Modificar |
| `src/pages/GraphPage.jsx` | Modificar |
| `src/components/Graph/Graph.jsx` | Modificar |

Nenhuma dependência nova necessária — `axios` já está no `package.json`.
