export interface AuthUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponseDto {
  accessToken: string;
  user: AuthUserDto;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AddressDto {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface AddressInput {
  fullName: string;
  phone: string;
  line1: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}
