import { Prop } from "@nestjs/mongoose";

export class CreatePartnerDto {
  title: string;
  rep: string;
  contacts: string;
}
