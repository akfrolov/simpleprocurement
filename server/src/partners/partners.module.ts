import { Module } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { PartnersController } from './partners.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Partner, PartnerSchema } from "./partners.schema";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Partner.name, schema: PartnerSchema }])
  ],
  controllers: [PartnersController],
  providers: [PartnersService]
})
export class PartnersModule {}
