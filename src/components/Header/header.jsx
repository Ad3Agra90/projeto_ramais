import { useState } from 'react';
import logo from '../../assets/img/logo.png';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Inicio from '../../Pages/Inicio/inicio';
import Configuracao from '../../Pages/Configuracao/configuracao';
import PageLog from '../../Pages/PageLog/pagelog';
import S from './header.module.scss';

function LoginModal({ onClose, onLogin, initialName }) {
  const [name, setName] = useState(initialName || '');

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

export default function Header() {
  const [userName, setUserName] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const handleLoginClick = () => {
    setLoginModalOpen(true);
  };

  const handleLogoutClick = () => {
    setUserName('');
  };

  const handleLogin = (name) => {
    setUserName(name);
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
            <li><Link to="/PageLog ">Log do Sistema</Link></li>
          </ul>
        </nav>
        <div className={S.loginArea}>
          {userName ? (
            <div className={S.userInfo}>
              <span role="img" aria-label="user">👤</span> {userName}
              <button className={S.logoutButton} onClick={handleLogoutClick} title="Logout">Logout</button>
            </div>
          ) : (
            <button className={S.loginButton} onClick={handleLoginClick} title="Clique para fazer login">
              <span role="img" aria-label="user">👤</span> Login
            </button>
          )}
        </div>
      </header>
      {loginModalOpen && (
        <LoginModal
          onClose={() => setLoginModalOpen(false)}
          onLogin={handleLogin}
          initialName={userName}
        />
      )}
      <Routes>
        <Route path="/" element={<Inicio loggedUser={userName} />} />
        <Route path="/configuracao" element={<Configuracao loggedUser={userName} />} />
        <Route path="/pagelog" element={<PageLog loggedUser={userName} />} />
      </Routes>
    </BrowserRouter>
  );
}
