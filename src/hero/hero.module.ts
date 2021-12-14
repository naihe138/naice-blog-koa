import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HeroController } from './hero.controller';
import { HeroService } from './hero.service';
import { Hero, HeroSchema } from './schemas/hero.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Hero.name,
        useFactory: () => {
          const schema = HeroSchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require('mongoose-paginate-v2'));
          return schema;
        },
      },
    ]),
  ],
  controllers: [HeroController],
  providers: [HeroService],
})
export class HeroModule {}
