import path from 'path';
import fs from 'fs';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '../services/CreateUserService';
import User from '../infra/typeorm/entities/User';
import AppError from '../../../shared/errors/AppError';
import ExportUserInfoService from '../services/ExportUserInfoService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let exportUser: ExportUserInfoService;
let token: string;
let auth: { id: string; ip: string };
let createdUser: User;
const tmpFolder = path.resolve(__dirname, '..', '..', '..', '..', 'tmp');

describe('Export User', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    exportUser = new ExportUserInfoService(fakeUsersRepository);

    createdUser = await createUser.execute({
      fullname: 'John Doe',
      birthday: '01/01/2000',
      cpf: '12345678911',
      rg: '12345678',
      password: 'pass',
    });

    token = 'abcdefegdsddffssd';
    auth = {
      id: createdUser.id,
      ip: '127.168.1.1',
    };
  });

  it('should be able to find an existing user by id', async () => {
    const user = await exportUser.execute(createdUser.id, token, auth);

    expect(user).toBeInstanceOf(User);
    expect(
      fs.existsSync(`${tmpFolder}/${createdUser.fullname}.txt`),
    ).not.toBeFalsy();
    fs.unlinkSync(`${tmpFolder}/${createdUser.fullname}.txt`);
  });

  it('should not be able to find an user with a false id', async () => {
    await expect(exportUser.execute('123', token, auth)).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should not be able to export with a false auth id', async () => {
    await expect(
      exportUser.execute(createdUser.id, token, {
        id: 'false id',
        ip: auth.ip,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to export on a non existing directory', async () => {
    createdUser.fullname = 'test/name';
    jest.spyOn(fs, 'writeFile');
    await exportUser.execute(createdUser.id, token, auth);
    expect(fs.writeFile).toThrowError();
    expect(
      fs.existsSync(`${tmpFolder}/${createdUser.fullname}.txt`),
    ).toBeFalsy();
  });
});
