import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { ParserService } from '../parser/parser.service';
import { ValidationService } from '../validation/validation.service';
import { TransformationService } from '../transformation/transformation.service';

@Injectable()
export class UploadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly parser: ParserService,
    private readonly validator: ValidationService,
    private readonly transformer: TransformationService,
  ) {}

  async handleUpload(input: { clientId: string; uploadedById: string; fileName: string; base64Content: string }) {
    if (!input.fileName.endsWith('.xlsx')) {
      throw new Error('Only .xlsx files are accepted');
    }

    const upload = await this.prisma.upload.create({
      data: {
        clientId: input.clientId,
        uploadedById: input.uploadedById,
        originalName: input.fileName,
        storagePath: `/tmp/${Date.now()}-${input.fileName}`,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        sizeBytes: Math.floor(input.base64Content.length / 1.33),
      },
    });

    const run = await this.prisma.setupRun.create({ data: { clientId: input.clientId, uploadId: upload.id } });

    const parsed = this.parser.parseFromBuffer(Buffer.from(input.base64Content, 'base64'));
    const issues = this.validator.validate(parsed);

    for (const entity of Object.keys(parsed.entities)) {
      const records = parsed.entities[entity as keyof typeof parsed.entities];
      await this.prisma.setupRunEntity.create({ data: { runId: run.id, entityName: entity, total: records.length, pending: records.length } });
      for (const rec of records) {
        const transformed = this.transformer.transformRecord(rec);
        await this.prisma.setupRunRecord.create({
          data: {
            runId: run.id,
            entityName: entity,
            rowNumber: rec.rowNumber,
            externalKey: rec.externalKey,
            payload: rec.data,
            transformed,
          },
        });
      }
    }

    if (issues.length > 0) {
      await this.prisma.validationIssue.createMany({
        data: issues.map((x) => ({ runId: run.id, ...x })),
      });
      await this.prisma.setupRun.update({ where: { id: run.id }, data: { status: 'VALIDATED' } });
    } else {
      await this.prisma.setupRun.update({ where: { id: run.id }, data: { status: 'READY' } });
    }

    return { uploadId: upload.id, runId: run.id, issues: issues.length };
  }
}
