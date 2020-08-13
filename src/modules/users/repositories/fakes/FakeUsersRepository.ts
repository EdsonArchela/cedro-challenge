import { v4 } from 'uuid';
import IUserDTO from '../../dtos/IUserDTO';
import IUsersRepository from '../IUsersRepository';
import User from '../../infra/typeorm/entities/User';

export default class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async create(userData: IUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: v4(), admin: false }, userData);

    this.users.push(user);

    return user;
  }

  public async findByCPF(cpf: string): Promise<User | undefined> {
    const findedUser = this.users.find(user => user.cpf === cpf);

    return findedUser;
  }

  public async findById(id: string): Promise<User | undefined> {
    const findedUser = this.users.find(user => user.id === id);

    return findedUser;
  }
}
