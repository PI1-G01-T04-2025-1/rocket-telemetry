const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('Verificando dados no banco...');
    
    // Verificar foguetes
    const rockets = await prisma.rocket.findMany();
    console.log('Foguetes:', rockets);
    
    // Verificar lançamentos
    const launches = await prisma.launch.findMany({
      include: {
        foguete: true,
        dados_coletados: true,
      },
    });
    console.log('Lançamentos:', JSON.stringify(launches, null, 2));
    
    // Verificar dados coletados
    const collectedData = await prisma.colectedData.findMany();
    console.log('Dados coletados:', collectedData);
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData(); 