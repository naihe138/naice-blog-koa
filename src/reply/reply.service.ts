import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from 'src/comment/schemas/comment.schema';
import { transformIP } from 'src/utils/transformIp';
import xss from 'xss';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { Reply } from './entities/reply.entity';
import { ReplyDocument } from './schemas/reply.schema';

@Injectable()
export class ReplyService {
  constructor(
    @InjectModel(Reply.name) private replyModel: Model<ReplyDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}
  async create(createReplyDto: CreateReplyDto, req: Request) {
    const content = xss(createReplyDto.content);
    const ipInfo = transformIP(req);
    const newReply = {
      like: 0,
      ...createReplyDto,
      content,
      ...ipInfo,
    };
    // 发布评论回复
    const res = await new this.replyModel(newReply).save();
    let permalink = 'https://blog.naice.me';
    if (createReplyDto.post_id) {
      permalink = `https://blog.naice.me/article/${createReplyDto.post_id}`;
    }
    // 让原来评论数+1
    const comment = await this.commentModel.findOne({
      _id: createReplyDto.cid,
    });
    if (comment) {
      // 每次评论，reply 都增加一次
      comment.reply += 1;
      await comment.save();
    }
    return {
      ...res,
      permalink,
    };
  }

  async findAll() {
    return await this.replyModel.find({});
  }

  async findById(id: string) {
    return {};
  }

  async like(id: string) {
    const res = await this.replyModel.findById(id);
    if (res) {
      res.likes += 1;
      await res.save();
    }
    return res;
  }

  async update(id: string, updateReplyDto: UpdateReplyDto) {
    return await this.replyModel.findByIdAndUpdate(id, updateReplyDto);
  }

  async remove(id: string) {
    return await this.replyModel.findByIdAndRemove(id);
  }
}
