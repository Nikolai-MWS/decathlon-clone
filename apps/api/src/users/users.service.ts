import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { type AddressDto, type AddressInput } from '@decathlon/shared';
import { User } from './entities/user.entity';
import { Address } from './entities/address.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Address) private readonly addresses: Repository<Address>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.users.findOne({ where: { email: email.toLowerCase() } });
  }

  findById(id: string): Promise<User | null> {
    return this.users.findOne({ where: { id } });
  }

  createUser(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
  }): Promise<User> {
    return this.users.save(
      this.users.create({ ...data, email: data.email.toLowerCase() }),
    );
  }

  async listAddresses(userId: string): Promise<AddressDto[]> {
    const rows = await this.addresses.find({
      where: { userId },
      order: { isDefault: 'DESC', id: 'ASC' },
    });
    return rows.map(toAddressDto);
  }

  async addAddress(userId: string, input: AddressInput): Promise<AddressDto> {
    if (input.isDefault) await this.clearDefault(userId);
    const saved = await this.addresses.save(this.addresses.create({ ...input, userId }));
    return toAddressDto(saved);
  }

  async updateAddress(userId: string, id: string, input: AddressInput): Promise<AddressDto> {
    const existing = await this.addresses.findOne({ where: { id, userId } });
    if (!existing) throw new NotFoundException('Address not found');
    if (input.isDefault) await this.clearDefault(userId);
    Object.assign(existing, input);
    const saved = await this.addresses.save(existing);
    return toAddressDto(saved);
  }

  async removeAddress(userId: string, id: string): Promise<void> {
    await this.addresses.delete({ id, userId });
  }

  private async clearDefault(userId: string): Promise<void> {
    await this.addresses.update({ userId }, { isDefault: false });
  }
}

export function toAddressDto(a: Address): AddressDto {
  return {
    id: a.id,
    fullName: a.fullName,
    phone: a.phone,
    line1: a.line1,
    city: a.city,
    postalCode: a.postalCode,
    country: a.country,
    isDefault: a.isDefault,
  };
}
