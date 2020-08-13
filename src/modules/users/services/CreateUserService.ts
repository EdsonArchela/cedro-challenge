import { injectable, inject } from 'tsyringe';
import { parse } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';
import IUserDTO from '../dtos/IUserDTO';

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    fullname,
    birthday,
    cpf,
    rg,
    password,
  }: IUserDTO): Promise<User> {
    const checkUserExists = await this.usersRepository.findByCPF(cpf);

    if (checkUserExists) {
      throw new AppError(
        'Endereço de email já existe. Tente recuperar a senha',
      );
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      fullname,
      birthday:
        typeof birthday === 'string'
          ? parse(birthday, 'dd/MM/yyyy', new Date())
          : birthday,
      cpf,
      rg,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;
