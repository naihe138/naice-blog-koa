import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag, tagDocument } from './schemas/tag.schema';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<tagDocument>) {}
  async create(createTagDto: CreateTagDto) {
    const { name } = createTagDto;
    // 添加前，先验证是否有相同 name
    const res = await this.tagModel.find({ name });
    if (res && res.length !== 0) {
      throw new Error('标签名已经存在');
    } else {
      const tag = await new this.tagModel(createTagDto);
      return await tag.save();
    }
  }

  findAll() {
    return `This action returns all tag`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  async update(updateTagDto: UpdateTagDto) {
    const { name, descript, id } = updateTagDto;
    return await this.tagModel.findByIdAndUpdate(
      id,
      { name, descript },
      { new: true },
    );
  }

  remove(id: string) {
    return this.tagModel.findByIdAndRemove(id);
  }
}
