import { createRocketLaunch } from './create-launch';

jest.mock('@/lib/http/api', () => ({
  api: {
    post: jest.fn(),
  },
}));
import { api } from '@/lib/http/api';

// Novo: mock do espService
jest.mock('@/lib/esp-communication', () => ({
  espService: {
    fetchTelemetryData: jest.fn(),
  },
}));
import { espService } from '@/lib/esp-communication';

describe('createRocketLaunch (fluxo de criação de lançamento)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar lançamento com dados válidos', async () => {
    // Mock do ESP com dados válidos
    (espService.fetchTelemetryData as jest.Mock).mockResolvedValueOnce({
      records: [
        { t: 1, g: '$GPGGA,215611.00,1559.39153,S,04802.66657,W,1,08,1.02,1231.9,M,-11.7,M,,*45' },
        { t: 2, g: '$GPGGA,215612.00,1559.39149,S,04802.66671,W,1,08,1.02,1232.0,M,-11.7,M,,*46' },
      ],
    });
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { success: true, message: 'Launch created successfully' }, status: 201 });
    const result = await createRocketLaunch({ rocketId: '1', expectedDistance: 10, pressure: 2, water: 100 });
    expect(result.data.success).toBe(true);
    expect(result.data.message).toMatch(/successfully/);
    expect(api.post).toHaveBeenCalledWith('/rocket/1/launches/new', {
      rocketId: '1',
      expectedDistance: 10,
      pressure: 2,
      water: 100,
    });
  });

  it('deve retornar erro se fetchTelemetryData retornar null', async () => {
    (espService.fetchTelemetryData as jest.Mock).mockResolvedValueOnce(null);
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch telemetry data'));
    await expect(createRocketLaunch({ rocketId: '1', expectedDistance: 10, pressure: 2, water: 100 })).rejects.toThrow('Failed to fetch telemetry data');
  });

  it('deve retornar erro se fetchTelemetryData retornar objeto vazio', async () => {
    (espService.fetchTelemetryData as jest.Mock).mockResolvedValueOnce({});
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('Error formatting ESP data'));
    await expect(createRocketLaunch({ rocketId: '1', expectedDistance: 10, pressure: 2, water: 100 })).rejects.toThrow('Error formatting ESP data');
  });

  it('deve retornar erro se fetchTelemetryData retornar records null', async () => {
    (espService.fetchTelemetryData as jest.Mock).mockResolvedValueOnce({ records: null });
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('Error formatting ESP data'));
    await expect(createRocketLaunch({ rocketId: '1', expectedDistance: 10, pressure: 2, water: 100 })).rejects.toThrow('Error formatting ESP data');
  });

  it('deve retornar erro se fetchTelemetryData retornar records vazio', async () => {
    (espService.fetchTelemetryData as jest.Mock).mockResolvedValueOnce({ records: [] });
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('Error formatting ESP data'));
    await expect(createRocketLaunch({ rocketId: '1', expectedDistance: 10, pressure: 2, water: 100 })).rejects.toThrow('Error formatting ESP data');
  });

  it('deve retornar erro se fetchTelemetryData retornar records malformados', async () => {
    (espService.fetchTelemetryData as jest.Mock).mockResolvedValueOnce({ records: [{ t: 1, g: 'invalid' }] });
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('Error formatting ESP data'));
    await expect(createRocketLaunch({ rocketId: '1', expectedDistance: 10, pressure: 2, water: 100 })).rejects.toThrow('Error formatting ESP data');
  });

  it('deve retornar erro com dados inválidos (validação manual)', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('Validation error'));
    await expect(createRocketLaunch({ rocketId: '1', expectedDistance: -1, pressure: 0, water: 'abc' as any })).rejects.toThrow('Validation error');
    expect(api.post).toHaveBeenCalledWith('/rocket/1/launches/new', expect.any(Object));
  });
}); 