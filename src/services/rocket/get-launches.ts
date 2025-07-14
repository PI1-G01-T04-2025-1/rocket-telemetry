import { api } from '@/lib/http';

interface Response {
  id: number;
  name: string;
  pesoZfw: number;
  launches: Launch[];
}

interface Launch {
  id: string;
  fogueteId: number;
  dataHora: string;
  angulo: number;
  pressao: number;
  qtdAgua: number;
  distanciaEsperada: number;
}

export const getLaunches = async ({
  rocketId,
}: {
  rocketId: string | number;
}) => {
  try {
    const request = await api.get<Response>(`/rocket/${rocketId}/launches`);

    const formatedData = dto(request.data);

    return formatedData;
  } catch (err) {
    throw err;
  }
};

const dto = (response: Response) => {
  return {
    id: response.id,
    name: response.name,
    zfw: response.pesoZfw,
    launches: response.launches.map((launch) => ({
      id: launch.id,
      rocketId: launch.fogueteId,
      angle: launch.angulo,
      pressure: launch.pressao,
      water: launch.qtdAgua,
      expectedDistance: launch.distanciaEsperada,
      createdAt: launch.dataHora,
    })),
  };
};

export type RocketLaunchesResponse = ReturnType<typeof dto>;
