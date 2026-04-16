import { Module } from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { OitchauClient } from '../oitchau/oitchau.client';
import { LogsModule } from '../logs/logs.module';

@Module({ imports: [LogsModule], providers: [ExecutionService, OitchauClient], exports: [ExecutionService] })
export class ExecutionModule {}
