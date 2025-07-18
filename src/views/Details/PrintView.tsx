import React, { forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartLineDots } from './LineChart';

interface PrintViewProps {
  data: any;
  altitude: Array<{ time: number; altitude: number }>;
  trajectoryData: Array<{ lat: number; lon: number }>;
  latitudeData: Array<{ time: number; latitude: number }>;
  longitudeData: Array<{ time: number; longitude: number }>;
}

const metricCards = [
  { key: 'expectedDistance', label: 'Distância esperada', format: (v: any) => `${v}m` },
  { key: 'distance', label: 'Distância percorrida', format: (v: any) => `${v?.toFixed(2) || 0}m` },
  { key: 'pressure', label: 'Pressão', format: (v: any) => `${v || 0}psi` },
  { key: 'averageSpeed', label: 'Velocidade média', format: (v: any) => `${v?.toFixed(2) || 0}m/s` },
  { key: 'timeToReach', label: 'Tempo de percurso', format: (v: any) => `${v || 0}s` },
  { key: 'water', label: 'Quantidade de água', format: (v: any) => `${v || 0}ml` },
];

export const PrintView = forwardRef<HTMLDivElement, PrintViewProps>(({ data, altitude, trajectoryData, latitudeData, longitudeData }, ref) => {
  return (
    <div ref={ref} className="w-full px-8 py-8 bg-white">
      <h1 className="text-4xl font-bold text-center mb-8">Relatório de Lançamento</h1>
      {/* Cards de métricas em 2 colunas centralizadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
        {metricCards.map((card, idx) => (
          <Card key={card.key} className="flex-1 min-w-[220px]">
            <CardHeader>
              <CardTitle>{card.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-center text-3xl font-semibold">
                {card.key === 'distance' || card.key === 'averageSpeed' || card.key === 'timeToReach'
                  ? card.format(data?.collectedData?.[card.key])
                  : card.format(data?.[card.key])}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Gráficos em linha horizontal centralizada */}
      <div className="flex flex-row gap-4 justify-center items-start w-full max-w-6xl mx-auto">
        <div className="flex-1 min-w-0 max-w-[32%]">
          <ChartLineDots
            title="Altitude em relação ao tempo"
            description="Gráfico de altitude em relação ao tempo"
            chartData={altitude}
            dataKey="altitude"
            xAxisDataKey="time"
            xAxisTickFormatter={(value: number) => `${value}s`}
            yAxisDataKey="altitude"
            yAxisTickFormatter={(value: number) => `${value}m`}
            chartConfig={{
              altitude: {
                color: 'var(--chart-1)',
                label: 'Altitude',
              },
            }}
          />
        </div>
        <div className="flex-1 min-w-0 max-w-[32%]">
          <ChartLineDots
            title="Latitude em relação ao tempo"
            description="Gráfico de latitude em relação ao tempo"
            chartData={latitudeData}
            dataKey="latitude"
            xAxisDataKey="time"
            xAxisTickFormatter={(value: number) => `${value}s`}
            yAxisDataKey="latitude"
            yAxisTickFormatter={(value: number) => `${value}`}
            chartConfig={{
              latitude: {
                color: 'var(--chart-3)',
                label: 'Latitude',
              },
            }}
          />
        </div>
        <div className="flex-1 min-w-0 max-w-[32%]">
          <ChartLineDots
            title="Longitude em relação ao tempo"
            description="Gráfico de longitude em relação ao tempo"
            chartData={longitudeData}
            dataKey="longitude"
            xAxisDataKey="time"
            xAxisTickFormatter={(value: number) => `${value}s`}
            yAxisDataKey="longitude"
            yAxisTickFormatter={(value: number) => `${value}`}
            chartConfig={{
              longitude: {
                color: 'var(--chart-4)',
                label: 'Longitude',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
});

PrintView.displayName = 'PrintView'; 