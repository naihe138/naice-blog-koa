import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { resError, resSuccess } from 'src/utils';
import transformMarkdown from 'src/utils/transform-markdown';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { FindArticleDto } from './dto/find-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Post('get')
  find(@Body() findArticleDto: FindArticleDto) {
    return this.articleService.find(findArticleDto);
  }

  @Get('getAll')
  findAll() {
    return this.articleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (id) {
      try {
        const res = await this.articleService.findOne(id);
        return resSuccess('查询文章成功', res);
      } catch (err) {
        return resError('查询文章失败', err);
      }
    } else {
      resError('查询文章失败', { err: '缺少参数id' });
    }
  }

  @Post(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    if (id) {
      try {
        const article = await this.articleService.update(id, updateArticleDto);
        return resSuccess(article, '修改文章成功');
      } catch (err) {
        return resError(err, '修改文章失败');
      }
    } else {
      return resError({}, '地址缺少参数id');
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(id);
  }

  @Post('transfrom')
  async transfromMD(@Body() transformArticel: { article: string }) {
    const { article } = transformArticel;
    try {
      const ahtml = transformMarkdown(article);
      resSuccess('transfrom成功', ahtml);
    } catch (err) {
      resError('transfrom失败', err);
    }
  }

  @Post('like/:id')
  async like(@Param('id') id: string) {
    if (id) {
      try {
        const res = await this.articleService.like(id);
        resSuccess('like成功', res);
      } catch (err) {
        resError('like失败', err);
      }
    } else {
      resError('like失败', { err: '地址缺少参数id' });
    }
  }
}
