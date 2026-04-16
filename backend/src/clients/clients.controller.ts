import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  list() {
    return this.clientsService.list();
  }

  @Post()
  create(@Body() body: { name: string; environmentType: 'STAGING' | 'PRODUCTION'; apiBaseUrl: string; isActive?: boolean }) {
    return this.clientsService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.clientsService.update(id, body);
  }

  @Put(':id/credentials')
  saveCredentials(@Param('id') id: string, @Body() body: { apiKey: string; apiSecret: string }) {
    return this.clientsService.upsertCredentials(id, body.apiKey, body.apiSecret);
  }
}
