import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Tag } from 'src/tag/schemas/tag.schema';
export type articleDocument = Article & Document;
@Schema()
export class Article extends Document {
  @Prop({
    type: String,
    required: true,
  })
  title: string; // 文章标题

  @Prop({
    type: String,
    required: true,
  })
  keyword: string; // 关键字

  @Prop({
    type: String,
    required: true,
  })
  descript: string; // 关键字

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
  })
  tag: Tag[]; // 标签

  @Prop({
    type: String,
    required: true,
  })
  content: string; // 内容

  @Prop({
    type: String,
    required: true,
  })
  editContent: string; // 编辑内容

  @Prop({
    type: Number,
    default: 1,
  })
  state: number; // 状态 1 发布 2 草稿

  @Prop({
    type: Number,
    default: 1,
  })
  publish: number; // 文章公开状态 1 公开 2 私密

  @Prop({
    type: String,
  })
  thumb: string; // 海报

  @Prop({
    type: Number,
    default: 1,
  })
  type: number; // 文章分类 1 code 2 think 3 民谣

  @Prop({
    type: Date,
    default: Date.now(),
  })
  create_at: Date; // 发布日期

  @Prop({
    type: Date,
  })
  update_at: string; // 最后修改日期

  @Prop(
    raw({
      views: { type: Number, default: 0 }, // 浏览数
      likes: { type: Number, default: 0 }, // 喜欢数
      comments: { type: Number, default: 0 }, // 评论数
    }),
  )
  meta: Record<string, any>; // 其他元信息
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
