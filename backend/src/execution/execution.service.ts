import { Injectable } from '@nestjs/common';
import { RecordStatus } from '@prisma/client';
import { ENTITY_ORDER } from '../parser/contracts';
import { OitchauClient } from '../oitchau/oitchau.client';
import { PrismaService } from '../shared/prisma.service';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class ExecutionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly client: OitchauClient,
    private readonly logs: LogsService,
  ) {}

  async execute(runId: string, dryRun: boolean) {
    const run = await this.prisma.setupRun.findUniqueOrThrow({ where: { id: runId }, include: { client: true } });
    if (run.client.environmentType !== 'STAGING') {
      throw new Error('Execution is restricted to staging');
    }

    await this.prisma.setupRun.update({ where: { id: runId }, data: { status: 'RUNNING', dryRun } });

    for (const entity of ENTITY_ORDER) {
      const records = await this.prisma.setupRunRecord.findMany({ where: { runId, entityName: entity, status: RecordStatus.PENDING } });
      for (const rec of records) {
        try {
          await this.client.upsertEntity(entity, rec.transformed ?? rec.payload, dryRun);
          await this.prisma.setupRunRecord.update({ where: { id: rec.id }, data: { status: RecordStatus.SUCCESS } });
        } catch (e: any) {
          await this.logs.info(runId, 'record execution failed', { error: String(e.message).replace(/secret|token/gi, '[REDACTED]') }, entity, rec.id);
          await this.prisma.setupRunRecord.update({ where: { id: rec.id }, data: { status: RecordStatus.FAILED, errorMessage: e.message } });
        }
      }
    }

    await this.prisma.setupRun.update({ where: { id: runId }, data: { status: 'COMPLETED' } });
    return { runId, status: 'COMPLETED', dryRun };
  }

  async retryFailed(runId: string, requestedById: string) {
    const failed = await this.prisma.setupRunRecord.findMany({ where: { runId, status: RecordStatus.FAILED } });
    await this.prisma.retryAttempt.create({ data: { runId, requestedById, recordIds: failed.map((f) => f.id) } });
    await this.prisma.setupRunRecord.updateMany({ where: { id: { in: failed.map((f) => f.id) } }, data: { status: RecordStatus.PENDING, errorMessage: null } });
    return this.execute(runId, false);
  }
}
