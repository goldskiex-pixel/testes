import { SummaryCard } from '../../components/SummaryCard';
import { api } from '../../lib/api';
import { Run } from '../../types';

export default async function DashboardPage() {
  const runs = await api<Run[]>('/runs');
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <SummaryCard title="Total Runs" value={runs.length} />
        <SummaryCard title="Successful Runs" value={runs.filter((r) => r.status === 'COMPLETED').length} />
        <SummaryCard title="Failed Runs" value={runs.filter((r) => r.status === 'FAILED').length} />
      </div>
    </div>
  );
}
