
export class CreateRequestDto {
  issueDate: Date;
  initiator: string;
  title: string;
  orderQuantity: number;
  deliveryPlanned: Date;
  project: string;
  shortDescription: string;
  department: number;
  status: number;
  goods: string[];
}
