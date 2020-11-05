import { User, UserDocument } from './users.model';

export class UserService {
  findByUsername(username: string): Promise<UserDocument | null> {
    return User.findOne({ username }).exec();
  }
}
