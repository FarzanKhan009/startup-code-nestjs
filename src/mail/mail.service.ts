import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class MailService {
    constructor(private mailerService: MailerService,
        private config: ConfigService
        ) {}


    async sendUserConfirmation(sendToEmail: string, sendToName, verificationHash: string) {
        const url = `${this.config.get('domain')}/auth/confirmEmail?verificationHash=${verificationHash}`;
    
        await this.mailerService.sendMail({
          to: sendToEmail,
          // from: '"Support Team" <support@example.com>', // override default from
          subject: 'Welcome to Premier Coin! Confirm your Email',
          template: 'confirmation',
          context: { // ✏️ filling curly brackets with content
            name: sendToName,
            url,
          },
        });
      }
}
