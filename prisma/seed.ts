import { prisma } from '@/lib';

async function main() {
  await prisma.rocket.create({
    data: {
      id: 1,
      nome: 'Oasis',
      peso_zfw: 0,
    },
  });
}

main();
