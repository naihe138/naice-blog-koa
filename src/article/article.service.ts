import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import request from 'request';
import transformMarkdown from 'src/utils/transform-markdown';
import { CreateArticleDto } from './dto/create-article.dto';
import { FindArticleDto } from './dto/find-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, articleDocument } from './schemas/article.schema';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<articleDocument>,
    private configService: ConfigService,
  ) {}
  async create(createArticleDto: CreateArticleDto) {
    const htmlData = transformMarkdown(createArticleDto.content);
    createArticleDto.editContent = htmlData.html;
    const article = await new this.articleModel(createArticleDto).save();
    // 百度 seo push
    const BAIDU = this.configService.get('BAIDU');
    const INFO = this.configService.get('INFO');
    request.post(
      {
        url: `http://data.zz.baidu.com/urls?site=${BAIDU.site}&token=${BAIDU.token}`,
        headers: { 'Content-Type': 'text/plain' },
        body: `${INFO.site}/article/${article._id}`,
      },
      (error, response, body) => {
        console.log('推送结果：', body);
      },
    );
    return article;
  }

  async find(findArticleDto: FindArticleDto) {
    const {
      current_page = 1,
      page_size = 10,
      keyword = '',
      state = 1,
      publish = 1,
      tag,
      type,
      date,
      hot,
    } = findArticleDto;
    // 过滤条件
    const options: any = {
      sort: { create_at: -1 },
      page: Number(current_page),
      limit: Number(page_size),
      populate: ['tag'],
      select: '-content',
    };

    // 参数
    const querys: any = {};

    // 关键词查询
    if (keyword) {
      const keywordReg = new RegExp(keyword);
      querys['$or'] = [
        { title: keywordReg },
        { content: keywordReg },
        { description: keywordReg },
      ];
    }

    // 按照state查询
    if ([1, 2].includes(state)) {
      querys['state'] = state;
    }

    // 按照公开程度查询
    if ([1, 2].includes(publish)) {
      querys['publish'] = publish;
    }

    // 按照类型程度查询
    if ([1, 2, 3].includes(type)) {
      querys['type'] = type;
    }

    // 按热度排行
    if (hot) {
      options['sort'] = {
        'meta.views': -1,
        'meta.likes': -1,
        'meta.comments': -1,
      };
    }

    // 时间查询
    if (date) {
      const getDate: number = new Date(date).getTime();
      if (!Object.is(getDate.toString(), 'Invalid Date')) {
        querys.create_at = {
          $gte: new Date((getDate / 1000 - 60 * 60 * 8) * 1000),
          $lt: new Date((getDate / 1000 + 60 * 60 * 16) * 1000),
        };
      }
    }
    if (tag) {
      querys['tag'] = tag;
    }

    // 查询
    const amodule = this.articleModel as any;
    const result = await amodule.paginate(querys, options);
    if (result) {
      return {
        pagination: {
          total: result.totalDocs,
          current_page: result.totalPages,
          total_page: result.page,
          page_size: result.limit,
        },
        list: result.docs,
      };
    } else {
      return false;
    }
  }

  async findAll() {
    // 查询
    const article = await this.articleModel.aggregate([
      {
        $match: {
          state: 1,
          publish: 1,
        },
      },
      {
        $project: {
          year: { $year: '$create_at' },
          month: { $month: '$create_at' },
          title: 1,
          create_at: 1,
        },
      },
      {
        $group: {
          _id: {
            year: '$year',
            month: '$month',
          },
          article: {
            $push: {
              title: '$title',
              _id: '$_id',
              create_at: '$create_at',
            },
          },
        },
      },
    ]);
    if (article) {
      const yearList = [...new Set(article.map((item) => item._id.year))].map(
        (item) => {
          const monthList = [];
          article.forEach((n) => {
            // 同一年
            if (n._id.year === item) {
              monthList.push({
                month: n._id.month,
                articleList: n.article,
              });
            }
          });
          monthList.sort((a, b) => a.month - b.month);
          return { year: item, monthList };
        },
      );
      return yearList.sort((a, b) => b.year - a.year);
    } else {
      return [];
    }
  }

  async findOne(id: string) {
    let article = await this.articleModel.findById(id).populate('tag');
    if (article) {
      // 每次请求，views 都增加一次
      article.meta.views += 1;
      article = await article.save();
    }
    return article;
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    const htmlData = transformMarkdown(updateArticleDto.content);
    updateArticleDto.editContent = htmlData.html;
    return await this.articleModel.findByIdAndUpdate(id, updateArticleDto);
  }

  async remove(id: string) {
    return await this.articleModel.findByIdAndRemove(id);
  }

  async like(id: string) {
    let res = await this.articleModel.findById(id);
    if (res) {
      // 每次请求，views 都增加一次
      res.meta.likes += 1;
      res = await res.save();
    }
    return res;
  }
}
