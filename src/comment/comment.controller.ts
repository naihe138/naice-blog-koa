import { Body, Controller, Delete, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import xss from 'xss';
import { CommentService } from './comment.service';
import { CreateCommentDto, GetArticleComment } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/create')
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ) {
    createCommentDto.content = xss(createCommentDto.content);
    return await this.commentService.create(createCommentDto, req);
  }

  @Post('/getComment')
  findAll(@Body() getArticleComment: GetArticleComment) {
    return this.commentService.getArticleComment(getArticleComment);
  }

  @Post('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return await this.commentService.update(id, updateCommentDto);
  }

  @Delete('/delete/:id')
  async remove(@Param('id') id: string) {
    return await this.commentService.remove(id);
  }
}
