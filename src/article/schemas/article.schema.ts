import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type tagDocument = Article & Document;

@Schema()
export class Article extends Document {
  @Prop({
    type: String,
    required: true,
    default: 'code',
  })
  name: string; // 标签名称

  @Prop({
    type: String,
  })
  descript: string; // 标签描述

  @Prop({
    type: Date,
    default: Date.now(),
  })
  create_at: Date; // 发布日期

  @Prop({
    type: Date,
  })
  update_at: string; // 最后修改日期

  @Prop({
    type: Number,
    default: 0,
  })
  sort: number; // 排序
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
