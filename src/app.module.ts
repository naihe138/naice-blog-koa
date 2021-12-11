import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import envConfig from './config/configuration';
import { HeroModule } from './hero/hero.module';
import { MusicModule } from './music/music.module';
import { ProjectModule } from './project/project.module';
import { ReplyModule } from './reply/reply.module';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';
import { config } from './utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfig],
      isGlobal: true,
    }),
    MongooseModule.forRoot(config.MONGODB_URI),
    HeroModule,
    MusicModule,
    ProjectModule,
    TagModule,
    ArticleModule,
    ReplyModule,
    UserModule,
    CommentModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
