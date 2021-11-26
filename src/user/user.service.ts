import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getEnv, md5Decode } from 'src/utils';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, userDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<userDocument>) {}

  async create() {
    const user = await this.findAll();
    console.log('user', user);
    if (user.length === 0) {
      const username = getEnv('USER.username');
      const password = md5Decode(getEnv('USER.password'));
      const newUser = new this.userModel({
        username,
        password,
        role: 100,
      });
      await newUser.save().catch((err) => {
        console.log(500, '服务器内部错误-存储admin错误！');
      });
    }
  }

  async findAll() {
    try {
      return await this.userModel.find({}).exec();
    } catch (err) {
      console.error('user findAll error', err);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
