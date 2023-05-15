import { Prop } from "@nestjs/mongoose";

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: string;
  department: number;
}
