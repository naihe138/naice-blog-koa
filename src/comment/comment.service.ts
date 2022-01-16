import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { Article, articleDocument } from 'src/article/schemas/article.schema';
import { transformIP } from 'src/utils/transformIp';
import { CreateCommentDto, GetArticleComment } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Article.name) private articleModel: Model<articleDocument>,
    private configService: ConfigService,
  ) {}
  async create(createCommentDto: CreateCommentDto, req: Request) {
    const addressInfo = transformIP(req);
    let permalink = 'https://blog.naice.me/about';
    const article = await this.articleModel.findById({
      _id: createCommentDto.post_id,
    });
    article.meta.comments += 1;
    permalink = `https://blog.naice.me/article/${article._id}`;
    // 发布评论
    const result = await new this.commentModel({
      ...createCommentDto,
      ...addressInfo,
    }).save();
    await article.save();
    result.permalink = permalink;
    return result;
  }

  async getArticleComment(opts: GetArticleComment) {
    const {
      sort = -1,
      current_page = 1,
      page_size = 20,
      keyword = '',
      post_id,
      state = 1,
    } = opts;
    // 排序字段
    const sortOptions = {};
    if ([1, -1].includes(sort)) {
      sortOptions['_id'] = sort;
    } else if (Object.is(sort, 2)) {
      sortOptions['likes'] = -1;
    }
    const result = this.commentModel.aggregate([
      {
        $skip: Number(current_page - 1) * Number(page_size), // 跳过第几个
      },
      {
        $limit: Number(page_size), // 限制返回数量
      },
      {
        $match: {
          state: state, // 审核状态
          post_id: post_id,
        },
      },
      {
        $regexMatch: {
          input: '$content',
          regex: keyword,
          options: 'i',
        },
      },
      {
        $sort: sortOptions,
      },
    ]);
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    return this.commentModel.findByIdAndUpdate(id, updateCommentDto);
  }

  async remove(id: string) {
    return await this.commentModel.findByIdAndRemove(id);
  }

  // 喜欢评论
  async like(id: string) {
    let comment = await this.commentModel.findById(id);
    if (comment) {
      comment.likes += 1;
      comment = await comment.save();
    }
    return comment;
  }
}
