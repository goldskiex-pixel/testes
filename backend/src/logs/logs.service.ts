import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class LogsService {
  constructor(private readonly prisma: PrismaService) {}

  async info(runId: string, message: string, metadata?: Record<string, unknown>, entityName?: string, recordId?: string) {
    return this.prisma.executionLog.create({ data: { runId, level: 'info', message, metadata, entityName, recordId } });
  }
}
