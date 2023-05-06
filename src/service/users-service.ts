import User from '../models/user';
import * as userRepository from '../repository/user-repository'

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const user = await userRepository.findUserById(id);
    return user;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (userData: User): Promise<User> => {
  try {
    const newUser = await userRepository.createUser(userData);
    return newUser;
  } catch (error) {
    throw error;
  }
};

