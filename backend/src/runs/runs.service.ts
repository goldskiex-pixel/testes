import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { ExecutionService } from '../execution/execution.service';

@Injectable()
export class RunsService {
  constructor(private readonly prisma: PrismaService, private readonly execution: ExecutionService) {}

  list() {
    return this.prisma.setupRun.findMany({ include: { client: true }, orderBy: { createdAt: 'desc' } });
  }

  details(id: string) {
    return this.prisma.setupRun.findUnique({
      where: { id },
      include: {
        entities: true,
        records: true,
        validationIssues: true,
        logs: true,
        retryAttempts: true,
      },
    });
  }

  validation(id: string) {
    return this.prisma.validationIssue.findMany({ where: { runId: id }, orderBy: { createdAt: 'asc' } });
  }

  async preview(id: string) {
    const run = await this.details(id);
    const records = run?.records ?? [];
    return {
      runId: id,
      summary: {
        entities: run?.entities.map((e) => ({ entity: e.entityName, records: e.total })) ?? [],
        errors: run?.validationIssues.filter((x) => x.severity === 'ERROR').length ?? 0,
        warnings: run?.validationIssues.filter((x) => x.severity === 'WARNING').length ?? 0,
      },
      executionOrder: ['organizational_structure', 'departments', 'cost_centers', 'job_roles', 'schedules', 'employees'],
      payloadPreview: records.slice(0, 20).map((r) => ({ entity: r.entityName, rowNumber: r.rowNumber, payload: r.transformed })),
    };
  }

  execute(id: string) {
    return this.execution.execute(id, false);
  }

  dryRun(id: string) {
    return this.execution.execute(id, true);
  }

  retryFailed(id: string) {
    return this.execution.retryFailed(id, 'system-user');
  }
}
