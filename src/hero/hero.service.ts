import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { transformIP } from 'src/utils/transformIp';
import { TFindHero } from './dto/create-hero-type';
import { CreateHeroDto, FindByOptions } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { Hero, HeroDocument } from './schemas/hero.schema';
@Injectable()
export class HeroService {
  constructor(
    @InjectModel(Hero.name) private heroModel: Model<HeroDocument>,
    private configService: ConfigService,
  ) {}
  async create(hero: CreateHeroDto, req: Request) {
    const addressInfo = transformIP(req);
    return await new this.heroModel({ ...hero, ...addressInfo }).save();
  }

  async findByOptions(opts: FindByOptions) {
    const { current_page = 1, page_size = 12, keyword = '', state = 1 } = opts;
    let result: Partial<TFindHero> = {};
    // 过滤条件

    const aggregationOptions = [
      {
        $skip: Number(current_page - 1) * Number(page_size), // 跳过第几个
      },
      {
        $limit: Number(page_size), // 限制返回数量
      },
      {
        $match: {
          state: state, // 审核状态
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
        $sort: {
          _id: -1,
        },
      },
    ];
    if (!keyword) {
      aggregationOptions.splice(3, 1);
    }

    const list = await this.heroModel.aggregate(aggregationOptions);
    const total = await this.heroModel.find().count();
    if (list) {
      result = {
        pagination: {
          total,
          current_page,
          page_size,
          total_page: Math.ceil(total / Number(page_size)),
        },
        list,
      };
    } else {
      result = {};
    }
    return result;
  }

  update(id: string, updateHeroDto: UpdateHeroDto) {
    return this.heroModel.findByIdAndUpdate(id, updateHeroDto);
  }

  remove(id: string) {
    return this.heroModel.findByIdAndRemove(id);
  }
}
