import { NextResponse } from 'next/server';
import { testESPConnection } from '@/lib/esp-communication';

export async function GET() {
  console.log('[ESP STATUS API] Verificando status do ESP...');

  try {
    const result = await testESPConnection();

    console.log(
      `[ESP STATUS API] Status verificado: ${result.isOnline ? 'Online' : 'Offline'}`,
    );

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao verificar status do ESP:', error);

    return NextResponse.json(
      {
        success: false,
        isOnline: false,
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
