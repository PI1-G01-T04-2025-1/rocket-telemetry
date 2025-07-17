import { exportToCSV, type LaunchDataForExport } from './export-to-csv';

// Mock do file-saver
jest.mock('file-saver', () => ({
  saveAs: jest.fn()
}));

describe('exportToCSV', () => {
  const mockLaunchData: LaunchDataForExport = {
    id: 1,
    rocketId: 1,
    rocket: {
      id: 1,
      name: 'Foguete Teste',
      zfw: 1000
    },
    angle: 45,
    pressure: 2.5,
    water: 100,
    expectedDistance: 50,
    collectedData: {
      id: 1,
      distance: 48.5,
      maxAltitude: 25.3,
      averageSpeed: 12.1,
      timeToReach: 4.0,
      rawData: JSON.stringify({
        records: [
          { t: 1, g: '$GPGGA,215611.00,1559.39153,S,04802.66657,W,1,08,1.02,1231.9,M,-11.7,M,,*45' },
          { t: 2, g: '$GPGGA,215612.00,1559.39149,S,04802.66671,W,1,08,1.02,1232.0,M,-11.7,M,,*46' }
        ]
      })
    },
    createdAt: '2024-01-01T10:00:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve gerar CSV com dados completos do lançamento', async () => {
    await exportToCSV(mockLaunchData);
    
    const { saveAs } = require('file-saver');
    expect(saveAs).toHaveBeenCalledWith(
      expect.any(Blob),
      expect.stringMatching(/lancamento-1-\d{4}-\d{2}-\d{2}\.csv/)
    );
  });

  it('deve gerar CSV com dados mínimos quando collectedData é null', async () => {
    const minimalData: LaunchDataForExport = {
      ...mockLaunchData,
      collectedData: null
    };

    await exportToCSV(minimalData);
    
    const { saveAs } = require('file-saver');
    expect(saveAs).toHaveBeenCalled();
  });

  it('deve lidar com dados GPS inválidos', async () => {
    const invalidGPSData: LaunchDataForExport = {
      ...mockLaunchData,
      collectedData: {
        ...mockLaunchData.collectedData!,
        rawData: 'invalid json'
      }
    };

    // Não deve lançar erro
    await expect(exportToCSV(invalidGPSData)).resolves.not.toThrow();
  });

  it('deve incluir cabeçalho correto no CSV', async () => {
    await exportToCSV(mockLaunchData);
    
    const { saveAs } = require('file-saver');
    const blob = saveAs.mock.calls[0][0];
    
    // Verifica se o blob contém o cabeçalho esperado
    const text = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsText(blob);
    });
    expect(text).toContain('Relatório de Lançamento');
    expect(text).toContain('Dados do Lançamento');
    expect(text).toContain('Dados Coletados');
  });

  it('deve incluir metadados no CSV', async () => {
    await exportToCSV(mockLaunchData);
    
    const { saveAs } = require('file-saver');
    const blob = saveAs.mock.calls[0][0];
    const text = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsText(blob);
    });
    
    expect(text).toContain('Metadados');
    expect(text).toContain('ID do Lançamento,1');
    expect(text).toContain('Nome do Foguete,"Foguete Teste"');
  });

  it('deve formatar valores numéricos corretamente', async () => {
    await exportToCSV(mockLaunchData);
    
    const { saveAs } = require('file-saver');
    const blob = saveAs.mock.calls[0][0];
    const text = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsText(blob);
    });
    
    expect(text).toContain('Distância Esperada,50m');
    expect(text).toContain('Pressão,2.5psi');
    expect(text).toContain('Quantidade de Água,100ml');
  });
}); 