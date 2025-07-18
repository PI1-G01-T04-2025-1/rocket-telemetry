import { render, screen } from '@testing-library/react';
import { DetailsView } from '../Details/index';
import React from 'react';

jest.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
  useRouter: () => ({ back: jest.fn() }),
}));

jest.mock('@/hooks/react-query/useLaunchData', () => ({
  useLaunchData: () => ({
    isFetching: false,
    data: {
      rocket: { name: 'Foguete XPTO' },
      expectedDistance: 150,
      pressure: 2.5,
      water: 300,
      collectedData: {
        distance: 120.5,
        averageSpeed: 40,
        timeToReach: 6,
      },
    },
  }),
}));

describe('CT08 - Detalhes do lançamento', () => {
  it('deve exibir os dados do lançamento corretamente', async () => {
    render(<DetailsView />);

    expect(
      screen.getByText(/Lançamento #1 - Foguete XPTO/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Distância esperada/i)).toBeInTheDocument();
    expect(screen.getByText(/150m/i)).toBeInTheDocument();
    expect(screen.getByText(/300ml/i)).toBeInTheDocument();
    expect(screen.getByText(/2.5psi/i)).toBeInTheDocument();
  });
});

describe('CT05 - Validar coleta de dados do ESP (mock)', () => {
  it('deve exibir os dados coletados do ESP corretamente', async () => {
    render(<DetailsView />);
    // Verifica se os dados coletados aparecem na tela
    expect(screen.getByText(/Distância percorrida/i)).toBeInTheDocument();
    expect(screen.getByText(/120.50m/i)).toBeInTheDocument();
    expect(screen.getByText(/Velocidade média/i)).toBeInTheDocument();
    expect(screen.getByText(/40/i)).toBeInTheDocument();
    expect(screen.getByText(/Tempo de percurso/i)).toBeInTheDocument();
    expect(screen.getByText(/6/i)).toBeInTheDocument();
  });
});
