import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { Address } from './entities/address.entity';
import { UsersService } from './users.service';
import { AccountController } from './account.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address]), JwtModule.register({})],
  controllers: [AccountController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
