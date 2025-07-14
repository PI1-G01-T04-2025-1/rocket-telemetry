import { api } from '@/lib/http';

export interface Response {
  id: number;
  rocketId: number;
  rocket: Rocket;
  angle: number;
  pressure: number;
  water: number;
  collectedData: CollectedData;
  createdAt: string;
}

export interface Rocket {
  id: number;
  name: string;
  zfw: number;
}

export interface CollectedData {
  id: number;
  rawData: string;
}

export const getLaunch = async ({
  rocketId,
  launchId,
}: {
  rocketId: string | number;
  launchId: string | number;
}) => {
  try {
    const request = await api.get<Response>(
      `/rocket/${rocketId}/launches/${launchId}`,
    );

    return request.data;
  } catch (err) {
    throw err;
  }
};
