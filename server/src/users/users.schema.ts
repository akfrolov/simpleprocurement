import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({unique: true})
  email: string;

  @Prop()
  password: string;

  @Prop()
  role: string;

  @Prop()
  department: number;
}

const UserSchema = SchemaFactory.createForClass(User);

// Duplicate the ID field.
UserSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
UserSchema.set('toJSON', {
  virtuals: true
});

// Ensure virtual fields are serialised.
UserSchema.set('toObject', {
  virtuals: true
});

export {UserSchema}