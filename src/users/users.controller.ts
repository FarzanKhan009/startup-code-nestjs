import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  forgotPasswordDto,
  IdDto,
  resetPasswordDto,
  updateUserData,
} from './dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  //get users/:id
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  find(@Param() params: IdDto) {
    return this.usersService.find(+params.id);
  }

  //delete users/:id
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param() params: IdDto) {
    console.log('id', params.id);

    return this.usersService.remove(+params.id);
  }

  //update users/:id
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param() params: IdDto, @Body() body: updateUserData) {
    console.log('id', params.id);
    console.log('body', body);

    return this.usersService.update(+params.id, body);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('reset-password')
  resetPassword(
    @Body() body: resetPasswordDto,
    @Query() querString: { resetHash: string },
  ) {
    return this.usersService.resetPassword(
      body.newPassword,
      body.confirmNewPassword,
      querString.resetHash,
    );
  }

  @Post('forgot-password')
  fogotPassword(@Body() body: forgotPasswordDto) {
    return this.usersService.generateResetPasswordHash(body.email);
  }
}
