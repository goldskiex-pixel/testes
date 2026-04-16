import { Module } from '@nestjs/common';
import { RunsController } from './runs.controller';
import { RunsService } from './runs.service';
import { ExecutionModule } from '../execution/execution.module';

@Module({ imports: [ExecutionModule], controllers: [RunsController], providers: [RunsService] })
export class RunsModule {}
