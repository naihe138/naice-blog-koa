import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { resError, resSuccess } from 'src/utils';
import xss from 'xss';
import { CreateHeroDto, FindByOptions } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { HeroService } from './hero.service';
@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Post()
  async create(@Body() createHeroDto: CreateHeroDto, @Req() req: Request) {
    createHeroDto.content = xss(createHeroDto.content);
    try {
      const article = await this.heroService.create(createHeroDto, req);
      return resSuccess('添加留言成功', article);
    } catch (err) {
      return resError('添加留言失败', err);
    }
  }

  @Post('/get')
  async findByOptions(@Body() options: FindByOptions) {
    return this.heroService.findByOptions(options);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHeroDto: UpdateHeroDto) {
    return this.heroService.update(id, updateHeroDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.heroService.remove(id);
  }
}
