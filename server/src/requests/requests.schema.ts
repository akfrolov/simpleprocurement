import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../users/users.schema';
import { Partner } from '../partners/partners.schema';

export type RequestDocument = HydratedDocument<Request>;

@Schema()
export class Request {
  @Prop()
  _identifier: number;

  @Prop()
  issueDate: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  initiator: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Partner' })
  supplier: Partner;

  @Prop()
  title: string;

  @Prop()
  orderQuantity: number;

  @Prop()
  deliveryPlanned: string;

  @Prop()
  project: string;

  @Prop()
  shortDescription: string;

  @Prop()
  department: number;

  @Prop()
  status: number;

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Good' }] })
  // @Prop([String])
  // goods: Good[];
}

const RequestSchema = SchemaFactory.createForClass(Request);
// RequestSchema.set("strict", 'throw')
// Duplicate the ID field.
RequestSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

RequestSchema.virtual('identifier').get(function () {
  return `PR-${this._identifier}`;
});

// Ensure virtual fields are serialised.
RequestSchema.set('toJSON', {
  virtuals: true,
});

// Ensure virtual fields are serialised.
RequestSchema.set('toObject', {
  virtuals: true,
});

export { RequestSchema };
