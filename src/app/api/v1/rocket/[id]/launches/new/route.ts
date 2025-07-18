import { prisma } from '@/lib';
import { espService } from '@/lib/esp-communication';
import {
  calculateAverageSpeed,
  diferenceInSeconds,
  GPGPADto,
  hhmmssmsToDate,
  totalDistance,
} from '@/lib/telemetry-calculator/utils';
import { NextResponse } from 'next/server';
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: rocketId } = await params;

  const body = await req.json();

  const espData = await espService.fetchTelemetryData();

  if (!espData) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch telemetry data',
      },
      { status: 500 },
    );
  }

  let espFormatedData: Array<ReturnType<typeof GPGPADto>> = [];

  try {
    espFormatedData = espData.records.map((item: { t: number; g: string }) =>
      GPGPADto(item.g),
    );
  } catch (error) {
    console.error('Error formatting ESP data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error formatting ESP data',
      },
      { status: 500 },
    );
  }

  const rocketTotalDistance = totalDistance(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    espFormatedData as unknown as any[],
  );
  const totalTime = diferenceInSeconds(
    hhmmssmsToDate(espFormatedData[0].date),
    hhmmssmsToDate(espFormatedData[espFormatedData.length - 1].date),
  );

  const data = await prisma.launch.create({
    data: {
      angulo: 45,
      distanciaEsperada: body.expectedDistance,
      pressao: body.pressure,
      qtdAgua: body.water,
      foguete: {
        connect: {
          id: Number(rocketId),
        },
      },
      dataHora: new Date().toISOString(),
    },
  });

  await prisma.colectedData.create({
    data: {
      rawData: JSON.stringify(espData),
      alturaMaxima: espFormatedData.reduce(
        (max, item) => Math.max(max, item.altitude),
        0,
      ),
      distancia: rocketTotalDistance,
      tempoDePercurso: totalTime,
      velocidadeMedia:
        calculateAverageSpeed(rocketTotalDistance, totalTime) || 0,
      lancamento: {
        connect: {
          id: data.id,
        },
      },
      dataHora: new Date().toISOString(),
    },
  });

  return NextResponse.json(
    {
      success: true,
      message: 'Launch created successfully',
      data,
    },
    {
      status: 201,
    },
  );
}