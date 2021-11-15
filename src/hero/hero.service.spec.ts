import { Test, TestingModule } from '@nestjs/testing';
import { HeroService } from './hero.service';

describe('HeroService', () => {
  let service: HeroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeroService],
    }).compile();

    service = module.get<HeroService>(HeroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
