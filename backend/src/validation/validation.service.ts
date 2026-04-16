import { Injectable } from '@nestjs/common';
import { Severity } from '@prisma/client';
import { z } from 'zod';
import { EntityName, ParsedWorkbook } from '../parser/contracts';

export type ValidationIssueInput = {
  entityName: EntityName;
  tabName: string;
  rowNumber?: number;
  fieldName?: string;
  message: string;
  severity: Severity;
  code?: string;
};

const scheduleSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
});

@Injectable()
export class ValidationService {
  validate(parsed: ParsedWorkbook): ValidationIssueInput[] {
    const issues: ValidationIssueInput[] = [];

    for (const [entity, rows] of Object.entries(parsed.entities) as [EntityName, any[]][]) {
      rows.forEach((r) => {
        Object.entries(r.data).forEach(([field, value]) => {
          if (value === '') {
            issues.push({ entityName: entity, tabName: entity, rowNumber: r.rowNumber, fieldName: field, message: 'Missing value', severity: Severity.ERROR, code: 'MISSING_VALUE' });
          }
        });
      });
    }

    const departments = new Set(parsed.entities.departments.map((x) => String(x.data.code)));
    const schedules = new Set(parsed.entities.schedules.map((x) => String(x.data.code)));
    parsed.entities.employees.forEach((e) => {
      if (!departments.has(String(e.data.department_code))) {
        issues.push({ entityName: 'employees', tabName: 'employees', rowNumber: e.rowNumber, fieldName: 'department_code', message: 'Department reference not found', severity: Severity.ERROR, code: 'REF_NOT_FOUND' });
      }
      if (!schedules.has(String(e.data.schedule_code))) {
        issues.push({ entityName: 'employees', tabName: 'employees', rowNumber: e.rowNumber, fieldName: 'schedule_code', message: 'Schedule reference not found', severity: Severity.ERROR, code: 'REF_NOT_FOUND' });
      }
    });

    const seen = new Set<string>();
    parsed.entities.employees.forEach((e) => {
      const key = String(e.data.external_id);
      if (seen.has(key)) {
        issues.push({ entityName: 'employees', tabName: 'employees', rowNumber: e.rowNumber, fieldName: 'external_id', message: 'Duplicate employee external_id', severity: Severity.ERROR, code: 'DUPLICATE' });
      }
      seen.add(key);
    });

    parsed.entities.schedules.forEach((s) => {
      const result = scheduleSchema.safeParse(s.data);
      if (!result.success) {
        issues.push({ entityName: 'schedules', tabName: 'schedules', rowNumber: s.rowNumber, fieldName: 'start_time', message: 'Invalid schedule format', severity: Severity.ERROR, code: 'INVALID_FORMAT' });
      }
    });

    return issues;
  }
}
