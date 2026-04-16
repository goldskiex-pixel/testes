export function StatusBadge({ value }: { value: string }) {
  const color = value.includes('FAIL') ? 'bg-red-100 text-red-700' : value.includes('RUN') ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700';
  return <span className={`rounded px-2 py-1 text-xs font-medium ${color}`}>{value}</span>;
}
