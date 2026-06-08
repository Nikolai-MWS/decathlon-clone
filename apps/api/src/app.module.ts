import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { dataSourceOptions } from './database/data-source';
import { HealthModule } from './health/health.module';
import { CatalogModule } from './catalog/catalog.module';
import { CartModule } from './cart/cart.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRoot(dataSourceOptions),
    HealthModule,
    CatalogModule,
    CartModule,
    UsersModule,
    AuthModule,
    OrdersModule,
    ReviewsModule,
  ],
})
export class AppModule {}
