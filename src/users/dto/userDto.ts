import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class updateUserData {
  @IsOptional()
  @IsEmail()
  @Length(6, 50)
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  @Length(6, 50)
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  referralCode: string;
}

export class resetPasswordDto {
  @IsString()
  @Length(4, 20)
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @Length(4, 20)
  @IsNotEmpty()
  confirmNewPassword: string;
}

export class forgotPasswordDto {
  @IsEmail()
  @Length(4, 50)
  @IsNotEmpty()
  email: string;
}

export class IdDto {
  @IsNotEmpty()
  @IsNumberString()
  id: number;
}
