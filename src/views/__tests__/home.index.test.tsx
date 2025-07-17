import { render, screen } from '@testing-library/react';
import { HomeView } from '../Home/index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Criação do QueryClient dentro do escopo do teste para evitar cache entre testes
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

jest.mock('@/hooks/react-query/useRocketLaunchesData', () => ({
  useRocketLaunchesData: () => ({
    isFetching: false,
    data: {
      launches: [
        {
          id: '1',
          rocketId: 1,
          createdAt: '2024-10-01T10:00:00Z',
          angle: 45,
          pressure: 2.5,
          water: 300,
          expectedDistance: 150,
        },
      ],
    },
  }),
}));

jest.mock('@/components', () => ({
  ...jest.requireActual('@/components'),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RocketLaunchesTable: ({ data }: any) => (
    <div>
      <p>mock tabela</p>
      <span>{data[0]?.id}</span>
    </div>
  ),
}));

describe('CT08 - Página inicial com tabela de lançamentos', () => {
  it('deve exibir a tabela de lançamentos com os dados', () => {
    const queryClient = createTestQueryClient(); // garante isolamento

    render(
      <QueryClientProvider client={queryClient}>
        <HomeView />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Oasis Rocket/i)).toBeInTheDocument();
    expect(screen.getByText(/Relatório de Lançamentos/i)).toBeInTheDocument();
    expect(screen.getByText(/mock tabela/i)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
