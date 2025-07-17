'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeftIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { ChartLineDots } from './LineChart';
import { useLaunchData } from '@/hooks/react-query/useLaunchData';
import { Skeleton } from '@/components/ui/skeleton';
import { exportToCSV } from '@/services/export';
import { PrintView } from './PrintView';

export const DetailsView = () => {
  const router = useRouter();
  const { id } = useParams();
  const { data, isFetching } = useLaunchData({
    rocketId: String(1),
    launchId: String(id),
  });

  const altitude = [
    { time: 0, altitude: 0 },
    { time: 1, altitude: 5 },
    { time: 2, altitude: 10 },
    { time: 3, altitude: 5 },
    { time: 4, altitude: 0 },
  ];

  const trajectoryData = [
    { lat: -15.9894098, lon: -48.0270285 },
    { lat: -15.9894022, lon: -48.0270245 },
    { lat: -15.989395, lon: -48.0270205 },
    { lat: -15.9893878, lon: -48.0270165 },
    { lat: -15.9893805, lon: -48.0270125 },
    { lat: -15.9893732, lon: -48.0270085 },
    { lat: -14.9893659, lon: -48.0270045 },
    { lat: -14.9893587, lon: -48.0270005 },
    { lat: -15.9893514, lon: -48.0269965 },
    { lat: -15.9893441, lon: -48.0269925 },
  ];

  const [showPrintView, setShowPrintView] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (showPrintView) {
      // Aguarda o DOM renderizar a PrintView antes de chamar print
      setTimeout(() => {
        window.print();
      }, 1700);
    }
  }, [showPrintView]);

  const handleExportCSV = async () => {
    if (isExporting || !data) return;
    setIsExporting(true);
    try {
      await exportToCSV(data);
    } catch (error) {
      alert('Erro ao exportar CSV. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className='mx-4 md:mx-auto md:max-w-7xl'>
      {/* Modal de impressão */}
      {showPrintView && (
        <div
          className='fixed inset-0 z-50 bg-white flex items-center justify-center print:static print:bg-white print:block'
          style={{ minHeight: '100vh', minWidth: '100vw' }}
        >
          <div className='absolute top-4 right-4 print:hidden'>
            <Button variant='outline' size='sm' onClick={() => setShowPrintView(false)}>
              Fechar
            </Button>
            <Button
              variant='default'
              size='sm'
              className='ml-2'
              onClick={() => {
                window.print();
              }}
            >
              Imprimir / Salvar PDF
            </Button>
          </div>
          <div className='w-full max-w-5xl mx-auto print:w-full print:max-w-full'>
            <PrintView data={data} altitude={altitude} trajectoryData={trajectoryData} />
          </div>
        </div>
      )}

      {/* O resto da DetailsView só aparece se não estiver na PrintView */}
      {!showPrintView && (
        <>
          <div className='flex min-h-[70px] w-full items-center justify-between'>
            <h1 className='scroll-m-20 text-center font-(family-name:--font-itim) text-4xl tracking-tight text-balance'>
              Oasis Rocket
            </h1>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Button
                variant='outline'
                size='icon'
                className='size-8'
                onClick={() => router.back()}
                data-exclude-print
              >
                <ChevronLeftIcon />
              </Button>
              {isFetching ? (
                <Skeleton className='h-8 w-36' />
              ) : (
                <h2 className='text-2xl font-semibold tracking-tight'>
                  Lançamento #{id} - {data?.rocket.name || 'Rocket Name'}
                </h2>
              )}
            </div>
            {isFetching ? (
              <Skeleton className='h-8 w-36' />
            ) : (
              <div className='flex gap-2'>
                {data && (
                  <>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setShowPrintView(true)}
                      data-export-button
                    >
                      Exportar PDF
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={handleExportCSV}
                      disabled={isExporting}
                      isLoading={isExporting}
                      data-export-button
                    >
                      Exportar CSV
                    </Button>
                  </>
                )}
                <Button variant='destructive' size='sm' data-exclude-print>
                  Excluir Lançamento
                </Button>
              </div>
            )}
          </div>

          {isFetching ? (
            <DataSkeleton />
          ) : (
            <>
              <section className='mt-8 grid grid-cols-12 gap-4'>
                <CardSampleInfo
                  title='Distância esperada'
                  value={`${data?.expectedDistance}m`}
                />
                <CardSampleInfo
                  title='Distância percorrida'
                  value={`${data?.collectedData.distance?.toFixed(2) || 0}m`}
                />
                <CardSampleInfo
                  title='Pressão'
                  value={`${data?.pressure || 0}psi`}
                />
                <CardSampleInfo
                  title='Velocidade média'
                  value={`${data?.collectedData.averageSpeed?.toFixed(2) || 0}m/s`}
                />
                <CardSampleInfo
                  title='Tempo de percurso'
                  value={`${data?.collectedData.timeToReach || 0}s`}
                />
                <CardSampleInfo
                  title='Quantidade de água'
                  value={`${data?.water || 0}ml`}
                />
              </section>

              <section className='mt-8 grid grid-cols-12 gap-4'>
                <div className='col-span-4'>
                  <ChartLineDots
                    title='Altitude em relação ao tempo'
                    description='Gráfico de altitude em relação ao tempo'
                    chartData={altitude}
                    dataKey='altitude'
                    xAxisDataKey='time'
                    xAxisTickFormatter={(value: number) => `${value}s`}
                    yAxisDataKey='altitude'
                    yAxisTickFormatter={(value: number) => `${value}m`}
                    chartConfig={{
                      altitude: {
                        color: 'var(--chart-1)',
                        label: 'Altitude',
                      },
                    }}
                  />
                </div>
                <div className='col-span-4'>
                  <ChartLineDots
                    title='Trajetória GPS'
                    description='Gráfico da trajetória GPS do lançamento 2D (latitude e longitude)'
                    chartData={trajectoryData}
                    dataKey='lat'
                    xAxisDataKey='lon'
                    yAxisDataKey='lat'
                    chartConfig={{
                      lat: {
                        color: 'var(--chart-5)',
                        label: 'Latitude',
                      },
                    }}
                  />
                </div>
                <ChartLineDots
                  title='Altitude em relação ao tempo'
                  description='Gráfico de altitude em relação ao tempo'
                  chartData={altitude}
                  dataKey='altitude'
                  xAxisDataKey='time'
                  xAxisTickFormatter={(value: number) => `${value}s`}
                  yAxisDataKey='altitude'
                  yAxisTickFormatter={(value: number) => `${value}m`}
                  chartConfig={{
                    altitude: {
                      color: 'var(--chart-3)',
                      label: 'Altitude',
                    },
                  }}
                />
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
};

const CardSampleInfo = ({ title, value }: { title: string; value: string }) => {
  return (
    <Card className='col-span-3'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className='text-center text-3xl font-semibold'>{value}</h3>
      </CardContent>
    </Card>
  );
};

const DataSkeleton = () => {
  return (
    <>
      <div className='mt-8 grid grid-cols-12 gap-4'>
        <Skeleton className='col-span-3 h-28' />
        <Skeleton className='col-span-3 h-28' />
        <Skeleton className='col-span-3 h-28' />
        <Skeleton className='col-span-3 h-28' />
        <Skeleton className='col-span-3 h-28' />
        <Skeleton className='col-span-3 h-28' />
        <Skeleton className='col-span-3 h-28' />
        <Skeleton className='col-span-3 h-28' />
      </div>
      <div className='mt-8 grid grid-cols-12 gap-4'>
        <Skeleton className='col-span-4 h-[300px]' />
        <Skeleton className='col-span-4 h-[300px]' />
        <Skeleton className='col-span-4 h-[300px]' />
      </div>
    </>
  );
};
