import { Body, Controller, Post } from '@nestjs/common';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  upload(@Body() body: { clientId: string; uploadedById: string; fileName: string; base64Content: string }) {
    return this.uploadsService.handleUpload(body);
  }
}
