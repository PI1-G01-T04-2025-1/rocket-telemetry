import AxiosMockAdapter from 'axios-mock-adapter';
import { ESPCommunicationService } from '../esp-communication';

describe('ESPCommunicationService (mock com axios-mock-adapter)', () => {
  let service: ESPCommunicationService;
  let mock: AxiosMockAdapter;

  beforeEach(() => {
    service = new ESPCommunicationService('http://localhost:8080');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mock = new AxiosMockAdapter((service as any).axiosInstance);
  });

  afterEach(() => {
    mock.restore();
  });

  it('deve buscar dados de telemetria e validar formato', async () => {
    const mockData = {
      records: [
        { t: 1, g: '1.5' },
        { t: 2, g: '1.6' },
      ],
    };

    // Intercepta o endpoint usado em `fetchTelemetryData`, por padrão é '/data.json'
    mock.onGet('/data.json').reply(200, mockData);

    const data = await service.fetchTelemetryData();

    expect(data).toHaveProperty('records');
    expect(Array.isArray(data.records)).toBe(true);
    expect(data.records[0]).toHaveProperty('t');
    expect(data.records[0]).toHaveProperty('g');
  });

  it('CT04 - deve tentar reconectar após falha de comunicação', async () => {
    // Intercepta o endpoint usado em `checkConnection`, por padrão é '/data.json'
    mock
      .onGet('/data.json')
      .replyOnce(500) // primeira tentativa falha
      .onGet('/data.json')
      .replyOnce(200, {}); // segunda tentativa sucesso

    const result1 = await service.checkConnection(); // tenta 3 vezes
    expect(result1).toBe(true);
  });
});
