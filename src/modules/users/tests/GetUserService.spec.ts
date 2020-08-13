import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '../services/CreateUserService';
import GetUserService from '../services/GetUserService';
import User from '../infra/typeorm/entities/User';
import AppError from '../../../shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let getUser: GetUserService;

describe('Get User', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    getUser = new GetUserService(fakeUsersRepository);
  });

  it('should be able to find an existing user by id', async () => {
    const createdUser = await createUser.execute({
      fullname: 'John Doe',
      birthday: '01/01/2000',
      cpf: '12345678911',
      rg: '12345678',
      password: 'pass',
    });

    const user = await getUser.execute(createdUser.id);

    expect(user).toBeInstanceOf(User);
  });

  it('should not be able to find an user with a false id', async () => {
    const createdUser = await createUser.execute({
      fullname: 'John Doe',
      birthday: '01/01/2000',
      cpf: '12345678911',
      rg: '12345678',
      password: 'pass',
    });

    await expect(getUser.execute('123')).rejects.toBeInstanceOf(AppError);
  });
});
