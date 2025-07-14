import { ESPStatusCard } from '@/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Teste ESP - Oásis Rocket',
  description: 'Teste de comunicação com o ESP',
};

export default function ESPTestPage() {
  return (
    <div className='mx-4 md:mx-auto md:max-w-7xl'>
      <div className='flex min-h-[70px] w-full items-center justify-between'>
        <h1 className='scroll-m-20 text-center font-(family-name:--font-itim) text-4xl tracking-tight text-balance'>
          Oasis Rocket
        </h1>
      </div>

      <div className='mt-8'>
        <h2 className='scroll-m-20 border-b pb-2 text-3xl font-bold tracking-tight first:mt-0'>
          Teste de comunicação com servidor embarcado
        </h2>

        <div className='mt-6'>
          <p className='mb-6 text-gray-600'>
            Esta página permite testar a comunicação com o ESP. O ESP deve estar
            configurado para servir dados em{' '}
            <code className='rounded bg-gray-100 px-2 py-1'>
              http://192.168.4.1/data.json
            </code>
          </p>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            <ESPStatusCard />

            <div className='space-y-4'>
              <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
                <h3 className='mb-2 font-medium text-blue-800'>
                  📡 Endpoints da API
                </h3>
                <div className='space-y-1 text-sm text-blue-700'>
                  <div>
                    <code>GET /api/esp/status</code> - Status da conexão
                  </div>
                  <div>
                    <code>GET /api/esp/data</code> - Buscar dados do ESP32
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
