import { DetailsView } from '@/views';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lançamento - Oásis Rocket',
  description: 'Oásis Rocket, telemetria de lançamentos',
};

export default function Details() {
  return <DetailsView />;
}
