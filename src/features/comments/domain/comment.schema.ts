import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { randomUUID } from 'crypto';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({
    required: true,
    unique: true,
    default: randomUUID,
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

  @Prop({
    required: true,
    type: String,
    default: () => new Date().toISOString(),
  })
  createdAt: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
