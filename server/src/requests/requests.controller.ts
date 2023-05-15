import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from "@nestjs/common";
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { ParseJsonPipe } from "../common/utils/parse-json.pipe";
import { AuthGuard } from "../auth/auth.guard";

@Controller('requests')
@UseGuards(AuthGuard)
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  create(@Body() createRequestDto: CreateRequestDto) {
    return this.requestsService.create(createRequestDto);
  }

  @Get()
  getList(
    @Query('sort', ParseJsonPipe) sort,
    @Query('range', ParseJsonPipe) range,
    @Query('filter', ParseJsonPipe) filter,
  ) {
    if (filter && filter.ids) return this.requestsService.getMany(filter.ids);
    // if (filter.target && filter.id) return this.requestsService.getManyReference(sort, range, filter);
    return this.requestsService.getList(sort, range, filter);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.requestsService.getOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRequestDto: UpdateRequestDto
  ) {
    return this.requestsService.update(id, updateRequestDto);
  }

  @Patch()
  updateMany(
    @Query('filter', ParseJsonPipe) filter: { ids: string[] },
    @Body() updateRequestDto: UpdateRequestDto
  ) {
    return this.requestsService.updateMany(filter.ids, updateRequestDto);
  }

  @Delete()
  deleteMany(@Query('filter', ParseJsonPipe) filter: { ids: string[] }) {
    return this.requestsService.deleteMany(filter.ids);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.requestsService.delete(id);
  }
}
