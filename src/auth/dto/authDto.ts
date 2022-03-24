import { IsEmail, IsNotEmpty, IsString, Length, Max } from 'class-validator';

export class signupDto {
  @IsEmail()
  @Length(6, 50)
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(4, 20)
  @IsNotEmpty()
  password: string;

  @IsString()
  @Length(6, 50)
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  referralCode: string;
}

export class loginDto {
  @IsEmail()
  @Length(6, 50)
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(4, 20)
  @IsNotEmpty()
  password: string;
}

//verificationHashDto
export class verificationHashDto {
  @IsString()
  @Length(40, 40)
  @IsNotEmpty()
  verificationHash: string;
}