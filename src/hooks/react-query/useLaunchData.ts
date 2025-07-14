import { getLaunch } from '@/services/rocket/get-launch-by-id';
import { useQuery } from '@tanstack/react-query';

export const useLaunchData = ({
  rocketId,
  launchId,
}: {
  rocketId: string;
  launchId: string;
}) => {
  return useQuery({
    queryKey: ['launch', rocketId, launchId],
    queryFn: () => getLaunch({ rocketId, launchId }),
    refetchOnWindowFocus: false,
  });
};
