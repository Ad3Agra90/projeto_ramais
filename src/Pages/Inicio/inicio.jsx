import { useEffect, useState } from 'react';
import axios from 'axios';
import S from './inicio.module.scss';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

export default function Inicio({ loggedUser }) {
  const [ramais, setRamais] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('todos'); // 'todos', 'ocupados', 'disponiveis'

  useEffect(() => {
    carregarRamais();
  }, []);

  const carregarRamais = async () => {
    try {
      const response = await api.get('/ramais');
      console.log('Ramais fetched:', response.data);
      setRamais(response.data);
    } catch (error) {
      console.error('Erro ao buscar ramais:', error);
    }
  };

  const fazerLogin = async (id) => {
    try {
      if (!loggedUser) {
        alert('Por favor, faça login primeiro.');
        return;
      }
      await api.post(`/ramais/login/${id}`, { usuario: loggedUser });
      carregarRamais();
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  const fazerLogout = async (id) => {
    try {
      const senha = prompt('Digite a senha para logout:');
      if (senha !== '1234') {
        alert('Senha incorreta.');
        return;
      }
      await api.post(`/ramais/logout/${id}`);
      carregarRamais();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const ramaisFiltrados = ramais.filter(r => {
    const filtroTexto = r.numero.includes(filtro) || (r.usuario && r.usuario.toLowerCase().includes(filtro.toLowerCase()));
    if (statusFiltro === 'ocupados') {
      return filtroTexto && r.usuario !== null;
    } else if (statusFiltro === 'disponiveis') {
      return filtroTexto && r.usuario === null;
    } else {
      return filtroTexto;
    }
  });

  return (
    <main className={S.container}>
      <h2>Lista de Ramais</h2>

      <div className={S.filtros}>
        <input
          type="text"
          placeholder="Buscar ramal ou usuário..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <div className={S['status-filtros']}>
          <button
            className={statusFiltro === 'todos' ? S.active : ''}
            onClick={() => setStatusFiltro('todos')}
          >
            Todos
          </button>
          <button
            className={statusFiltro === 'ocupados' ? S.active : ''}
            onClick={() => setStatusFiltro('ocupados')}
          >
            Ramais Ocupados
          </button>
          <button
            className={statusFiltro === 'disponiveis' ? S.active : ''}
            onClick={() => setStatusFiltro('disponiveis')}
          >
            Ramais Disponíveis
          </button>
        </div>
      </div>

      <table className={S['tabela-ramais']}>
        <thead>
          <tr>
            <th>Ramal</th>
            <th>Usuário</th>
            <th>Status</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {ramaisFiltrados.length > 0 ? (
            ramaisFiltrados.map(ramal => (
              <tr key={ramal.id}>
                <td>{ramal.numero}</td>
                <td>{ramal.usuario || '---'}</td>
                <td>
                  {ramal.logado ? (
                    <span className={S['status-logado']}>Logado</span>
                  ) : (
                    <span className={S['status-disponivel']}>Disponível</span>
                  )}
                </td>
                <td>
                  {ramal.logado ? (
                    <button className={`${S.btn} ${S.logout}`} onClick={() => fazerLogout(ramal.id)}>Logout</button>
                  ) : (
                    <button className={`${S.btn} ${S.login}`} onClick={() => fazerLogin(ramal.id)}>Login</button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4">Nenhum ramal encontrado.</td></tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
