import { Injectable } from '@nestjs/common';

@Injectable()
export class OitchauClient {
  async upsertEntity(entity: string, payload: unknown, dryRun: boolean) {
    if (dryRun) {
      return { ok: true, dryRun: true, entity, payload };
    }

    // TODO: replace with actual HTTP integration
    return { ok: true, remoteId: `mock-${entity}-${Date.now()}` };
  }
}
