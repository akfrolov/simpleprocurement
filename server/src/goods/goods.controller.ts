import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GoodsService } from './goods.service';
import { CreateGoodDto } from './dto/create-good.dto';
import { UpdateGoodDto } from './dto/update-good.dto';
import { ParseJsonPipe } from '../common/utils/parse-json.pipe';
import { AuthGuard } from '../auth/auth.guard';

@Controller('goods')
@UseGuards(AuthGuard)
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Post()
  create(@Body() createGoodsDto: CreateGoodDto) {
    return this.goodsService.create(createGoodsDto);
  }

  @Get()
  async getList(
    @Query('sort', ParseJsonPipe) sort,
    @Query('range', ParseJsonPipe) range,
    @Query('filter', ParseJsonPipe) filter,
  ) {
    if (filter && filter.ids) return this.goodsService.getMany(filter.ids);
    // if (filter.target && filter.id) return this.goodsService.getManyReference(sort, range, filter);
    return this.goodsService.getList(sort, range, filter);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.goodsService.getOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoodDto: UpdateGoodDto) {
    return this.goodsService.update(id, updateGoodDto);
  }

  @Patch()
  updateMany(
    @Query('filter', ParseJsonPipe) filter: { ids: string[] },
    @Body() updateGoodDto: UpdateGoodDto,
  ) {
    return this.goodsService.updateMany(filter.ids, updateGoodDto);
  }

  @Delete()
  deleteMany(@Query('filter', ParseJsonPipe) filter: { ids: string[] }) {
    return this.goodsService.deleteMany(filter.ids);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.goodsService.delete(id);
  }
}
