import { Test, TestingModule } from '@nestjs/testing';
import { HeroController } from './hero.controller';
import { HeroService } from './hero.service';

describe('HeroController', () => {
  let controller: HeroController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeroController],
      providers: [HeroService],
    }).compile();

    controller = module.get<HeroController>(HeroController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
