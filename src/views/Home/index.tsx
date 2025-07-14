import { CreateRocketLaunchDialog, RocketLaunchesTable } from '@/components';

export const HomeView = () => {
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
          <RocketLaunchesTable />
        </div>
      </section>
    </div>
  );
};
