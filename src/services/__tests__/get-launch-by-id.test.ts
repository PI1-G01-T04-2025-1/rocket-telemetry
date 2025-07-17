import { getLaunch, Response } from '../rocket/get-launch-by-id';
import { api } from '@/lib/http';

jest.mock('@/lib/http', () => ({
  api: {
    get: jest.fn(),
  },
}));

describe('CT07 - Buscar lançamento por ID', () => {
  it('deve chamar a API com os parâmetros corretos e retornar os dados', async () => {
    const rocketId = 1;
    const launchId = 42;

    const mockResponse: Response = {
      id: launchId,
      rocketId: rocketId,
      rocket: {
        id: rocketId,
        name: 'Foguete XPTO',
        zfw: 10,
      },
      angle: 45,
      pressure: 2.5,
      water: 300,
      expectedDistance: 150,
      collectedData: {
        id: 10,
        rawData: 'telemetria bruta',
        distance: 120,
        maxAltitude: 60,
        averageSpeed: 40,
        timeToReach: 5,
      },
      createdAt: new Date().toISOString(),
    };

    (api.get as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await getLaunch({ rocketId, launchId });

    expect(api.get).toHaveBeenCalledWith(
      `/rocket/${rocketId}/launches/${launchId}`,
    );
    expect(result).toEqual(mockResponse);
  });
});
