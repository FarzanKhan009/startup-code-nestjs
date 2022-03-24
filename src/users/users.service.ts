import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import passport from 'passport';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async find(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if(!user){
      throw new NotFoundException('Not Found')
    }
    delete user.password;
    return user;
  }

  async update(id: number, body): Promise<User> {
    let user = await this.userRepository.findOne(id);
    if(!user){
      throw new NotFoundException('Not Found')
    }
    
    if(body.name){
      const firstName= body.name.split(' ')[0]
      const lastName = body.name.split(' ')[1]
      delete body.name
      body.firstName= firstName
      body.lastName = lastName
    }

    user = { ...user, ...body }
    delete user.password;
    return user;
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne(id);
    if(!user){
      throw new NotFoundException('Not Found')
    }
    console.log('user found to delete', user, 'id', id);

    return await this.userRepository.remove(user);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async create(
    name: string,
    email: string,
    password: string,
    referralCode: string,
    verificationHash: string,
  ): Promise<User> {
    let nameAr = name.split(' ');

    const user = new User();
    user.firstName = nameAr[0];
    user.lastName = nameAr[1];
    user.email = email;
    user.password = await this.hashPassword(password);
    user.referralCode = referralCode;
    user.verificationHash = verificationHash;
    console.log('verification hash: ', verificationHash);

    return await this.userRepository.save(user);
  }

  async resetPassword(
    newPassword: string,
    confirmNewPassword: string,
    resetHash: string,
  ) {
    const hashedUser = await this.findByResetHash(resetHash);
    if (!hashedUser) {
      throw new NotFoundException('reset-password/no-reset-hash-found');
    }

    // const existing = await this.findByEmail(email);
    // if (!existing) {
    //   throw new BadRequestException('auth/account-dont-exists');
    // }
    if (!(newPassword === confirmNewPassword)) {
      throw new BadRequestException('reset-password/passwords-dont-match');
    }

    hashedUser.password = await this.hashPassword(newPassword);
    await this.userRepository.save(hashedUser);
    return { message: 'Password is updated' };
  }

  async generateResetPasswordHash(email: string) {
    const existing = await this.findByEmail(email);
    if (!existing) {
      throw new NotFoundException('forgot-password/account-dont-exists');
    }

    const resetHash = randomBytes(20).toString('hex');

    existing.resetHash = resetHash;
    await this.userRepository.save(existing);
    return { message: 'password reset hash is generated' };
  }

  async hashPassword(plain: string): Promise<string> {
    const saltRounds = 10;
    const hashed: string = await bcrypt.hash(plain, saltRounds);
    return hashed;
  }

  async findByResetHash(hash: string): Promise<User> {
    return await this.userRepository.findOne({ where: { resetHash: hash } });
  }

  async findByVerificationHash(hash: string): Promise<User> {
    return await this.userRepository.findOne({ where: { verificationHash: hash } });
  }

  async updateVerificationStatus(user){
    user.isEmaiVerified = true
    user.verificationHash = ""
    return await this.userRepository.save(user);
  }
}
