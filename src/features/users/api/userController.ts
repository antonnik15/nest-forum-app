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
import { UsersQueryObj } from './dto/users.query.obj';
import { UserQueryRepository } from '../infrastructure/user-query-repository';
import { UserOutputObject } from './dto/user.output.object';
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
  async getAllUsers(@Query() query: UsersQueryObj) {
    const queryObj = new UsersQueryObj(query);
    const usersArray = await this.usersQueryRepository.getAllUsers(queryObj);
    return new UserOutputObject(queryObj, usersArray);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateUserDto) {
    await this.userService.createUser(dto);
    return;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUserById(@Param('id') id: string) {
    this.userService.deletePostById(id);
    return;
  }
}
