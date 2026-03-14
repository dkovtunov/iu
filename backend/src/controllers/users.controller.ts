import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto, UserDto } from '../validations/user';
import { EmailExistsException } from '../exceptions/user.exceptions';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @HttpCode(201)
  async createUser(@Body() dto: CreateUserDto): Promise<UserDto | void> {
    try {
      return await this.service.create(dto);
    } catch (error) {
      if (error instanceof EmailExistsException) {
        throw new ConflictException(error.message);
      }
      throw new InternalServerErrorException(
        'an unexpected error occurred while creating a user',
      );
    }
  }
}
