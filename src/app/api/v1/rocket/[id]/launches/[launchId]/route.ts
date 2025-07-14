import { prisma } from '@/lib';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; launchId: string }> },
) {
  const { id, launchId } = await params;

  const data = await prisma.launch.findFirst({
    where: {
      id: Number(launchId),
      fogueteId: Number(id),
    },
    include: {
      foguete: true,
      dados_coletados: {
        select: {
          id: true,
          alturaMaxima: true,
          distancia: true,
          tempoDePercurso: true,
          velocidadeMedia: true,
          rawData: true,
        },
      },
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
      rocketId: data.fogueteId,
      rocket: {
        id: data.foguete.id,
        name: data.foguete.nome,
        zfw: data.foguete.peso_zfw,
      },
      angle: data.angulo,
      pressure: data.pressao,
      water: data.qtdAgua,
      expectedDistance: data.distanciaEsperada,
      collectedData:
        data.dados_coletados.length > 0
          ? {
              id: data.dados_coletados[0].id,
              distance: data.dados_coletados[0].distancia,
              maxAltitude: data.dados_coletados[0].alturaMaxima,
              averageSpeed: data.dados_coletados[0].velocidadeMedia,
              timeToReach: data.dados_coletados[0].tempoDePercurso,
              rawData: data.dados_coletados[0].rawData,
            }
          : null,
      createdAt: data.dataHora,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}
