import Link from 'next/link';
import { api } from '../../lib/api';
import { Run } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';

export default async function RunsPage() {
  const runs = await api<Run[]>('/runs');
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Run history</h2>
      <div className="space-y-2">
        {runs.map((r) => (
          <Link key={r.id} href={`/runs/${r.id}`} className="flex items-center justify-between rounded border bg-white p-3 hover:bg-slate-50">
            <div>
              <p className="font-medium">{r.client.name}</p>
              <p className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleString()}</p>
            </div>
            <StatusBadge value={r.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}
