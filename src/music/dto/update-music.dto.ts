import { PartialType } from '@nestjs/mapped-types';
import { CreateMusicDto } from './create-music.dto';

export class UpdateMusicDto extends PartialType(CreateMusicDto) {}
