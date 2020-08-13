import User from '../infra/typeorm/entities/User';
import IUserDTO from '../dtos/IUserDTO';

export default interface IUsersRepository {
  create(userData: IUserDTO): Promise<User>;
  findByCPF(cpf: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
}
