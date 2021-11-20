import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
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
import { isDev } from './utils';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [isDev() ? '.env.dev' : '.env.prd'],
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
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
