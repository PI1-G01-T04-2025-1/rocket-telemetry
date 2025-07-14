import { useState, useCallback } from 'react';
import { espService } from '@/lib/esp-communication';

interface ESPStatus {
  isOnline: boolean;
  responseTime?: number;
  error?: string;
  lastUpdate?: string;
}

interface TelemetryData {
  records: Array<{
    t: number;
    g: string;
  }>;
}

interface UseESPCommunicationReturn {
  status: ESPStatus;
  telemetryData: TelemetryData | null;
  isLoading: boolean;

  checkConnection: () => Promise<void>;
  fetchData: () => Promise<void>;
}

export function useESPCommunication(): UseESPCommunicationReturn {
  const [status, setStatus] = useState<ESPStatus>({
    isOnline: false,
  });

  const [telemetryData, setTelemetryData] = useState<TelemetryData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  // verificar conexão
  const checkConnection = useCallback(async () => {
    setIsLoading(true);

    try {
      const result = await espService.checkConnection();
      setStatus({
        isOnline: result,
        lastUpdate: new Date().toISOString(),
      });
    } catch (error) {
      setStatus({
        isOnline: false,
        error: (error as Error).message,
        lastUpdate: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // buscar dados
  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await espService.fetchTelemetryData();
      setTelemetryData(data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    status,
    telemetryData,
    isLoading,
    checkConnection,
    fetchData,
  };
}
