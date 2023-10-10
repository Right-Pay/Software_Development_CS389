import ConstsType from '../types/ConstsType';

const AuthErrorMessages = {
  invalidEmail: 'Invalid Email',
  invalidPassword: 'Invalid Password',
  passwordsDoNotMatch: 'Passwords Do Not Match',
  userAlreadyExists: 'User Already Exists',
  errorCreatingUser: 'Error Creating User',
  invalidCode:
    'The code is not right\nEither your email is not correct or you entered an invalid code',
};

const Consts: ConstsType = {
  authErrorMessages: AuthErrorMessages,
};

export default Consts;
