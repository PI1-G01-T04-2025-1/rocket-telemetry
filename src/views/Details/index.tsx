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
import { GPGPADto, convertCordinateToDecimal } from '@/lib/telemetry-calculator/utils';
import { api } from '@/lib/http/api';

export const DetailsView = () => {
  const router = useRouter();
  const { id } = useParams();
  const { data, isFetching } = useLaunchData({
    rocketId: String(1),
    launchId: String(id),
  });

  let altitude: { time: number; altitude: number }[] = [];
  const rawData = data?.collectedData?.rawData;
  if (rawData) {
    try {
      const parsed = JSON.parse(rawData);
      altitude = parsed.records
        .map((rec: any, idx: number) => {
          try {
            const parsedG = GPGPADto(rec.g);
            return {
              time: Number(idx),
              altitude: Number(parsedG.altitude),
            };
          } catch {
            return null;
          }
        })
        .filter(Boolean) as { time: number; altitude: number }[];
    } catch {}
  }

  // Monta dados reais de trajetória GPS a partir do rawData
  let trajectoryData: { lat: number; lon: number }[] = [];
  if (rawData) {
    try {
      const parsed = JSON.parse(rawData);
      trajectoryData = parsed.records
        .map((rec: any) => {
          try {
            const parsedG = GPGPADto(rec.g);
            const lat = Number(convertCordinateToDecimal(parsedG.lat[0], parsedG.lat[1]));
            const lon = Number(convertCordinateToDecimal(parsedG.lon[0], parsedG.lon[1]));
            return { lat, lon };
          } catch {
            return null;
          }
        })
        .filter(Boolean) as { lat: number; lon: number }[];
    } catch {}
  }

  // Monta dados reais de longitude ao longo do tempo
  let longitudeData: { time: number; longitude: number }[] = [];
  if (rawData) {
    try {
      const parsed = JSON.parse(rawData);
      longitudeData = parsed.records
        .map((rec: any, idx: number) => {
          try {
            const parsedG = GPGPADto(rec.g);
            const lon = Number(convertCordinateToDecimal(parsedG.lon[0], parsedG.lon[1]));
            return { time: Number(idx), longitude: lon };
          } catch {
            return null;
          }
        })
        .filter(Boolean) as { time: number; longitude: number }[];
    } catch {}
  }

  // Monta dados reais de latitude ao longo do tempo
  let latitudeData: { time: number; latitude: number }[] = [];
  if (rawData) {
    try {
      const parsed = JSON.parse(rawData);
      latitudeData = parsed.records
        .map((rec: any, idx: number) => {
          try {
            const parsedG = GPGPADto(rec.g);
            const lat = Number(convertCordinateToDecimal(parsedG.lat[0], parsedG.lat[1]));
            return { time: Number(idx), latitude: lat };
          } catch {
            return null;
          }
        })
        .filter(Boolean) as { time: number; latitude: number }[];
    } catch {}
  }

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
            <PrintView data={data} altitude={altitude} trajectoryData={trajectoryData} latitudeData={latitudeData} longitudeData={longitudeData} />
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
                <Button
                  variant='destructive'
                  size='sm'
                  data-exclude-print
                  onClick={async () => {
                    if (!data) return;
                    if (!window.confirm('Tem certeza que deseja excluir este lançamento?')) return;
                    try {
                      await api.delete(`/rocket/${data.rocketId}/launches/${data.id}`);
                      alert('Lançamento excluído com sucesso!');
                      router.push('/');
                    } catch (err: any) {
                      alert('Erro ao excluir lançamento: ' + (err?.response?.data?.message || err.message));
                    }
                  }}
                >
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
                  value={`${Number(data?.collectedData.distance || 0).toFixed(2)}m`}
                />
                <CardSampleInfo
                  title='Pressão'
                  value={`${data?.pressure || 0}psi`}
                />
                <CardSampleInfo
                  title='Velocidade média'
                  value={`${Number(data?.collectedData.averageSpeed || 0).toFixed(2)}m/s`}
                />
                <CardSampleInfo
                  title='Tempo de percurso'
                  value={`${Number(data?.collectedData.timeToReach || 0)}s`}
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
              </section>

              {/* Gráfico de longitude em relação ao tempo */}
              <section className='mt-8 grid grid-cols-12 gap-4'>
                <div className='col-span-4'>
                  <ChartLineDots
                    title='Longitude em relação ao tempo'
                    description='Gráfico de longitude em relação ao tempo'
                    chartData={longitudeData}
                    dataKey='longitude'
                    xAxisDataKey='time'
                    xAxisTickFormatter={(value) => Number(value).toFixed(0) + 's'}
                    yAxisDataKey='longitude'
                    yAxisTickFormatter={(value) => Number(value).toFixed(6)}
                    chartConfig={{
                      longitude: {
                        color: 'var(--chart-4)',
                        label: 'Longitude',
                      },
                    }}
                  />
                </div>
              </section>

              {/* Gráfico de latitude em relação ao tempo */}
              <section className='mt-8 grid grid-cols-12 gap-4'>
                <div className='col-span-4'>
                <ChartLineDots
                    title='Latitude em relação ao tempo'
                    description='Gráfico de latitude em relação ao tempo'
                    chartData={latitudeData}
                    dataKey='latitude'
                  xAxisDataKey='time'
                    xAxisTickFormatter={(value) => Number(value).toFixed(0) + 's'}
                    yAxisDataKey='latitude'
                    yAxisTickFormatter={(value) => Number(value).toFixed(6)}
                  chartConfig={{
                      latitude: {
                      color: 'var(--chart-3)',
                        label: 'Latitude',
                    },
                  }}
                />
                </div>
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
