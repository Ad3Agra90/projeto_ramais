import { useState } from 'react';
import axios from 'axios';
import S from './pagelog.module.scss'; 

export default function Pagelog() {
  const [authorized, setAuthorized] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);

  const api = axios.create({
    baseURL: 'http://localhost:8080/api'
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === '1234') {
      setAuthorized(true);
      setShowLoginModal(false);
      fetchLogs();
    } else {
      setError('Usuário ou senha incorretos');
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await api.get('/logs');
      setLogs(response.data);
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
    }
  };

  if (showLoginModal) {
    const handleBackdropClick = () => {
      setShowLoginModal(false);
    };

    const handleModalContentClick = (e) => {
      e.stopPropagation();
    };

    return (
      <div className={S.modalBackdrop} onClick={handleBackdropClick}>
        <div className={S.modalContent} onClick={handleModalContentClick}>
          <h2>Login Admin</h2>
          <form onSubmit={handleLoginSubmit}>
            <input
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <main className={S.container}>
        <h2>Log de Alterações</h2>
        <p>Você não tem autorização para acessar essa página</p>
      </main>
    );
  }

  return (
    <main className={S.container}>
      <h2>Logs de Alterações</h2>
      {logs.length === 0 ? (
        <p>Nenhum log encontrado.</p>
      ) : (
        <table className={S['tabela-log']}>
          <thead>
            <tr>
              <th>Data e Hora</th>
              <th>Usuário</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.user}</td>
                <td>{log.actionDescription}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
