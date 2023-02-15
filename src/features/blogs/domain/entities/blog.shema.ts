import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UpdateBlogDto } from '../../api/dto/update.blog.dto';

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
  @Prop({ required: true, default: (+new Date()).toString() })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  websiteUrl: string;

  @Prop({ required: true, default: new Date().toISOString() })
  createdAt: string;

  @Prop({ default: true })
  isMembership: boolean;

  updateBlog(dto: UpdateBlogDto) {
    this.name = dto.name;
    this.websiteUrl = dto.websiteUrl;
    this.description = dto.description;
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.methods = {
  updateBlog: Blog.prototype.updateBlog,
};
