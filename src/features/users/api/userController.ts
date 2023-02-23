import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserPaginationDto } from './dto/user.pagination.dto';
import { UserQueryRepository } from '../infrastructure/user-query-repository';
import { CreateUserDto } from './dto/create.user.dto';
import { UserService } from '../application/user.service';

@Controller('users')
export class UserController {
  constructor(
    private usersQueryRepository: UserQueryRepository,
    private userService: UserService,
  ) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers(@Query() userPaginationDto: UserPaginationDto) {
    return await this.usersQueryRepository.getAllUsers(userPaginationDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateUserDto) {
    return await this.userService.createUser(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUserById(@Param('id') id: string) {
    return this.userService.deleteUserById(id);
  }
}
