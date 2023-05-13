import User, { IUser } from '../models/user';


export const register = async (user: Partial<IUser>): Promise<IUser> => {
    return new User(user).save();
}


export const findUserByEmail = async (email: string): Promise<IUser | null> => {
    return User.findOne({ email: email });
}
