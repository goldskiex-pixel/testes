import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { EntityName, ParsedWorkbook } from './contracts';

const TABS: Record<EntityName, { tab: string; requiredColumns: string[] }> = {
  organizational_structure: { tab: 'organizational_structure', requiredColumns: ['code', 'name'] },
  departments: { tab: 'departments', requiredColumns: ['code', 'name', 'org_code'] },
  cost_centers: { tab: 'cost_centers', requiredColumns: ['code', 'name', 'department_code'] },
  job_roles: { tab: 'job_roles', requiredColumns: ['code', 'name'] },
  schedules: { tab: 'schedules', requiredColumns: ['code', 'name', 'start_time', 'end_time'] },
  employees: { tab: 'employees', requiredColumns: ['external_id', 'name', 'department_code', 'schedule_code'] },
};

@Injectable()
export class ParserService {
  parseFromBuffer(buffer: Buffer): ParsedWorkbook {
    const wb = XLSX.read(buffer, { type: 'buffer' });
    const result = { entities: {} } as ParsedWorkbook;

    (Object.keys(TABS) as EntityName[]).forEach((entity) => {
      const cfg = TABS[entity];
      const ws = wb.Sheets[cfg.tab];
      const rows = ws ? (XLSX.utils.sheet_to_json(ws, { defval: '' }) as Record<string, unknown>[]) : [];
      result.entities[entity] = rows.map((row, i) => ({
        entity,
        rowNumber: i + 2,
        data: row,
        externalKey: String(row.external_id ?? row.code ?? ''),
      }));
    });

    return result;
  }

  requiredTabs() {
    return Object.values(TABS).map((x) => x.tab);
  }

  requiredColumns(entity: EntityName) {
    return TABS[entity].requiredColumns;
  }
}
