import { api } from '../../../lib/api';
import { DataTable } from '../../../components/DataTable';

export default async function ValidationPage({ params }: { params: { id: string } }) {
  const issues = await api<any[]>(`/runs/${params.id}/validation`);
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Validation results</h2>
      <DataTable headers={['Entity', 'Row', 'Field', 'Severity', 'Message']} rows={issues.map((i) => [i.entityName, i.rowNumber ?? '-', i.fieldName ?? '-', i.severity, i.message])} />
    </div>
  );
}
