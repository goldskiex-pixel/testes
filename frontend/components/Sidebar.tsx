import Link from 'next/link';

const links = [
  ['Dashboard', '/dashboard'],
  ['Clients', '/clients'],
  ['Upload', '/upload'],
  ['Runs', '/runs'],
];

export function Sidebar() {
  return (
    <aside className="w-56 border-r bg-white p-4">
      <h1 className="mb-4 text-lg font-semibold">Oitchau Setup</h1>
      <nav className="space-y-2">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="block rounded px-3 py-2 hover:bg-slate-100">{label}</Link>
        ))}
      </nav>
    </aside>
  );
}
