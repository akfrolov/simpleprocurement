export class CreateGoodDto {
  title: string;
  quantity: number;
  units: string;
  notes: string;
  stockQuantity: number;
  request: string;
  images: { src: string; title: string }[];
}
