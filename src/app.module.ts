import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { CommentModule } from './comment/comment.module';
import { HeroModule } from './hero/hero.module';
import { MusicModule } from './music/music.module';
import { ProjectModule } from './project/project.module';
import { ReplyModule } from './reply/reply.module';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    HeroModule,
    MusicModule,
    ProjectModule,
    TagModule,
    ArticleModule,
    ReplyModule,
    UserModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
