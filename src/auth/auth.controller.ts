import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto, signupDto, verificationHashDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  create(@Body() body: signupDto) {
    return this.authService.signUp(
      body.name,
      body.email,
      body.password,
      body.referralCode,
    );
  }

  @Post('login')
  login(@Body() body: loginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Get('confirmEmail')
  verify(@Query() queryObject: verificationHashDto){
    console.log('recieved query', queryObject)
    return this.authService.emailConfirmation(queryObject.verificationHash)

  }
}
