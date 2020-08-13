import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import UsersController from '../controllers/UsersController';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      fullname: Joi.string().required(),
      birthday: Joi.string().required(),
      cpf: Joi.string().length(11).required(),
      rg: Joi.string().length(8).required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);

usersRouter.use(ensureAuthenticated);

usersRouter.get('/:id/export', usersController.show);
usersRouter.get('/:id', usersController.show);

export default usersRouter;
