import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from '../services/CreateUserService';
import AppError from '../../../shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('Create User', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      fullname: 'John Doe',
      birthday: '01/01/2000',
      cpf: '12345678911',
      rg: '12345678',
      password: 'pass',
    });

    expect(user).toHaveProperty('id');
    expect(user.cpf).toBe('12345678911');
  });

  it('shoul not be able to create a new user with same CPF from another', async () => {
    await createUser.execute({
      fullname: 'John Doe',
      birthday: '01/01/2000',
      cpf: '12345678911',
      rg: '12345678',
      password: 'pass',
    });

    await expect(
      createUser.execute({
        fullname: 'Joana Doe',
        birthday: '01/01/2010',
        cpf: '12345678911',
        rg: '12344545',
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
