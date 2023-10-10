import {AuthErrorMessagesType} from '../types/ConstsType';

export const AuthErrorMessages: AuthErrorMessagesType = {
  invalidEmail: 'Invalid Email',
  invalidPassword: 'Invalid Password',
  passwordsDoNotMatch: 'Passwords Do Not Match',
  userAlreadyExists: 'User Already Exists',
  errorCreatingUser: 'Error Creating User',
  invalidCode:
    'The code is not right\nEither your email is not correct or you entered an invalid code',
};

const Consts = {
  AuthErrorMessages,
};

export default Consts;
