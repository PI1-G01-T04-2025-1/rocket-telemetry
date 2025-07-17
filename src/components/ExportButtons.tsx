'use client';

import { Button } from '@/components/ui/button';
import { FileDown, FileText } from 'lucide-react';
import { exportToCSV } from '@/services/export';
import { useState } from 'react';
import { RefObject } from 'react';

interface ExportButtonsProps {
  launchData: any; // Changed from LaunchDataForExport to any as it's no longer exported
  disabled?: boolean;
  altitudeChartRef?: RefObject<HTMLDivElement>;
  trajectoryChartRef?: RefObject<HTMLDivElement>;
}

export function ExportButtons({ launchData, disabled = false, altitudeChartRef, trajectoryChartRef }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    try {
      // Esconder todos os botões de exportação
      const exportButtons = document.querySelectorAll('[data-export-button]');
      exportButtons.forEach(button => {
        (button as HTMLElement).style.display = 'none';
      });
      
      // Aguardar um pouco para o DOM atualizar
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Simular Ctrl+P (abrir janela de impressão)
      window.print();
      
      // Restaurar os botões após um delay
      setTimeout(() => {
        exportButtons.forEach(button => {
          (button as HTMLElement).style.display = '';
        });
      }, 10);
    } catch (error) {
      alert('Erro ao exportar PDF. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      await exportToCSV(launchData);
    } catch (error) {
      alert('Erro ao exportar CSV. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex gap-2" data-export-button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportPDF}
        disabled={disabled || isExporting}
        isLoading={isExporting}
        data-export-button
      >
        <FileText className="h-4 w-4 mr-2" />
        Exportar PDF
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportCSV}
        disabled={disabled || isExporting}
        isLoading={isExporting}
        data-export-button
      >
        <FileDown className="h-4 w-4 mr-2" />
        Exportar CSV
      </Button>
    </div>
  );
} 