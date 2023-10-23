import ConstsType from '../types/ConstsType';

const AuthErrorMessages = {
  invalidEmail: 'Invalid Email',
  invalidPassword: 'Invalid Password',
  passwordsDoNotMatch: 'Passwords Do Not Match',
  userAlreadyExists: 'User Already Exists',
  userNotFound: 'User Not Found\nEither Email or Password is Incorrect',
  errorCreatingUser: 'Error Creating User',
  tooManyAttepts:
    'Too Many Attempts\nCheck Your Email for Further Instructions',
  invalidCode:
    'The code is not correct\nEither your email is not correct or you entered an invalid code',
  errorChangingPassword: 'Error Changing Password',
  sentRestEmail: 'Check Your Email for Further Instructions',
  invalidToken: 'Invalid Token\nPlease Contact Support',
};

const dummyProfile = {
  //Need to change this with an api call
  id: 1,
  name: 'John Doe',
  email: 'johndoe@gmail.com',
  username: 'johndoe',
  phone: '1234567890',
  address: '1234 Main St',
  city: 'Anytown',
  state: 'CA',
  zip: '12345',
  subscribed: true,
  //password: 'JohnDoe1234!',
};

const Consts: ConstsType = {
  authErrorMessages: AuthErrorMessages,
  dummyProfile: dummyProfile,
};

export default Consts;
