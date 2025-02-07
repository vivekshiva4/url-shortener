import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import logger from '../logger';
import { DUMMY_JWT_SECRET, ERROR_MESSAGES } from "../constants";
import { v4 as uuidv4 } from 'uuid';


const JWT_SECRET = process.env.JWT_SECRET || DUMMY_JWT_SECRET;

export const register = async (userName: string, password: string): Promise<User> => {
  const userRepository = getRepository(User);
  const existingUser = await userRepository.findOne({ where: { userName } });
  if (existingUser) {
    logger.error({ message: ERROR_MESSAGES.USER_ALREADY_EXISTS})
    throw new Error(ERROR_MESSAGES.USER_ALREADY_EXISTS);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User();
  newUser.username = userName;
  newUser.password = hashedPassword;
  newUser.userId = uuidv4();
  await userRepository.save(newUser);
  return newUser;
};

export const login = async (username: string, password: string): Promise<{ token: string; user: User }> => {
  const userRepository = getRepository(User);
  const user = await userRepository.findOne({ where: { username } });
  if (!user) {
    logger.error({ message: ERROR_MESSAGES.INVALID_CREDENTIALS})
    throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }
  const token = jwt.sign(
    { userId: user.userId, username: user.username },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  return { token, user };
};
