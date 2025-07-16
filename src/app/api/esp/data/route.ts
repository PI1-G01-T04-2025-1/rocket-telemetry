import { NextResponse } from 'next/server';

export async function GET() {
  const url = 'http://localhost:8080/data.json';

  try {
    const res = await fetch(url);
    const text = await res.text();

    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: 'Dados recebidos com sucesso',
      data: parsed || text,
      raw: text,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Erro ao buscar dados',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
