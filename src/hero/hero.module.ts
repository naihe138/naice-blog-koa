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
          schema.pre('findOneAndUpdate', function (next) {
            this.findOneAndUpdate({}, { update_at: Date.now() });
            next();
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [HeroController],
  providers: [HeroService],
})
export class HeroModule {}
