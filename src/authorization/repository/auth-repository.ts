import User, { IUser } from '../models/user';


export const register = async (user: Partial<IUser>): Promise<IUser> => {
    try {
       return new User(user).save();
    } catch (error) {
        throw error;
    }
};
