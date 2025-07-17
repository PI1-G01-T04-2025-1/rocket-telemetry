import { saveAs } from 'file-saver';

export interface LaunchDataForExport {
  id: number;
  rocketId: number;
  rocket: {
    id: number;
    name: string;
    zfw: number;
  };
  angle: number;
  pressure: number;
  water: number;
  expectedDistance: number;
  collectedData: {
    id: number;
    distance: number | null;
    maxAltitude: number | null;
    averageSpeed: number | null;
    timeToReach: number | null;
    rawData: string;
  } | null;
  createdAt: string;
}

export const exportToCSV = async (launchData: LaunchDataForExport): Promise<void> => {
  // Cabeçalho principal
  const csvLines = [
    'Relatório de Lançamento',
    '',
    `Lançamento #${launchData.id}`,
    `Foguete: ${launchData.rocket.name}`,
    `Data: ${new Date(launchData.createdAt).toLocaleDateString('pt-BR')}`,
    '',
  ];

  // Dados do lançamento
  csvLines.push('Dados do Lançamento');
  csvLines.push('Parâmetro,Valor');
  csvLines.push(`Distância Esperada,${launchData.expectedDistance}m`);
  csvLines.push(`Pressão,${launchData.pressure}psi`);
  csvLines.push(`Quantidade de Água,${launchData.water}ml`);
  csvLines.push(`Ângulo,${launchData.angle}°`);
  csvLines.push('');

  // Dados coletados (se disponível)
  if (launchData.collectedData) {
    csvLines.push('Dados Coletados');
    csvLines.push('Parâmetro,Valor');
    csvLines.push(`Distância Percorrida,${launchData.collectedData.distance?.toFixed(2) || 'N/A'}m`);
    csvLines.push(`Altura Máxima,${launchData.collectedData.maxAltitude?.toFixed(2) || 'N/A'}m`);
    csvLines.push(`Velocidade Média,${launchData.collectedData.averageSpeed?.toFixed(2) || 'N/A'}m/s`);
    csvLines.push(`Tempo de Percurso,${launchData.collectedData.timeToReach || 'N/A'}s`);
    csvLines.push('');
  }

  // Dados GPS brutos (se disponível)
  if (launchData.collectedData?.rawData) {
    try {
      const rawData = JSON.parse(launchData.collectedData.rawData);
      const gpsRecords = rawData.records || [];
      
      if (gpsRecords.length > 0) {
        csvLines.push('Dados GPS');
        csvLines.push('Ponto,Timestamp,Dados NMEA');
        
        gpsRecords.forEach((record: any, index: number) => {
          csvLines.push(`${index + 1},${record.t || 'N/A'},"${record.g || 'N/A'}"`);
        });
        
        csvLines.push('');
      }
    } catch (error) {
      csvLines.push('Erro ao processar dados GPS');
      csvLines.push('');
    }
  }

  // Metadados
  csvLines.push('Metadados');
  csvLines.push('Campo,Valor');
  csvLines.push(`ID do Lançamento,${launchData.id}`);
  csvLines.push(`ID do Foguete,${launchData.rocketId}`);
  csvLines.push(`Nome do Foguete,"${launchData.rocket.name}"`);
  csvLines.push(`Peso ZFW,${launchData.rocket.zfw}kg`);
  csvLines.push(`Data de Criação,"${launchData.createdAt}"`);
  csvLines.push(`Data de Exportação,"${new Date().toISOString()}"`);

  // Converter para CSV
  const csvContent = csvLines.join('\n');
  
  // Criar blob e salvar
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `lancamento-${launchData.id}-${new Date().toISOString().split('T')[0]}.csv`);
}; 