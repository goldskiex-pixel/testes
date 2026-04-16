export function JsonPanel({ data }: { data: unknown }) {
  return <pre className="max-h-80 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-100">{JSON.stringify(data, null, 2)}</pre>;
}
