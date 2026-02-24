import {
  Controller,
  Get,
  Param,
  Body,
  Put,
  UseGuards,
  Post,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductEntity } from './entities/product.entity';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async add(@Body() data: { name: string; stock: number }) {
    return this.productService.add(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() data: Partial<ProductEntity>) {
    return this.productService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id/reduce-stock')
  async reduceStock(
    @Param('id') id: string,
    @Body() data: { quantity: number },
  ) {
    return this.productService.reduceStock(id, data.quantity);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id/deactivate')
  async deactivate(@Param('id') id: string) {
    return await this.productService.deactivate(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async getAll() {
    return this.productService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getById(@Param('id') id: string) {
    return this.productService.findById(id);
  }
}
