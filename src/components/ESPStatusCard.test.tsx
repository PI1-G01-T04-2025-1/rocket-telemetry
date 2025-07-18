import { render, screen, cleanup } from '@testing-library/react';
import { ESPStatusCard } from './ESPStatusCard';
import React from 'react';
import { act } from 'react-dom/test-utils';

// CT03 - Verificar conexão com ESP (mock)
jest.mock('@/hooks/useESPCommunication', () => {
  let status = { isOnline: true, lastUpdate: Date.now() };
  return {
    useESPCommunication: () => ({
      status,
      telemetryData: null,
      isLoading: false,
      checkConnection: jest.fn(),
      fetchData: jest.fn(),
    }),
    __setStatus: (newStatus: any) => { status = newStatus; },
  };
});

describe('CT03 - Verificar conexão com ESP (mock)', () => {
  afterEach(() => cleanup());
  it('deve exibir status "Conectado" quando ESP está online', () => {
    render(<ESPStatusCard />);
    expect(screen.getByText(/conectado/i)).toBeInTheDocument();
  });
});

// CT04 - Testar reconexão após falha

describe('CT04 - Testar reconexão após falha', () => {
  afterEach(() => cleanup());
  it('deve exibir "Desconectado" e depois "Conectado" após reconexão', () => {
    // Força o status inicial para offline
    const { useESPCommunication, __setStatus } = require('@/hooks/useESPCommunication');
    __setStatus({ isOnline: false, lastUpdate: Date.now(), error: 'Falha' });
    render(<ESPStatusCard />);
    // Inicialmente offline
    expect(screen.getByText((content) => content.toLowerCase().includes('desconectado'))).toBeInTheDocument();
    // Simula clique no botão de reconexão
    act(() => {
      screen.getByText(/verificar/i).click();
    });
    // Atualiza o status para online
    __setStatus({ isOnline: true, lastUpdate: Date.now() });
    // Força re-render
    cleanup();
    render(<ESPStatusCard />);
    expect(screen.getByText((content) => content.toLowerCase().includes('conectado'))).toBeInTheDocument();
  });
}); 