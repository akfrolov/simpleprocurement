
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PartnerDocument = HydratedDocument<Partner>;

@Schema()
export class Partner {
  @Prop()
  title: string;

  @Prop()
  rep: string;

  @Prop()
  contacts: string;
}

const PartnerSchema = SchemaFactory.createForClass(Partner);

// Duplicate the ID field.
PartnerSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
PartnerSchema.set('toJSON', {
  virtuals: true
});

// Ensure virtual fields are serialised.
PartnerSchema.set('toObject', {
  virtuals: true
});

export {PartnerSchema}
