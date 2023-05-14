import { IUser } from '../../../src/authorization/models/user';
import { register, findUserByEmail } from '../../../src/authorization/repository/auth-repository';
import User from '../../../src/authorization/models/user';

const mockedUser: Partial<IUser> = {
  email: 'test@example.com',
  username: 'testuser',
  password: 'testpassword',
};

describe('register', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save the user and return the saved user', async () => {
    const saveSpy = jest.spyOn(User.prototype, 'save').mockResolvedValueOnce(mockedUser);

    const result = await register(mockedUser);

    expect(User.prototype.save).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalledWith();
    expect(result).toEqual(mockedUser);
  });
});

describe('findUserByEmail', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find a user by email and return it', async () => {
    const findOneSpy = jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockedUser);

    const result = await findUserByEmail(mockedUser.email!);

    expect(User.findOne).toHaveBeenCalled();
    expect(findOneSpy).toHaveBeenCalledWith({ email: mockedUser.email });
    expect(result).toEqual(mockedUser);
  });

  it('should return null if no user found', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);

    const result = await findUserByEmail(mockedUser.email!);

    expect(User.findOne).toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
