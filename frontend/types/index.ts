export type Run = { id: string; status: string; createdAt: string; client: { name: string } };
export type Client = { id: string; name: string; environmentType: 'STAGING' | 'PRODUCTION'; apiBaseUrl: string; isActive: boolean };
