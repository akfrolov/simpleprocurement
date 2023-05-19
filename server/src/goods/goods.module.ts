import { Module } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { GoodsController } from './goods.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Good, GoodSchema } from './goods.schema';
import { AuthModule } from '../auth/auth.module';
import { RequestsModule } from '../requests/requests.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Good.name, schema: GoodSchema }]),
  ],
  controllers: [GoodsController],
  providers: [GoodsService],
})
export class GoodsModule {}
