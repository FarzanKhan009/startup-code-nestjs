import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import {randomBytes} from 'crypto'
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private usersService: UsersService,
    private mailService: MailService
  ) {}

  async signUp(name: string, email: string, password: string, referralCode: string): Promise<{}> {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new BadRequestException('auth/account-exists');
    }

    const verificationHash = randomBytes(20).toString('hex');
    this.mailService.sendUserConfirmation(email, name, verificationHash)


    const user: User = await this.usersService.create(name, email, password, referralCode, verificationHash);
    delete user.password;
    // this.mailService.sendUserConfirmation(user.email, user.firstName, verificationHash)


    return await this.signToken(user.id, user.email);
  }

  async login(email: string, password: string): Promise<{}> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('auth/account-not-found');
    }
    const matches: boolean = await bcrypt.compare(password, user.password);
    if (!matches) {
      throw new BadRequestException('auth/wrong-password');
    }
    return await this.signToken(user.id, user.email);
  }

  async emailConfirmation(hash: string){
    const user = await this.usersService.findByVerificationHash(hash)
    if (!user) {
      throw new BadRequestException('account is already verified');
    }
    await this.usersService.updateVerificationStatus(user)
    return {message: 'Email is verified'}
  }

  async signToken(id: number, email: string): Promise<{ access_token: string }> {
    const payload = {
      sub: id,
      email: email,
    };
    const secret = this.config.get('JWT_SECRET');
    console.log('secret', secret, 'data', id, email);
    let token = await this.jwt.signAsync(payload, {
      expiresIn: '1000m',
      secret: secret,
    });
    return { access_token: token };
  }

  
}
