import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { ArticleSchema } from './schemas/article.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Article',
        useFactory: () => {
          const schema = ArticleSchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require('mongoose-paginate-v2'));
          return schema;
        },
      },
    ]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
