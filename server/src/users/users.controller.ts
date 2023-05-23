import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseJsonPipe } from '../common/utils/parse-json.pipe';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUsersDto: CreateUserDto) {
    return this.usersService.create(createUsersDto);
  }

  @Get()
  getList(
    @Query('sort', ParseJsonPipe) sort,
    @Query('range', ParseJsonPipe) range,
    @Query('filter', ParseJsonPipe) filter,
  ) {
    if (filter && filter.ids) return this.usersService.getMany(filter.ids);
    // if (filter.target && filter.id) return this.usersService.getManyReference(sort, range, filter);
    return this.usersService.getList(sort, range, filter);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.usersService.getOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch()
  updateMany(
    @Query('filter', ParseJsonPipe) filter: { ids: string[] },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateMany(filter.ids, updateUserDto);
  }

  @Delete()
  deleteMany(@Query('filter', ParseJsonPipe) filter: { ids: string[] }) {
    return this.usersService.deleteMany(filter.ids);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
