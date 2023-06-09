import { RegisterRequest } from '../../../src/authorization/models/user';
import * as userRepository from '../../../src/authorization/repository/auth-repository';
import { registerUser, loginUser } from '../../../src/authorization/service/auth-service';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';


jest.mock('jsonwebtoken', () => {
    return {
        __esModule: true,
        ...jest.requireActual('jsonwebtoken'),
    };
});

jest.mock('bcryptjs', () => {
    return {
        __esModule: true,
        ...jest.requireActual('bcryptjs'),
    };
});

const registerRequestMock: RegisterRequest = {
    email: 'test@example.com',
    username: 'testuser',
    password: 'testpassword',
};

const loginRequestMock = {
    email: 'test@example.com',
    password: 'testpassword',
};

const iUserResponseMock = {
    email: 'test@example.com',
    _id: 'user-id',
    password: 'hashed-password'
};


describe('Auth Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('registerUser', () => {

        it('should register a new user and generate auth response', async () => {

            jest.spyOn(userRepository, 'register').mockResolvedValue(iUserResponseMock as any);
            jest.spyOn(jwt, 'sign').mockImplementation(() => 'mocked-token');

            const authResponse = await registerUser(registerRequestMock);

            expect(userRepository.register).toHaveBeenCalledWith(registerRequestMock);
            expect(jwt.sign).toHaveBeenCalledWith({
                email: iUserResponseMock.email,
                userId: iUserResponseMock._id,
            }, 'somesupersecretsecret', { expiresIn: 3600 })

            expect(authResponse.userId).toBe('user-id');
            expect(authResponse.expiresIn).toBe(3600);
            expect(authResponse.token).toBe('mocked-token');
        });

        it('should throw an error if registration fails', async () => {
            const userToRegister = {
                email: 'test@example.com',
                username: 'testuser',
                password: 'testpassword',
            };

            const errorMessage = 'Failed to register user.';
            jest.spyOn(userRepository, 'register').mockRejectedValue(new Error(errorMessage));

            await expect(registerUser(userToRegister)).rejects.toThrow(errorMessage);
        });

        it('should throw an error if token generation fails', async () => {
            jest.spyOn(userRepository, 'register').mockResolvedValue(iUserResponseMock as any);
            jest.spyOn(jwt, 'sign').mockImplementation(() => { throw new Error('Failed to generate token.') });
            expect(registerUser(registerRequestMock)).rejects.toThrow('Failed to register user.');
        });

    });

    describe('loginUser', () => {

        it('should login a user and generate auth response', async () => {
            jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(iUserResponseMock as any);
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
            jest.spyOn(jwt, 'sign').mockImplementation(() => 'mocked-token');


            const authResponse = await loginUser(loginRequestMock);

            expect(userRepository.findUserByEmail).toHaveBeenCalledWith(loginRequestMock.email);
            expect(bcrypt.compare).toHaveBeenCalledWith(loginRequestMock.password, iUserResponseMock.password);
            expect(authResponse.userId).toBe('user-id');
            expect(authResponse.expiresIn).toBe(3600);
            expect(authResponse.token).toBe('mocked-token');
        });

        it('should throw "Failed to login user" if user not found', async () => {
            jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(null);
            expect(loginUser(loginRequestMock)).rejects.toThrow('Failed to login user.');
        });

        it('should throw "Failed to login user" if password is wrong', async () => {
            jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(iUserResponseMock as any);
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);
            expect(loginUser(loginRequestMock)).rejects.toThrow('Failed to login user.');
        });
    });
});
