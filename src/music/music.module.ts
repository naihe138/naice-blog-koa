import { Module } from '@nestjs/common';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';

@Module({
  controllers: [MusicController],
  providers: [MusicService],
})
export class MusicModule {}
