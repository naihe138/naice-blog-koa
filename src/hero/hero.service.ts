import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { Hero, HeroDocument } from './schemas/hero.schema';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const geoip = require('geoip-lite');
@Injectable()
export class HeroService {
  constructor(
    @InjectModel(Hero.name) private heroModel: Model<HeroDocument>,
    private configService: ConfigService,
  ) {}
  async create(hero: CreateHeroDto, req: Request) {
    // 获取ip地址以及物理地理地址
    let ip = '0.0.0.0';
    const headers = req.headers;
    if (headers['x-real-ip']) {
      ip = headers['x-real-ip'] as string;
    }
    if (headers['x-forwarded-for']) {
      const ipList = (headers['x-forwarded-for'] as string).split(',');
      ip = ipList[0];
    }

    hero.ip = ip;
    hero.agent = req.headers['user-agent'] || hero.agent;

    const ip_location = geoip.lookup(hero.ip);

    if (ip_location) {
      hero.city = ip_location.city;
      hero.range = ip_location.range;
      hero.country = ip_location.country;
      if (Array.isArray(hero.range)) {
        hero.range = hero.range.join(',');
      }
    }

    return await new Hero(hero).save();
  }

  findAll() {
    return `This action returns all hero`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hero`;
  }

  update(id: number, updateHeroDto: UpdateHeroDto) {
    return `This action updates a #${id} hero`;
  }

  remove(id: number) {
    return `This action removes a #${id} hero`;
  }
}
