export function SummaryCard({ title, value }: { title: string; value: string | number }) {
  return <div className="rounded border bg-white p-4"><p className="text-sm text-slate-500">{title}</p><p className="text-2xl font-semibold">{value}</p></div>;
}
