import {
  Controller,
  Get,
  Param,
  Body,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async getAll(
    @Query('field') field: 'createdAt' | 'name' = 'name',
    @Query('direction') direction: 'asc' | 'desc' = 'asc',
  ) {
    return this.userService.getAll(field, direction);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getById(@Param('id') id: string) {
    return this.userService.findById(id, false);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/update/:id')
  async update(@Param('id') id: string, @Body() data: Partial<UserEntity>) {
    return this.userService.update(id, data);
  }
}
