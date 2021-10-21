import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { toObjectId } from 'src/utils';
import { DeepPartial, MongoRepository } from 'typeorm';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly repository: MongoRepository<User>;

  async getUser() {
    return await this.repository.find({});
  }

  async createUser(param: DeepPartial<User>) {
    return await this.repository.save({ ...param, isBirthdaySend: false });
  }

  async deleteUser(userId: string) {
    await this.repository.deleteOne({ _id: toObjectId(userId) });
    return true;
  }
}
