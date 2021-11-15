import { PartialType } from '@nestjs/mapped-types';
import { CreateHeroDto } from './create-hero.dto';

export class UpdateHeroDto extends PartialType(CreateHeroDto) {}
