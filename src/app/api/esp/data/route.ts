import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.ESP_BASE_URL || 'http://localhost:8080';
  const url = `${baseUrl}/data.json`;

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
