import Link from 'next/link';
import { api } from '../../../lib/api';
import { JsonPanel } from '../../../components/JsonPanel';

export default async function RunDetails({ params }: { params: { id: string } }) {
  const run = await api<any>(`/runs/${params.id}`);
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Run details</h2>
      <div className="flex gap-2">
        <Link href={`/validation/${params.id}`} className="rounded border bg-white px-3 py-2">Validation</Link>
        <Link href={`/preview/${params.id}`} className="rounded border bg-white px-3 py-2">Preview</Link>
      </div>
      <JsonPanel data={run} />
    </div>
  );
}
