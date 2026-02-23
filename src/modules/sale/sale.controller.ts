import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleEntity } from './entities/sale.entity';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';

@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async register(@Body() data: { clientId: string; products: string[] }) {
    return this.saleService.register(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async getAll() {
    return this.saleService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/client/:clientId')
  async getByClient(@Param('clientId') clientId: string) {
    return this.saleService.getByClient(clientId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async findById(@Param('id') id: string) {
    return this.saleService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() data: Partial<SaleEntity>) {
    return this.saleService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.saleService.delete(id);
  }
}
