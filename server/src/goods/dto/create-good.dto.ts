import { Request } from "../../requests/requests.schema";

export class CreateGoodDto {
  title: string;
  quantity: number;
  units: string;
  notes: string;
  stockQuantity: number;
  request: Request;
  images: {src: string, title: string}[];
}
