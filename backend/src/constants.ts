export type ErrorMessagesType = {
  USER_ALREADY_EXISTS: string;
  INVALID_CREDENTIALS: string;
  UNEXPECTED_ERROR: string;
  USERNAME_REQUIRED: string;
  USERNAME_TOO_SHORT: string;
  PASSWORD_REQUIRED: string;
  PASSWORD_TOO_SHORT: string;
  SLUG_ALREADY_EXISTED: string;
};

export const ERROR_MESSAGES: ErrorMessagesType = {
  USER_ALREADY_EXISTS: 'User already exists',
  INVALID_CREDENTIALS: 'Invalid credentials',
  UNEXPECTED_ERROR: 'An unexpected error occurred',
  USERNAME_REQUIRED: 'Username is required',
  USERNAME_TOO_SHORT: 'Username must be at least 3 characters long',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
  SLUG_ALREADY_EXISTED: 'Slug already in use',
};

export const DUMMY_JWT_SECRET: string = 'dummy_jwt_secret';
export const SERVER_PORT: number = 5000;
export const BASE_URL: string = 'http://localhost:5000';
export const FRONT_END_BASE_URL: string = '"http://localhost:3000';
