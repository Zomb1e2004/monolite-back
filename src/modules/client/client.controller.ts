import {
  Controller,
  Get,
  Query,
  Param,
  Body,
  Put,
  UseGuards,
  Post,
  Delete,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientEntity } from './entities/client.entity';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async add(@Body() data: { firstnames: string; lastnames: string }) {
    return this.clientService.add(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async getAll(@Query('onlyWithPurchases') onlyWithPurchases: string) {
    const includePurchases = onlyWithPurchases === 'true';
    return this.clientService.getAll(includePurchases);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getById(@Param('id') id: string) {
    return this.clientService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() data: Partial<ClientEntity>) {
    return this.clientService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.clientService.delete(id);
  }
}
