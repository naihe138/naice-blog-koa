import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type ReplyDocument = Reply & Document;

// 文章评论
@Schema()
export class Reply extends Document {
  @Prop({
    type: String,
    required: true,
  })
  post_id: string; // 评论所在的文章_id，0代表系统留言板

  @Prop({
    type: String,
    required: true,
  })
  cid: string; // pid，0代表默认留言

  @Prop(
    raw({
      gravatar: { type: String }, // 头像
      name: { type: String }, // 用户名
      email: { type: String }, // 邮箱
      site: { type: String }, // 网站
    }),
  )
  from: Record<string, any>; // 评论产生者

  @Prop(
    raw({
      gravatar: { type: String }, // 头像
      name: { type: String }, // 用户名
      email: { type: String }, // 邮箱
      site: { type: String }, // 网站
    }),
  )
  to: Record<string, any>; // 评论产生者

  @Prop({
    type: String,
    required: true,
  })
  content: string; // 评论内容

  @Prop({
    type: Number,
    default: 0,
  })
  likes: number; // 评论内容

  @Prop({
    type: String,
  })
  ip: string; // ip 物理地址

  @Prop({
    type: String,
  })
  range: string; // 地域

  @Prop({
    type: String,
  })
  city: string; // 城市

  @Prop({
    type: String,
  })
  country: string; // 国家

  @Prop({
    type: String,
  })
  agent: string; // 用户ua

  @Prop({
    type: Number,
    default: 1,
  })
  state: number; // 状态  0 待审核，1 审核通过， 2 审核不通过

  @Prop({
    type: Date,
    default: Date.now(),
  })
  create_at: Date; // 发布日期

  @Prop({
    type: Date,
  })
  update_at: string; // 最后修改日期
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
