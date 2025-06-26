import { Button } from '@/components/ui/button';

export const HomeView = () => {
  return (
    <div className='mx-4 md:mx-auto md:max-w-7xl'>
      <div className='flex min-h-[70px] w-full items-center justify-between'>
        <h1 className='scroll-m-20 text-center font-(family-name:--font-itim) text-4xl tracking-tight text-balance'>
          Oasis Rocket
        </h1>
        <nav>
          <Button>Hello World!</Button>
        </nav>
      </div>
    </div>
  );
};
