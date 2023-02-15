import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LikeDocument = HydratedDocument<Like>;

@Schema()
export class Like {
  @Prop({ required: true })
  parentId: string;

  @Prop({ required: true })
  parentType: 'post' | 'comment';

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  addedAt: string;

  @Prop({ required: true })
  likesStatus: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
