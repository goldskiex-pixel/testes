import { api } from '../../../lib/api';
import { JsonPanel } from '../../../components/JsonPanel';

export default async function PreviewPage({ params }: { params: { id: string } }) {
  const preview = await api<any>(`/runs/${params.id}/preview`);
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Configuration preview</h2>
      <JsonPanel data={preview} />
    </div>
  );
}
