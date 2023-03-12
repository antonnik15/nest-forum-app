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
  UseGuards,
} from '@nestjs/common';
import { UserPaginationDto } from './dto/user.pagination.dto';
import { UserQueryRepository } from '../infrastructure/user-query-repository';
import { CreateUserDto } from './dto/create.user.dto';
import { UserService } from '../application/user.service';
import { BasicAuthGuard } from '../../../guards/basic-auth.guard';

@Controller('users')
export class UserController {
  constructor(
    private usersQueryRepository: UserQueryRepository,
    private userService: UserService,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers(@Query() userPaginationDto: UserPaginationDto) {
    return this.usersQueryRepository.getAllUsers(userPaginationDto);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateUserDto) {
    return await this.userService.createUser(dto);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUserById(@Param('id') id: string) {
    return this.userService.deleteUserById(id);
  }

  @Get('user')
  getUser() {
    return this.usersQueryRepository.getUser();
  }
}
