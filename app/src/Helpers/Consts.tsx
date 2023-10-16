import ConstsType from '../types/ConstsType';

const AuthErrorMessages = {
  invalidEmail: 'Invalid Email',
  invalidPassword: 'Invalid Password',
  passwordsDoNotMatch: 'Passwords Do Not Match',
  userAlreadyExists: 'User Already Exists',
  errorCreatingUser: 'Error Creating User',
  invalidCode:
    'The code is not correct\nEither your email is not correct or you entered an invalid code',
};

const dummyProfile = {
  //Need to change this with an api call
  id: 1,
  name: 'John Doe',
  email: 'johndoe@gmail.com',
  phone: '1234567890',
  address: '1234 Main St',
  city: 'Anytown',
  state: 'CA',
  zip: '12345',
  subscribed: true,
};

const Consts: ConstsType = {
  authErrorMessages: AuthErrorMessages,
  dummyProfile: dummyProfile,
};

export default Consts;
