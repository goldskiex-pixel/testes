import { Controller, Get, Param, Post } from '@nestjs/common';
import { RunsService } from './runs.service';

@Controller('runs')
export class RunsController {
  constructor(private readonly runsService: RunsService) {}

  @Get()
  list() { return this.runsService.list(); }

  @Get(':id')
  details(@Param('id') id: string) { return this.runsService.details(id); }

  @Get(':id/validation')
  validation(@Param('id') id: string) { return this.runsService.validation(id); }

  @Get(':id/preview')
  preview(@Param('id') id: string) { return this.runsService.preview(id); }

  @Post(':id/execute')
  execute(@Param('id') id: string) { return this.runsService.execute(id); }

  @Post(':id/dry-run')
  dryRun(@Param('id') id: string) { return this.runsService.dryRun(id); }

  @Post(':id/retry-failed')
  retry(@Param('id') id: string) { return this.runsService.retryFailed(id); }

  @Get(':id/export-errors')
  async exportErrors(@Param('id') id: string) {
    const rows = await this.runsService.validation(id);
    return rows.map((x) => `${x.entityName},${x.rowNumber ?? ''},${x.fieldName ?? ''},${x.severity},${x.message}`).join('\n');
  }
}
