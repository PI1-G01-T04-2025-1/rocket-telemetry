'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useESPCommunication } from '@/hooks';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Activity,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { useEffect } from 'react';

export function ESPStatusCard() {
  const { status, telemetryData, isLoading, checkConnection, fetchData } =
    useESPCommunication();

  // verificar conexão ao montar o componente (a cada 10 segundos)
  useEffect(() => {
    checkConnection();

    const interval = setInterval(() => {
      checkConnection();
    }, 10000);

    return () => clearInterval(interval);
  }, [checkConnection]);

  const getStatusIcon = () => {
    if (isLoading) return <RefreshCw className='h-4 w-4 animate-spin' />;
    if (status.isOnline) return <Wifi className='h-4 w-4 text-green-500' />;
    return <WifiOff className='h-4 w-4 text-red-500' />;
  };

  const getStatusText = () => {
    if (isLoading) return 'Verificando...';
    if (status.isOnline) return 'Conectado';
    return 'Desconectado';
  };

  const getStatusColor = () => {
    if (isLoading) return 'text-yellow-600';
    if (status.isOnline) return 'text-green-600';
    return 'text-red-600';
  };

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Activity className='h-5 w-5' />
          Status do ESP
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center justify-between'>
          <span className='text-sm font-medium'>Conexão:</span>
          <div className='flex items-center gap-2'>
            {getStatusIcon()}
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {status.lastUpdate && (
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>Última atualização:</span>
            <div className='flex items-center gap-1'>
              <Clock className='h-3 w-3' />
              <span className='text-xs text-gray-500'>
                {new Date(status.lastUpdate).toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}

        {status.error && (
          <div className='flex items-center gap-2 rounded-md bg-red-50 p-2'>
            <AlertTriangle className='h-4 w-4 text-red-500' />
            <span className='text-xs text-red-700'>{status.error}</span>
          </div>
        )}

        {telemetryData && (
          <div className='rounded-md bg-blue-50 p-3'>
            <h4 className='mb-2 text-sm font-medium text-blue-900'>
              Dados do ESP32
            </h4>
            <div className='space-y-1 text-xs text-blue-700'>
              <div>Registros: {telemetryData.records?.length || 0}</div>
              <div>
                Último timestamp: {telemetryData.records?.[0]?.t || 'N/A'}
              </div>
            </div>
          </div>
        )}

        <div className='flex flex-wrap gap-2'>
          <Button
            size='sm'
            variant='outline'
            onClick={checkConnection}
            disabled={isLoading}
          >
            <RefreshCw
              className={`mr-1 h-3 w-3 ${isLoading ? 'animate-spin' : ''}`}
            />
            Verificar
          </Button>

          <Button
            size='sm'
            variant='outline'
            onClick={fetchData}
            disabled={isLoading || !status.isOnline}
          >
            Buscar Dados
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
