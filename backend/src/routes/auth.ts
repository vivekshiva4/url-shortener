import { Router, Request, Response } from 'express';
import { register, login } from '../controllers/authController';
import { check } from 'express-validator';
import { ERROR_MESSAGES } from '../constants';

interface RegisterRequestBody {
  username: string;
  password: string;
}

interface LoginRequestBody {
  username: string;
  password: string;
}

const router = Router();

const registerValidationRules = [
  check('username')
    .trim()
    .notEmpty()
    .withMessage(ERROR_MESSAGES.USERNAME_REQUIRED)
    .isLength({ min: 3 })
    .withMessage(ERROR_MESSAGES.USERNAME_TOO_SHORT),

  check('password')
    .notEmpty()
    .withMessage(ERROR_MESSAGES.PASSWORD_REQUIRED)
    .isLength({ min: 6 })
    .withMessage(ERROR_MESSAGES.PASSWORD_TOO_SHORT),
];

const loginValidationRules = [
  check('username')
    .trim()
    .notEmpty()
    .withMessage(ERROR_MESSAGES.USERNAME_REQUIRED),

  check('password')
    .notEmpty()
    .withMessage(ERROR_MESSAGES.PASSWORD_REQUIRED),
];

router.post(
  '/register',
  registerValidationRules,
  async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
    try {
      const { body: { username, password } } = req;
      const { username: createdUsername } = await register(username, password);
      return res
        .status(201)
        .json({ message: `User created successfully for the username ${createdUsername}` });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.UNEXPECTED_ERROR;
      const statusCode = errorMessage === ERROR_MESSAGES.USER_ALREADY_EXISTS ? 409 : 500;
      return res.status(statusCode).json({ error: errorMessage });
    }
  }
);

router.post(
  '/login',
  loginValidationRules,
  async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
    try {
      const { body: { username, password } } = req;
      const {
        user: {
          userId,
          username: userName,
        },
        token,
      } = await login(username, password);
      return res.json({
        userId,
        username: userName,
        token,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.UNEXPECTED_ERROR;
      const statusCode = errorMessage === ERROR_MESSAGES.INVALID_CREDENTIALS ? 400 : 500;

      return res.status(statusCode).json({ error: errorMessage });
    }
  }
);

export default router;
