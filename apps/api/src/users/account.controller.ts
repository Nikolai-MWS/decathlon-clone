import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { type AddressDto, type AuthUserDto } from '@decathlon/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../auth/current-user.decorator';
import { UsersService } from './users.service';
import { AddressInputDto } from './dto/address.dto';

@UseGuards(JwtAuthGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly users: UsersService) {}

  @Get('profile')
  async profile(@CurrentUser() current: AuthenticatedUser): Promise<AuthUserDto> {
    const user = await this.users.findById(current.id);
    if (!user) throw new NotFoundException('User not found');
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  @Get('addresses')
  listAddresses(@CurrentUser() current: AuthenticatedUser): Promise<AddressDto[]> {
    return this.users.listAddresses(current.id);
  }

  @Post('addresses')
  addAddress(
    @CurrentUser() current: AuthenticatedUser,
    @Body() input: AddressInputDto,
  ): Promise<AddressDto> {
    return this.users.addAddress(current.id, input);
  }

  @Patch('addresses/:id')
  updateAddress(
    @CurrentUser() current: AuthenticatedUser,
    @Param('id') id: string,
    @Body() input: AddressInputDto,
  ): Promise<AddressDto> {
    return this.users.updateAddress(current.id, id, input);
  }

  @Delete('addresses/:id')
  async removeAddress(
    @CurrentUser() current: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<{ ok: true }> {
    await this.users.removeAddress(current.id, id);
    return { ok: true };
  }
}
