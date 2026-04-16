import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { UploadsModule } from './uploads/uploads.module';
import { RunsModule } from './runs/runs.module';
import { ParserModule } from './parser/parser.module';
import { ValidationModule } from './validation/validation.module';
import { TransformationModule } from './transformation/transformation.module';
import { ExecutionModule } from './execution/execution.module';
import { LogsModule } from './logs/logs.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    SharedModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    UploadsModule,
    RunsModule,
    ParserModule,
    ValidationModule,
    TransformationModule,
    ExecutionModule,
    LogsModule,
  ],
})
export class AppModule {}
