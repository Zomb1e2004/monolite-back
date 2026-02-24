import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SaleService } from './sale.service';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';

@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async register(
    @Body()
    data: {
      clientId: string;
      products: { productId: string; quantity: number }[];
    },
  ) {
    return this.saleService.register(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async getAll(
    @Query('field') field: 'createdAt' | 'name' = 'name',
    @Query('direction') direction: 'asc' | 'desc' = 'asc',
  ) {
    return this.saleService.getAll(field, direction);
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
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.saleService.cancel(id);
  }
}
