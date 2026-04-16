import { Injectable } from '@nestjs/common';
import { EnvironmentType } from '@prisma/client';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        environmentType: true,
        apiBaseUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  create(data: { name: string; environmentType: EnvironmentType; apiBaseUrl: string; isActive?: boolean }) {
    return this.prisma.client.create({ data });
  }

  update(id: string, data: Partial<{ name: string; environmentType: EnvironmentType; apiBaseUrl: string; isActive: boolean }>) {
    return this.prisma.client.update({ where: { id }, data });
  }

  async upsertCredentials(clientId: string, apiKey: string, apiSecret: string) {
    return this.prisma.clientCredential.upsert({
      where: { clientId },
      create: {
        clientId,
        apiKeyMasked: `${apiKey.slice(0, 4)}****`,
        secretCipher: `TODO_ENCRYPT:${apiSecret}`,
      },
      update: {
        apiKeyMasked: `${apiKey.slice(0, 4)}****`,
        secretCipher: `TODO_ENCRYPT:${apiSecret}`,
      },
      select: { id: true, clientId: true, apiKeyMasked: true, createdAt: true, updatedAt: true },
    });
  }
}
