import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  it('flags duplicate employees', () => {
    const service = new ValidationService();
    const result = service.validate({
      entities: {
        organizational_structure: [],
        departments: [{ entity: 'departments', rowNumber: 2, data: { code: 'D1', name: 'Dept', org_code: 'ORG' } }],
        cost_centers: [],
        job_roles: [],
        schedules: [{ entity: 'schedules', rowNumber: 2, data: { code: 'S1', name: '8-5', start_time: '08:00', end_time: '17:00' } }],
        employees: [
          { entity: 'employees', rowNumber: 2, data: { external_id: 'E1', name: 'John', department_code: 'D1', schedule_code: 'S1' } },
          { entity: 'employees', rowNumber: 3, data: { external_id: 'E1', name: 'Jane', department_code: 'D1', schedule_code: 'S1' } },
        ],
      },
    } as any);

    expect(result.some((x) => x.code === 'DUPLICATE')).toBe(true);
  });
});
