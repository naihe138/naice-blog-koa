import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagSchema } from './schemas/tag.schema';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Tag',
        useFactory: () => {
          const schema = TagSchema;
          schema.pre('findOneAndUpdate', function (next) {
            this.findOneAndUpdate({}, { update_at: Date.now() });
            next();
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
