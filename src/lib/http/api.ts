import axios from 'axios';

// Configuração simples para desenvolvimento
const baseUrl = 'http://localhost:3001';

export const api = axios.create({
  baseURL: `${baseUrl}/api/v1`,
});
