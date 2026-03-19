import {
  Controller,
  Get,
  Param,
  Body,
  Put,
  UseGuards,
  Post,
  Query,
  Patch,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductEntity } from './entities/product.entity';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async add(@Body() data: { name: string; price: number; stock: number }) {
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
  @Patch('/:id/deactivate')
  async deactivate(@Param('id') id: string, @Body('key') key: string) {
    return await this.productService.deactivate(id, key);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id/activate')
  async activate(@Param('id') id: string, @Body('key') key: string) {
    return await this.productService.activate(id, key);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async getAll(
    @Query('field') field: 'createdAt' | 'name' = 'name',
    @Query('direction') direction: 'asc' | 'desc' = 'asc',
  ) {
    return this.productService.getAll(field, direction);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/top-selling')
  async getTopSellingProducts() {
    return this.productService.getTopSellingProducts();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getById(@Param('id') id: string) {
    return this.productService.findById(id);
  }
}
