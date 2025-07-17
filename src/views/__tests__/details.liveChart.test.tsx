import { render } from '@testing-library/react';
import { ChartLineDots } from '../Details/LineChart';
import React from 'react';

describe('CT09 - Gráfico de linha de altitude', () => {
  const mockData = [
    { time: 0, altitude: 0 },
    { time: 1, altitude: 10 },
    { time: 2, altitude: 20 },
  ];

  it('deve renderizar o título do gráfico', () => {
    const { getByText } = render(
      <ChartLineDots
        title='Altitude em relação ao tempo'
        chartData={mockData}
        dataKey='altitude'
        xAxisDataKey='time'
        yAxisDataKey='altitude'
        chartConfig={{
          altitude: {
            label: 'Altitude',
            color: 'var(--chart-1)',
          },
        }}
      />,
    );

    expect(getByText(/Altitude em relação ao tempo/i)).toBeInTheDocument();
  });
});
