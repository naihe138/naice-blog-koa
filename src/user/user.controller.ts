import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private configService: ConfigService,
  ) {
    console.log('MONGODB_URI', this.configService.get('MONGODB_URI'));

    this.userService.create();
  }
}
