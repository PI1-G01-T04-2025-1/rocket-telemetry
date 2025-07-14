import { api } from '@/lib';

export const createRocketLaunch = async ({
  rocketId,
  expectedDistance,
  pressure,
  water,
}: {
  rocketId: string;
  expectedDistance: number;
  pressure: number;
  water: number;
}) => {
  try {
    return api.post(`/rocket/${rocketId}/launches/new`, {
      rocketId,
      expectedDistance,
      pressure,
      water,
    });
  } catch (error) {
    console.error('Error creating rocket launch:', error);
    throw error;
  }
};
