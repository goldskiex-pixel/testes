import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { ParserModule } from '../parser/parser.module';
import { ValidationModule } from '../validation/validation.module';
import { TransformationModule } from '../transformation/transformation.module';

@Module({ imports: [ParserModule, ValidationModule, TransformationModule], controllers: [UploadsController], providers: [UploadsService], exports: [UploadsService] })
export class UploadsModule {}
