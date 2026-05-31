import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../services/api';

const TOKEN_KEY = 'roadusp_token';
const USER_KEY = 'roadusp_user';
const HISTORICO_KEY = 'roadusp_historico';

const AuthContext = createContext(null);

function loadFromStorage(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => localStorage.getItem(USER_KEY));
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [historicoStatus, setHistoricoStatusState] = useState(() => loadFromStorage(HISTORICO_KEY));

  const isLoggedIn = !!token;

  const setHistoricoStatus = useCallback((status) => {
    setHistoricoStatusState(status);
    try {
      if (status) {
        localStorage.setItem(HISTORICO_KEY, JSON.stringify(status));
      } else {
        localStorage.removeItem(HISTORICO_KEY);
      }
    } catch {}
  }, []);

  const login = useCallback(async (email, senha) => {
    const response = await api.post('/api/v1/conta/login', { email, senha });
    const newToken = response.data.token;
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, email);
    setToken(newToken);
    setUser(email);
  }, []);

  const register = useCallback(async (email, senha) => {
    await api.post('/api/v1/conta/criar', { email, senha });
    await login(email, senha);
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(HISTORICO_KEY);
    setToken(null);
    setUser(null);
    setHistoricoStatusState(null);
  }, []);

  const changePassword = useCallback(async (email, senhaAntiga, novaSenha) => {
    await api.patch('/api/v1/conta/alterar', { email, senha_antiga: senhaAntiga, nova_senha: novaSenha });
  }, []);

  const uploadHistory = useCallback(async (file) => {
    const formData = new FormData();
    formData.append('arquivo', file);
    const response = await api.post('/api/v1/conta/upload/historico', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.processamento_id;
  }, []);

  const pollProcessing = useCallback(async (processamentoId) => {
    const response = await api.get(`/api/v1/conta/processamento/${processamentoId}`);
    return response.data;
  }, []);

  const fetchPreferences = useCallback(async () => {
    const response = await api.get('/api/v1/conta/preferencias');
    return response.data;
  }, []);

  const savePreferences = useCallback(async (unidade, curso) => {
    await api.patch('/api/v1/conta/preferencias', { unidade, curso });
  }, []);

  const fetchHistorico = useCallback(async () => {
    try {
      const response = await api.get('/api/v1/conta/historico');
      const { aprovadas, cursando } = response.data;
      setHistoricoStatus({ aprovadas: aprovadas || [], cursando: cursando || [] });
    } catch {}
  }, [setHistoricoStatus]);

  useEffect(() => {
    if (isLoggedIn) fetchHistorico();
  }, [isLoggedIn, fetchHistorico]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        historicoStatus,
        login,
        register,
        logout,
        changePassword,
        uploadHistory,
        pollProcessing,
        setHistoricoStatus,
        fetchPreferences,
        savePreferences,
        fetchHistorico,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
