'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeftIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { ChartLineDots } from './LineChart';
import { useLaunchData } from '@/hooks/react-query/useLaunchData';
import { Skeleton } from '@/components/ui/skeleton';

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

  return (
    <div className='mx-4 md:mx-auto md:max-w-7xl'>
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
          <div>
            <Button variant='destructive' size='sm'>
              Excluir Lançamento
            </Button>
          </div>
        )}
      </div>

      {isFetching ? (
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
      ) : (
        <>
          <section className='mt-8 grid grid-cols-12 gap-4'>
            <CardSampleInfo title='Distância percorrida' value='20 metros' />
            <CardSampleInfo title='Pressão' value='1.2psi' />
            <CardSampleInfo title='Velocidade média' value='2m/s' />
            <CardSampleInfo title='Tempo de percurso' value='10s' />
            <CardSampleInfo
              title='Quantidade de água'
              value={`${data?.water || 0}ml`}
            />
          </section>

          <section className='mt-8 grid grid-cols-12 gap-4'>
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
            <ChartLineDots
              title='Trajetória GPS'
              description='Gráfico da trajetória GPS do lançamento 2D (latitude e longitude)'
              chartData={trajectoryData}
              dataKey='lat'
              xAxisDataKey='lon'
              // xAxisTickFormatter={(value: number) => `${value}s`}
              yAxisDataKey='lat'
              // yAxisTickFormatter={(value: number) => `${value}m`}
              chartConfig={{
                lat: {
                  color: 'var(--chart-5)',
                  label: 'Latitude',
                },
              }}
            />
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
