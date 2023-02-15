import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({
    required: true,
    unique: true,
    default: (+new Date()).toString(),
    type: String,
  })
  id: string;

  @Prop({ required: true, type: String })
  parentId: string;

  @Prop({ required: true, type: String })
  content: string;

  @Prop({ required: true, type: String })
  userId: string;

  @Prop({ required: true, type: String })
  userLogin: string;

  @Prop({ required: true, type: String, default: (+new Date()).toString() })
  createdAt: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
