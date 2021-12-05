import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { resError, resSuccess } from 'src/utils';
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

  @Post()
  find(@Body() findArticleDto: FindArticleDto) {
    return this.articleService.find(findArticleDto);
  }

  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
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
    return this.articleService.remove(+id);
  }
}
