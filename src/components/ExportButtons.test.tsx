import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExportButtons } from './ExportButtons';
import { exportToCSV } from '@/services/export';

jest.mock('@/services/export', () => ({
  exportToCSV: jest.fn(),
}));

const mockPrint = jest.fn();
Object.defineProperty(window, 'print', {
  value: mockPrint,
  writable: true,
});

const mockLaunchData = {
  id: 1,
  rocketId: 1,
  rocket: {
    id: 1,
    name: 'Foguete Teste',
    zfw: 1000,
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
    rawData: '{"records": []}'
  },
  createdAt: '2024-01-01T10:00:00Z'
};

describe('ExportButtons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar botões de exportação', () => {
    render(<ExportButtons launchData={mockLaunchData} />);
    expect(screen.getByText('Exportar PDF')).toBeInTheDocument();
    expect(screen.getByText('Exportar CSV')).toBeInTheDocument();
  });

  it('deve chamar window.print quando botão PDF for clicado', async () => {
    render(<ExportButtons launchData={mockLaunchData} />);
    const pdfButton = screen.getByText('Exportar PDF');
    fireEvent.click(pdfButton);
    await waitFor(() => {
      expect(mockPrint).toHaveBeenCalled();
    });
  });

  it('deve chamar exportToCSV quando botão CSV for clicado', async () => {
    const mockExportToCSV = exportToCSV as jest.MockedFunction<typeof exportToCSV>;
    mockExportToCSV.mockResolvedValue();
    render(<ExportButtons launchData={mockLaunchData} />);
    const csvButton = screen.getByText('Exportar CSV');
    fireEvent.click(csvButton);
    await waitFor(() => {
      expect(mockExportToCSV).toHaveBeenCalledWith(mockLaunchData);
    });
  });

  it('deve desabilitar botões quando disabled for true', () => {
    render(<ExportButtons launchData={mockLaunchData} disabled={true} />);
    const pdfButton = screen.getByText('Exportar PDF');
    const csvButton = screen.getByText('Exportar CSV');
    expect(pdfButton).toBeDisabled();
    expect(csvButton).toBeDisabled();
  });

  it('deve mostrar loading durante exportação PDF', async () => {
    mockPrint.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<ExportButtons launchData={mockLaunchData} />);
    const pdfButton = screen.getByText('Exportar PDF');
    fireEvent.click(pdfButton);
    await waitFor(() => {
      expect(pdfButton).toBeDisabled();
    });
  });

  it('deve lidar com erro na exportação PDF', async () => {
    mockPrint.mockImplementation(() => { throw new Error('Erro de impressão'); });
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<ExportButtons launchData={mockLaunchData} />);
    const pdfButton = screen.getByText('Exportar PDF');
    fireEvent.click(pdfButton);
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Erro ao exportar PDF. Tente novamente.');
    });
    mockAlert.mockRestore();
  });

  it('deve lidar com erro na exportação CSV', async () => {
    const mockExportToCSV = exportToCSV as jest.MockedFunction<typeof exportToCSV>;
    mockExportToCSV.mockRejectedValue(new Error('Erro de exportação'));
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<ExportButtons launchData={mockLaunchData} />);
    const csvButton = screen.getByText('Exportar CSV');
    fireEvent.click(csvButton);
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Erro ao exportar CSV. Tente novamente.');
    });
    mockAlert.mockRestore();
  });
}); 