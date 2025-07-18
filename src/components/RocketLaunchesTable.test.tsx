import { render, screen } from '@testing-library/react';
import { RocketLaunchesTable } from './RocketLaunchesTable';
import React from 'react';

describe('CT07 - Verificar salvamento de dados no banco (mock)', () => {
  it('deve exibir múltiplos lançamentos na tabela', () => {
    const mockData = [
      {
        id: '1',
        distance: 100,
        water: 200,
        pressure: 2.5,
        date: '2024-07-15T10:00:00Z',
        details: '1',
      },
      {
        id: '2',
        distance: 120,
        water: 250,
        pressure: 3.0,
        date: '2024-07-16T11:00:00Z',
        details: '2',
      },
      {
        id: '3',
        distance: 140,
        water: 300,
        pressure: 3.5,
        date: '2024-07-17T12:00:00Z',
        details: '3',
      },
    ];
    render(<RocketLaunchesTable data={mockData} />);
    // Verifica se cada ID aparece pelo menos uma vez
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2').length).toBeGreaterThan(0);
    expect(screen.getAllByText('3').length).toBeGreaterThan(0);
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('140')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('250')).toBeInTheDocument();
    expect(screen.getByText('300')).toBeInTheDocument();
  });
}); 