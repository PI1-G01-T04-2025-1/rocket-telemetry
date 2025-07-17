// src/services/rocket/create-launch.test.ts
import { createRocketLaunch } from '../rocket/create-launch';
import { api } from '@/lib';

jest.mock('@/lib', () => ({
  api: {
    post: jest.fn(),
  },
}));

describe('CT07 - Enviar dados para criar lançamento', () => {
  it('deve enviar os dados corretos para a API', async () => {
    const mockLaunchData = {
      rocketId: '123',
      expectedDistance: 150,
      pressure: 2.5,
      water: 300,
    };

    (api.post as jest.Mock).mockResolvedValue({ data: { success: true } });

    const response = await createRocketLaunch(mockLaunchData);

    expect(api.post).toHaveBeenCalledWith(
      '/rocket/123/launches/new',
      mockLaunchData,
    );
    expect(response.data.success).toBe(true);
  });
});
