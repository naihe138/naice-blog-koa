import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { resError, resSuccess } from 'src/utils';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  async create(@Body() createTagDto: CreateTagDto) {
    const message = 'tag create';
    try {
      const tag = this.tagService.create(createTagDto);
      return resSuccess(tag, message);
    } catch (err) {
      return resError(err, message);
    }
  }

  @Get()
  async findAll() {
    const message = 'tag findAll';
    try {
      const tags = await this.tagService.findAll();
      return resSuccess(tags, message);
    } catch (err) {
      return resError(err, message);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(+id);
  }

  @Post()
  update(@Body() updateTagDto: UpdateTagDto) {
    const message = 'tag update';
    try {
      const tags = this.tagService.update(updateTagDto);
      return resSuccess(tags, message);
    } catch (err) {
      return resError(err, message);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(id);
  }
}
