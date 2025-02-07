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
      const { username, password } = req.body;
      const { token, user } = await register(username, password);
      return res.status(201).json({
        data: {
          attributes: {
            userId: user.userId,
            username: user.username,
            token,
          },
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : ERROR_MESSAGES.UNEXPECTED_ERROR;
      const statusCode =
        errorMessage === ERROR_MESSAGES.USER_ALREADY_EXISTS ? 409 : 500;
      return res.status(statusCode).json({ errors: [{ detail: errorMessage }] });
    }
  }
);

router.post(
  '/login',
  loginValidationRules,
  async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
    try {
      const { username, password } = req.body;
      const { token, user } = await login(username, password);
      return res.json({
        data: {
          attributes: {
            userId: user.userId,
            username: user.username,
            token,
          },
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : ERROR_MESSAGES.UNEXPECTED_ERROR;
      const statusCode =
        errorMessage === ERROR_MESSAGES.INVALID_CREDENTIALS ? 400 : 500;
      return res.status(statusCode).json({ errors: [{ detail: errorMessage }] });
    }
  }
);

export default router;
