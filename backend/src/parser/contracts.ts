export const ENTITY_ORDER = [
  'organizational_structure',
  'departments',
  'cost_centers',
  'job_roles',
  'schedules',
  'employees',
] as const;

export type EntityName = (typeof ENTITY_ORDER)[number];

export type ParsedEntityRecord = {
  entity: EntityName;
  rowNumber: number;
  data: Record<string, unknown>;
  externalKey?: string;
};

export type ParsedWorkbook = {
  entities: Record<EntityName, ParsedEntityRecord[]>;
};
