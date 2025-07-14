'use client';

import { CreateRocketLaunchDialog, RocketLaunchesTable } from '@/components';
import { Skeleton } from '@/components/ui/skeleton';
import { useRocketLaunchesData } from '@/hooks/react-query/useRocketLaunchesData';
import { RocketLaunchesResponse } from '@/services/rocket/get-launches';

export const HomeView = () => {
  /**
   * NOTE: Hardcoded rocketId, bcs we dont have multiple rockets, so aways get rocket from seeded db data, where default rocket id = 1
   *
   * ~ David
   */
  const { data, isFetching } = useRocketLaunchesData('1');

  const formatToTableItems = (data: RocketLaunchesResponse['launches']) => {
    return data.map((launch) => ({
      id: launch.id,
      details: launch.id,
      distance: -1,
      averageSpeed: -1,
      pressure: launch.pressure,
      date: launch.createdAt,
    }));
  };

  return (
    <div className='mx-4 md:mx-auto md:max-w-7xl'>
      <div className='flex min-h-[70px] w-full items-center justify-between'>
        <h1 className='scroll-m-20 text-center font-(family-name:--font-itim) text-4xl tracking-tight text-balance'>
          Oasis Rocket
        </h1>
        <nav>
          <CreateRocketLaunchDialog />
        </nav>
      </div>

      <section className='mt-8'>
        <h2 className='scroll-m-20 border-b pb-2 text-3xl font-bold tracking-tight first:mt-0'>
          Relatório de Lançamentos
        </h2>
        <div className='mt-4'>
          {isFetching ? (
            <div className='grid gap-4'>
              <div className='col-span-12 grid max-w-xl grid-cols-12 gap-2'>
                <Skeleton className='col-span-2 h-[50px]' />
                <Skeleton className='col-span-4 h-[50px]' />
                <Skeleton className='col-span-4 h-[50px]' />
                <Skeleton className='col-span-2 h-[50px]' />
              </div>
              <Skeleton className='col-span-12 h-[200px]' />
            </div>
          ) : (
            <RocketLaunchesTable
              data={formatToTableItems(data?.launches || [])}
            />
          )}
        </div>
      </section>
    </div>
  );
};
