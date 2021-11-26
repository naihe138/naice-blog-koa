import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { createHash } from 'crypto';
import { Document } from 'mongoose';
import { getEnv } from 'src/utils';

export type userDocument = User & Document;

@Schema()
export class User extends Document {
  @Prop({
    type: String,
    default: 'User',
  })
  name: string;

  @Prop({
    type: String,
    default: getEnv('USER.username') || '',
  })
  username: string;

  @Prop({
    type: String,
    default: '很多事情不是因为有希望才去坚持，而是坚持了才有希望。',
  })
  slogan: string;

  @Prop()
  gravatar: string;

  @Prop({
    type: String,
    default: createHash('md5').update(getEnv('USER.password')).digest('hex'),
  })
  password: string;

  @Prop({
    type: Number,
    default: 1,
  })
  role: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
