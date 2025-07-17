import { getLaunches, RocketLaunchesResponse } from '../rocket/get-launches';
import { api } from '@/lib/http';

jest.mock('@/lib/http', () => ({
  api: {
    get: jest.fn(),
  },
}));

describe('CT07 - Buscar lançamentos do foguete', () => {
  it('deve chamar a API com rocketId e retornar dados formatados', async () => {
    const rocketId = 123;

    const mockApiResponse = {
      id: rocketId,
      name: 'Foguete XPTO',
      pesoZfw: 10,
      launches: [
        {
          id: '1',
          fogueteId: rocketId,
          dataHora: '2024-10-01T10:00:00Z',
          angulo: 45,
          pressao: 2.5,
          qtdAgua: 300,
          distanciaEsperada: 150,
        },
      ],
    };

    (api.get as jest.Mock).mockResolvedValue({ data: mockApiResponse });

    const result = await getLaunches({ rocketId });

    const expected: RocketLaunchesResponse = {
      id: rocketId,
      name: 'Foguete XPTO',
      zfw: 10,
      launches: [
        {
          id: '1',
          rocketId: rocketId,
          createdAt: '2024-10-01T10:00:00Z',
          angle: 45,
          pressure: 2.5,
          water: 300,
          expectedDistance: 150,
        },
      ],
    };

    expect(api.get).toHaveBeenCalledWith(`/rocket/${rocketId}/launches`);
    expect(result).toEqual(expected);
  });
});
