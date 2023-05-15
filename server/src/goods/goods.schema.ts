import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Request } from "../requests/requests.schema";

export type GoodDocument = HydratedDocument<Good>;

@Schema()
export class Good {
  @Prop()
  title: string;

  @Prop([{ src: String, title: String }])
  images: [{ src: string, title: string }];

  @Prop()
  quantity: number;

  @Prop()
  units: string;

  @Prop()
  notes: string;

  @Prop()
  stockQuantity: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Request" })
  // @Prop()
  request: Request;
}

const GoodSchema = SchemaFactory.createForClass(Good);

// Duplicate the ID field.
GoodSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
GoodSchema.set('toJSON', {
  virtuals: true
});

// Ensure virtual fields are serialised.
GoodSchema.set('toObject', {
  virtuals: true
});

export {GoodSchema}