import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import logo from '../../assets/img/logo.png';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Inicio from '../../Pages/Inicio/inicio';
import Configuracao from '../../Pages/Configuracao/configuracao';
import PageLog from '../../Pages/PageLog/pagelog';
import S from './header.module.scss';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

export default function Header() {
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || '';
  });
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [initialLoginName, setInitialLoginName] = useState('');
  const [ramais, setRamais] = useState([]);
  const stompClient = useRef(null);

  useEffect(() => {
    if (!userName) {
      api.post('/extensions/login/windows')
        .then(response => {
          if (response.data && response.data !== 'anonymous') {
            setInitialLoginName(response.data);
            setLoginModalOpen(true);
          }
        })
        .catch(error => {
          console.error('Erro ao tentar login automático:', error);
        });
    }
  }, [userName]);

  useEffect(() => {
    if (userName) {
      localStorage.setItem('userName', userName);
    } else {
      localStorage.removeItem('userName');
    }
  }, [userName]);

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

  const handleLogoutClick = async () => {
    if (userName) {
      try {
        await api.post(`/extensions/logoutAll/${userName}`);
      } catch (error) {
        console.error('Erro ao deslogar ramais:', error);
      }
    }
    setUserName('');
  };

  const handleLogin = (name) => {
    setUserName(name);
    setLoginModalOpen(false);
  };

  return (
    <BrowserRouter>
      <header>
        <section className={S.boxLogo}>
          <Link to="/"><img src={logo} alt="logo" /></Link>
        </section>
        <nav className={S.menu}>
          <ul>
            <li><Link to="/">Início</Link></li>
            <li><Link to="/configuracao">Configuração</Link></li>
            <li><Link to="/pagelog">Log do Sistema</Link></li>
          </ul>
        </nav>
        <div className={S.loginArea}>
          {userName ? (
            <div className={S.userInfo}>
              <span role="img" aria-label="user">👤</span> {userName}
              <button className={S.logoutButton} onClick={handleLogoutClick} title="Logout">Logout</button>
            </div>
          ) : (
            <button className={S.loginButton} onClick={() => setLoginModalOpen(true)} title="Clique para fazer login">
              <span role="img" aria-label="user">👤</span> Login
            </button>
          )}
        </div>
      </header>
      {loginModalOpen && (
        <LoginModal
          onClose={() => setLoginModalOpen(false)}
          onLogin={handleLogin}
          initialName={initialLoginName}
        />
      )}
      <Routes>
        <Route path="/" element={<Inicio loggedUser={userName} ramais={ramais} />} />
        <Route path="/configuracao" element={<Configuracao loggedUser={userName} />} />
        <Route path="/pagelog" element={<PageLog loggedUser={userName} />} />
      </Routes>
    </BrowserRouter>
  );
}

function LoginModal({ onClose, onLogin, initialName }) {
  const [name, setName] = useState(initialName || '');

  useEffect(() => {
    setName(initialName || '');
  }, [initialName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
      onClose();
    }
  };

  return (
    <div className={S.modalBackdrop}>
      <div className={S.modalContent}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Digite seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <button type="submit">Entrar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
}
