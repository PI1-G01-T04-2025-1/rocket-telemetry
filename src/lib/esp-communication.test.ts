// @jest-environment node
import { ESPCommunicationService } from './esp-communication';

describe('ESPCommunicationService (integração real com mock server)', () => {
  const service = new ESPCommunicationService('http://localhost:8080');

  it('deve buscar dados de telemetria do mock server e validar formato', async () => {
    const data = await service.fetchTelemetryData();
    expect(data).toHaveProperty('records');
    expect(Array.isArray(data.records)).toBe(true);
    expect(data.records.length).toBeGreaterThan(0);
    expect(data.records[0]).toHaveProperty('t');
    expect(data.records[0]).toHaveProperty('g');
    expect(typeof data.records[0].g).toBe('string');
  });
});

describe('Reconexão após falha com ESP (CT04)', () => {
  it('deve tentar reconectar após falha de comunicação', async () => {
    const service = new ESPCommunicationService('http://localhost:8080');

    // Primeira chamada: simula falha
    const spy = jest.spyOn(service, 'checkConnection');
    spy.mockRejectedValueOnce(new Error('ESP offline'));
    spy.mockResolvedValueOnce(true);

    // Primeira tentativa: falha
    await expect(service.checkConnection()).rejects.toThrow('ESP offline');

    // Segunda tentativa: sucesso
    await expect(service.checkConnection()).resolves.toBe(true);
  });
}); 