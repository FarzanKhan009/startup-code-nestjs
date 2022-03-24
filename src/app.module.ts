import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [UsersModule, AuthModule, DatabaseModule, ConfigModule.forRoot(), MailModule],
})
export class AppModule {}
