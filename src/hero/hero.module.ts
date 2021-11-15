import { Module } from '@nestjs/common';
import { HeroService } from './hero.service';
import { HeroController } from './hero.controller';

@Module({
  controllers: [HeroController],
  providers: [HeroService],
})
export class HeroModule {}
