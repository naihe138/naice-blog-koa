import { CreateHeroDto } from './create-hero.dto';

export type TPagination = {
  total: number;
  current_page: number;
  total_page: number;
  page_size: number;
};

export type TFindHero = {
  pagination: TPagination;
  list: Array<CreateHeroDto>;
};
