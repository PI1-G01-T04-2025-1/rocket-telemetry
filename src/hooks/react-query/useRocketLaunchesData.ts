import { getLaunches } from '@/services/rocket/get-launches';
import { useQuery } from '@tanstack/react-query';

export const useRocketLaunchesData = (rocketId: string) => {
  return useQuery({
    queryKey: ['rocketLaunches', rocketId],
    queryFn: () => getLaunches({ rocketId }),
    refetchOnWindowFocus: true,
  });
};
