import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { type AuthUserDto } from '@decathlon/shared';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';

export interface Session {
  user: AuthUserDto;
  accessToken: string;
  refreshToken: string;
}

interface TokenPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<Session> {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.users.createUser({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });
    return this.buildSession(user);
  }

  async login(dto: LoginDto): Promise<Session> {
    const user = await this.users.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.buildSession(user);
  }

  async refresh(refreshToken: string | undefined): Promise<Session> {
    if (!refreshToken) throw new UnauthorizedException('No refresh token');
    let payload: TokenPayload;
    try {
      payload = this.jwt.verify<TokenPayload>(refreshToken, {
        secret: this.config.get<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.users.findById(payload.sub);
    if (!user) throw new UnauthorizedException('User no longer exists');
    return this.buildSession(user);
  }

  private signOptions(secretKey: string, ttlKey: string): JwtSignOptions {
    return {
      secret: this.config.get<string>(secretKey),
      expiresIn: this.config.get<string>(ttlKey),
    } as unknown as JwtSignOptions;
  }

  private buildSession(user: User): Session {
    const payload: TokenPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwt.sign(payload, this.signOptions('jwt.accessSecret', 'jwt.accessTtl'));
    const refreshToken = this.jwt.sign(
      payload,
      this.signOptions('jwt.refreshSecret', 'jwt.refreshTtl'),
    );
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      accessToken,
      refreshToken,
    };
  }
}
