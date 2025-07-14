import { NextResponse } from 'next/server';
import { espService } from '@/lib/esp-communication';
import { GPGPADto } from '@/lib/telemetry-calculator/utils';

export async function GET() {
  try {
    const data = await espService.fetchTelemetryData();

    return NextResponse.json({
      success: true,
      data: data.records.map((item: { t: number; g: string }) => ({
        t: item.t,
        g: item.g,
        formated: GPGPADto(item.g),
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao buscar dados do ESP:', error);

    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      if (
        errorMessage.includes('econnreset') ||
        errorMessage.includes('connection reset') ||
        errorMessage.includes('connection reset by peer')
      ) {
        return NextResponse.json({
          success: true,
          message: 'Dados recebidos (conexão resetada)',
          data: null,
          timestamp: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
