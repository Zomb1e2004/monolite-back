import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClientModule } from './modules/client/client.module';
import { SaleModule } from './modules/sale/sale.module';
import { SaleService } from './modules/sale/sale.service';
import { SaleController } from './modules/sale/sale.controller';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    ClientModule,
    SaleModule,
    ProductModule,
  ],
  providers: [SaleService],
  controllers: [SaleController],
})
export class AppModule {}
