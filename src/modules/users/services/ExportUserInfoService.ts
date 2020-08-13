import path from 'path';
import { format } from 'date-fns';
import { writeFile } from 'fs';
import { injectable, inject } from 'tsyringe';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';
import AppError from '../../../shared/errors/AppError';

@injectable()
export default class ExportUserInfoService {
  constructor(
    @inject(UsersRepository)
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(
    id: string,
    token: string,
    auth: { id: string; ip: string },
  ): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) throw new AppError('User does not exist.');

    const tmpFolder = path.resolve(__dirname, '..', '..', '..', '..', 'tmp');

    const authUser = await this.usersRepository.findById(auth.id);

    if (!authUser) throw new AppError('Failed to find users token.');

    const info = `Nome Completo: ${user.fullname}\nData de Nascimento: ${format(
      user.birthday,
      'dd/MM/yyyy',
    )}\nCPF: ${user.cpf}\nRG: ${user.rg}\n\nUsuario Autenticado\nLogin: ${
      authUser.fullname
    }\nIP: ${auth.ip}`;

    writeFile(`${tmpFolder}/${user.fullname}.txt`, info, { flag: 'w' }, err => {
      if (err) {
        console.log('ERRR', err);
        throw new AppError('Failed to generate file.');
      }
    });

    return user;
  }
}
