import { Injectable } from '@nestjs/common';
import { ParsedEntityRecord } from '../parser/contracts';

@Injectable()
export class TransformationService {
  transformRecord(record: ParsedEntityRecord) {
    if (record.entity === 'schedules') {
      return {
        code: record.data.code,
        name: record.data.name,
        schedule: {
          start: `${record.data.start_time}:00`,
          end: `${record.data.end_time}:00`,
        },
      };
    }

    return {
      ...record.data,
      sourceRow: record.rowNumber,
      idempotencyKey: `${record.entity}:${record.externalKey ?? record.rowNumber}`,
    };
  }
}
