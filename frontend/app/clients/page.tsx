import { api } from '../../lib/api';
import { Client } from '../../types';
import { DataTable } from '../../components/DataTable';

export default async function ClientsPage() {
  const clients = await api<Client[]>('/clients');
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Clients</h2>
      <DataTable headers={['Name', 'Environment', 'API URL', 'Status']} rows={clients.map((c) => [c.name, c.environmentType, c.apiBaseUrl, c.isActive ? 'Active' : 'Inactive'])} />
    </div>
  );
}
