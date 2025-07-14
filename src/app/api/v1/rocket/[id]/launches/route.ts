import { prisma } from '@/lib';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const data = await prisma.rocket.findFirst({
    where: { id: Number(id) },
    include: {
      lancamentos: true,
    },
  });

  if (!data) {
    return new Response(
      JSON.stringify({
        error: 'Rocket not found',
      }),
      {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  return new Response(
    JSON.stringify({
      id: data.id,
      name: data.nome,
      pesoZfw: data.peso_zfw,
      launches: data.lancamentos,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}
