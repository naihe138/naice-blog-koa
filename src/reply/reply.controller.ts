import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { ReplyService } from './reply.service';

@Controller('reply')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @Post()
  create(
    @Body(new ValidationPipe()) createReplyDto: CreateReplyDto,
    @Req() req: Request,
  ) {
    return this.replyService.create(createReplyDto, req);
  }

  @Get('all')
  async findAll() {
    return await this.replyService.findAll();
  }

  @Post('find/:id')
  async findOneById(@Param('id') id: string) {
    return await this.replyService.findById(id);
  }

  @Post('edit/:id')
  update(@Param('id') id: string, @Body() updateReplyDto: UpdateReplyDto) {
    return this.replyService.update(id, updateReplyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.replyService.remove(id);
  }
}
