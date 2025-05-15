import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import S from './inicio.module.scss';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

function RamalBusyModal({ onReturn }) {
  return (
    <div className={S.modalBackdrop}>
      <div className={S.modalContent}>
        <h2>Ramal Ocupado</h2>
        <p>Infelizmente, o ramal está ocupado.</p>
        <button onClick={onReturn}>Voltar para consulta de ramais</button>
      </div>
    </div>
  );
}

export default function Inicio({ loggedUser }) {
  const [ramais, setRamais] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('todos'); // 'todos', 'ocupados', 'disponiveis'
  const [busyModalOpen, setBusyModalOpen] = useState(false);
  const stompClient = useRef(null);

  useEffect(() => {
    carregarRamais();
  }, []);

  useEffect(() => {
    // Setup WebSocket connection
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.current.subscribe('/topic/ramais', (message) => {
          const updatedRamal = JSON.parse(message.body);
          setRamais(prevRamais => {
            const index = prevRamais.findIndex(r => r.id === updatedRamal.id);
            if (index !== -1) {
              const newRamais = [...prevRamais];
              newRamais[index] = updatedRamal;
              return newRamais;
            } else {
              return [...prevRamais, updatedRamal];
            }
          });
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      }
    });
    stompClient.current.activate();

    // Cleanup on unmount
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, []);

  const carregarRamais = async () => {
    try {
      const response = await api.get('/extensions');
      console.log('Extensions fetched:', response.data);
      setRamais(response.data);
    } catch (error) {
      console.error('Erro ao buscar extensions:', error);
    }
  };

  const fazerLogin = async (id) => {
    try {
      if (!loggedUser) {
        alert('Por favor, faça login primeiro.');
        return;
      }
      // Update ramais before login attempt
      await carregarRamais();
      const ramal = ramais.find(r => r.id === id);
      if (ramal && ramal.logged_user) {
        alert('O ramal que você está tentando logar está ocupado. Por favor, tente outro.');
        setBusyModalOpen(true);
        return;
      }
      await api.post(`/extensions/login/${id}`, { user: loggedUser });
      carregarRamais();
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  const handleRamalClick = async (id) => {
    // Store clicked ramal id for login attempt
    const clickedRamalId = id;
    // Update ramais list
    await carregarRamais();
    const ramal = ramais.find(r => r.id === clickedRamalId);
    if (ramal && ramal.logged_user) {
      setBusyModalOpen(true);
    } else {
      fazerLogin(clickedRamalId);
    }
  };

  const fazerLogout = async (id) => {
    try {
      // Update ramais before logout attempt
      await carregarRamais();
      const ramal = ramais.find(r => r.id === id);
      if (ramal && ramal.user === loggedUser) {
        await api.post(`/extensions/logout/${id}`);
        carregarRamais();
        return;
      }
      if (ramal && ramal.user !== loggedUser) {
        const senha = prompt('Digite a senha para logout:');
        if (senha !== '1234') {
          alert('Senha incorreta.');
          return;
        }
        await api.post(`/extensions/logout/${id}`);
        carregarRamais();
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleReturn = () => {
    setBusyModalOpen(false);
  };

  const ramaisFiltrados = ramais
    .filter(r => {
      const filtroTexto = r.extension_number.includes(filtro) || (r.user && r.user.toLowerCase().includes(filtro.toLowerCase()));
      if (statusFiltro === 'ocupados') {
        return filtroTexto && r.user !== null;
      } else if (statusFiltro === 'disponiveis') {
        return filtroTexto && r.user === null;
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
                <td>{ramal.extension_number}</td>
                <td>{ramal.user || '---'}</td>
                <td>
                  {ramal.logged_user ? (
                    <span className={S['status-logado']}>Logado</span>
                  ) : (
                    <span className={S['status-disponivel']}>Disponível</span>
                  )}
                </td>
                <td>
                  {ramal.logged_user ? (
                    <button className={`${S.btn} ${S.logout}`} onClick={() => fazerLogout(ramal.id)}>Logout</button>
                  ) : (
                    <button className={`${S.btn} ${S.login}`} onClick={() => handleRamalClick(ramal.id)}>Login</button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4">Nenhum ramal encontrado.</td></tr>
          )}
        </tbody>
      </table>
      {busyModalOpen && <RamalBusyModal onReturn={handleReturn} />}
    </main>
  );
}
