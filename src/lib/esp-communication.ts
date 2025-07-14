import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';

// Serviço para comunicação com o ESP
export class ESPCommunicationService {
  private axiosInstance: AxiosInstance;
  private maxRetries: number;
  private retryDelay: number;

  constructor(
    // Descomente a linha abaixo para usar o IP do ESP!!!
    // baseURL: string = 'http://192.168.4.1',

    // Comente a linha abaixo ao usar o IP do ESP
    baseURL: string = 'http://localhost:8080',

    maxRetries: number = 3,
    retryDelay: number = 1000,
    timeout: number = 10000,
  ) {
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;

    this.axiosInstance = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.log('Axios error:', {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          statusText: error.response?.statusText,
        });
        return Promise.reject(error);
      },
    );
  }

  private async makeRequest<T>(
    endpoint: string,
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    let lastError: AxiosError | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response: AxiosResponse<T> = await this.axiosInstance.request({
          url: endpoint,
          ...config,
        });

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        lastError = axiosError;

        // Verificar se é um erro de conexão resetada
        if (this.isConnectionResetError(axiosError)) {
          console.log(
            `Tentativa ${attempt}: Conexão resetada pelo ESP (normal)`,
          );

          if (attempt === this.maxRetries) {
            throw error;
          }
        } else {
          console.error(`Tentativa ${attempt} falhou:`, {
            message: axiosError.message,
            code: axiosError.code,
            status: axiosError.response?.status,
          });

          if (attempt === this.maxRetries) {
            throw error;
          }
        }

        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    throw lastError || new Error('Todas as tentativas falharam');
  }

  private isConnectionResetError(error: AxiosError): boolean {
    const errorMessage = error.message.toLowerCase();
    const errorCode = error.code?.toLowerCase();

    return (
      errorMessage.includes('econnreset') ||
      errorMessage.includes('connection reset') ||
      errorMessage.includes('connection reset by peer') ||
      errorMessage.includes('network error') ||
      errorMessage.includes('fetch failed') ||
      errorCode === 'econnreset' ||
      errorCode === 'ecanceled' ||
      error.response?.status === 0
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Verificar se o ESP está online
  async checkConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/data.json', {
        method: 'GET',
      });
      return true;
    } catch (error) {
      console.error('ESP não está acessível:', error);
      return false;
    }
  }

  // Buscar dados de telemetria do ESP
  async fetchTelemetryData(): Promise<any> {
    return this.makeRequest('/data.json', {
      method: 'GET',
    });
  }
}

export const espService = new ESPCommunicationService();

export async function testESPConnection(): Promise<{
  isOnline: boolean;
  responseTime?: number;
  error?: string;
}> {
  try {
    const startTime = Date.now();
    const result = await espService.checkConnection();
    const responseTime = Date.now() - startTime;

    return {
      isOnline: result,
      responseTime,
    };
  } catch (error) {
    return {
      isOnline: false,
      error: (error as Error).message,
    };
  }
}
