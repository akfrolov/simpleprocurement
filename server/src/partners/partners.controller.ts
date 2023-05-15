import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from "@nestjs/common";
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { ParseJsonPipe } from "../common/utils/parse-json.pipe";
import { AuthGuard } from "../auth/auth.guard";

@Controller('partners')
@UseGuards(AuthGuard)
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post()
  create(@Body() createPartnersDto: CreatePartnerDto) {
    return this.partnersService.create(createPartnersDto);
  }

  @Get()
  getList(
    @Query('sort', ParseJsonPipe) sort,
    @Query('range', ParseJsonPipe) range,
    @Query('filter', ParseJsonPipe) filter,
  ) {
    if (filter && filter.ids) return this.partnersService.getMany(filter.ids);
    // if (filter.target && filter.id) return this.partnersService.getManyReference(sort, range, filter);
    return this.partnersService.getList(sort, range, filter);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.partnersService.getOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePartnerDto: UpdatePartnerDto
  ) {
    return this.partnersService.update(id, updatePartnerDto);
  }

  @Patch()
  updateMany(
    @Query('filter', ParseJsonPipe) filter: { ids: string[] },
    @Body() updatePartnerDto: UpdatePartnerDto
  ) {
    return this.partnersService.updateMany(filter.ids, updatePartnerDto);
  }

  @Delete()
  deleteMany(@Query('filter', ParseJsonPipe) filter: {ids: string[]}) {
    return this.partnersService.deleteMany(filter.ids);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.partnersService.delete(id);
  }
}
