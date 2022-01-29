import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from 'src/comment/schemas/comment.schema';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { Reply, ReplySchema } from './schemas/reply.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Reply.name,
        useFactory: () => {
          const schema = ReplySchema;
          schema.pre('findOneAndUpdate', function (next) {
            this.findOneAndUpdate({}, { update_at: Date.now() });
            next();
          });
          return schema;
        },
      },
      {
        name: Comment.name,
        useFactory: () => {
          const schema = CommentSchema;
          schema.pre('findOneAndUpdate', function (next) {
            this.findOneAndUpdate({}, { update_at: Date.now() });
            next();
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [ReplyController],
  providers: [ReplyService],
})
export class ReplyModule {}
