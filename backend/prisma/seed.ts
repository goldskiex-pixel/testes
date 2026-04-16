import { PrismaClient, RoleType, EnvironmentType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { type: RoleType.ADMIN },
    update: {},
    create: { type: RoleType.ADMIN },
  });

  const operatorRole = await prisma.role.upsert({
    where: { type: RoleType.OPERATOR },
    update: {},
    create: { type: RoleType.OPERATOR },
  });

  await prisma.user.upsert({
    where: { email: 'admin@oitchau.local' },
    update: {},
    create: {
      email: 'admin@oitchau.local',
      passwordHash: await bcrypt.hash('admin123', 10),
      roleId: adminRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'operator@oitchau.local' },
    update: {},
    create: {
      email: 'operator@oitchau.local',
      passwordHash: await bcrypt.hash('operator123', 10),
      roleId: operatorRole.id,
    },
  });

  await prisma.client.upsert({
    where: { id: 'seed-staging-client' },
    update: {},
    create: {
      id: 'seed-staging-client',
      name: 'Default Staging Client',
      environmentType: EnvironmentType.STAGING,
      apiBaseUrl: 'https://api-staging.example.com',
      isActive: true,
      credentials: {
        create: {
          apiKeyMasked: 'sk_live_****',
          secretCipher: 'TODO_ENCRYPTED_SECRET',
        },
      },
    },
  });
}

main().finally(async () => prisma.$disconnect());
