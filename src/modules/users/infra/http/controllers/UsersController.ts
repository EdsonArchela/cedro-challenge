import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateUserService from '@modules/users/services/CreateUserService';
import GetUserService from '../../../services/GetUserService';
import ExportUserInfoService from '../../../services/ExportUserInfoService';
import AppError from '../../../../../shared/errors/AppError';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { fullname, birthday, cpf, rg, password } = request.body;

    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute({
      fullname,
      birthday,
      cpf,
      rg,
      password,
    });

    return response.json(classToClass(user));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const isExport =
      request.path.substring(request.path.lastIndexOf('/') + 1) === 'export';

    if (isExport) {
      const token = request.headers.authorization?.replace('Bearer ', '');
      if (!token) throw new AppError('Failed to authenticate.');
      const exportUserInfoService = container.resolve(ExportUserInfoService);
      const user = await exportUserInfoService.execute(id, token, request.user);
      return response.json(classToClass(user));
    }
    const getUserService = container.resolve(GetUserService);
    const user = await getUserService.execute(id);
    return response.json(classToClass(user));
  }
}
