/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const defaultChartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-2)',
  },
  altitude: {
    label: 'Altitude',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

interface ChartLineDotsProps {
  title: string;
  description?: string;
  xAxisDataKey?: string;
  xAxisTickFormatter?: (value: any) => string;
  yAxisDataKey?: string;
  yAxisTickFormatter?: (value: any) => string;
  chartData?: Array<Record<string, number>>;
  chartConfig?: ChartConfig;
  dataKey?: string;
}

export function ChartLineDots({
  title,
  description,
  chartData,
  chartConfig,
  xAxisDataKey,
  xAxisTickFormatter,
  yAxisTickFormatter,
  yAxisDataKey,
  dataKey,
}: ChartLineDotsProps) {
  return (
    <Card className='col-span-4'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            ...defaultChartConfig,
            ...chartConfig,
          }}
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            {xAxisDataKey && (
              <XAxis
                dataKey={xAxisDataKey}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={xAxisTickFormatter}
              />
            )}
            {yAxisDataKey && (
              <YAxis
                dataKey={yAxisDataKey}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={yAxisTickFormatter}
              />
            )}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey={dataKey}
              type='natural'
              stroke={
                chartConfig ? `var(--color-${dataKey})` : 'var(--color-desktop)'
              }
              strokeWidth={2}
              dot={{
                fill: chartConfig
                  ? `var(--color-${dataKey})`
                  : 'var(--color-desktop)',
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
