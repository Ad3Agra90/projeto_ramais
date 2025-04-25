import React, { useEffect, useState } from 'react';
import axios from 'axios';
import S from './configuracao.module.scss';

export default function Configuracao({ loggedUser }) {
  const [range, setRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const api = axios.create({
    baseURL: 'http://localhost:8080/api'
  });

  useEffect(() => {
    fetchRange();
  }, []);

  const fetchRange = async () => {
    try {
      const response = await api.get('/range');
      setRange({ start: response.data.start, end: response.data.end });
    } catch (error) {
      console.error('Erro ao buscar range:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRange(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const startNum = parseInt(range.start);
      const endNum = parseInt(range.end);
      if (isNaN(startNum) || isNaN(endNum) || startNum > endNum) {
        setMessage('Por favor, insira um intervalo válido.');
        setLoading(false);
        return;
      }
      await api.post('/range', { start: startNum, end: endNum, user: loggedUser });
      setMessage('Intervalo salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar range:', error);
      setMessage('Erro ao salvar intervalo.');
    }
    setLoading(false);
  };

  if (!loggedUser) {
    return (
      <main className={S.container}>
        <h2>Configurações de Ramais</h2>
        <p>Você precisa estar logado para acessar esta página.</p>
      </main>
    );
  }

  return (
    <main className={S.container}>
      <h2>Configurações de Ramais</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Início do intervalo:
          <input
            type="number"
            name="start"
            value={range.start}
            onChange={handleChange}
            required
            className={S.input}
          />
        </label>
        <label>
          Fim do intervalo:
          <input
            type="number"
            name="end"
            value={range.end}
            onChange={handleChange}
            required
            className={S.input}
          />
        </label>
        <button type="submit" disabled={loading} className={S.button}>
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
      {message && <p className={S.message}>{message}</p>}
    </main>
  );
}
