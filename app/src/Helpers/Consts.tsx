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

const dummyCreditCards = [
  {
    id: 1,
    cardNumber: '1234 5678 9012 3456',
    name: 'John Doe',
    expirationDate: '12/24',
    securityCode: '123',
    cardType: 'Visa',
  },
  {
    id: 2,
    cardNumber: '2345 6789 0123 4567',
    name: 'Jane Smith',
    expirationDate: '11/25',
    securityCode: '456',
    cardType: 'MasterCard',
  },
  {
    id: 3,
    cardNumber: '3456 7890 1234 5678',
    name: 'Mike Johnson',
    expirationDate: '10/26',
    securityCode: '789',
    cardType: 'Discover',
  },
  {
    id: 4,
    cardNumber: '4567 8901 2345 6789',
    name: 'Sara Williams',
    expirationDate: '09/27',
    securityCode: '234',
    cardType: 'American Express',
  },
  {
    id: 5,
    cardNumber: '5678 9012 3456 7890',
    name: 'David Lee',
    expirationDate: '08/28',
    securityCode: '567',
    cardType: 'Visa',
  },
  {
    id: 6,
    cardNumber: '6789 0123 4567 8901',
    name: 'Amy Brown',
    expirationDate: '07/29',
    securityCode: '890',
    cardType: 'MasterCard',
  },
  {
    id: 7,
    cardNumber: '7890 1234 5678 9012',
    name: 'Chris Davis',
    expirationDate: '06/30',
    securityCode: '345',
    cardType: 'Discover',
  },
  {
    id: 8,
    cardNumber: '8901 2345 6789 0123',
    name: 'Emily White',
    expirationDate: '05/31',
    securityCode: '678',
    cardType: 'American Express',
  },
  {
    id: 9,
    cardNumber: '9012 3456 7890 1234',
    name: 'Kevin Johnson',
    expirationDate: '04/32',
    securityCode: '901',
    cardType: 'Visa',
  },
  {
    id: 10,
    cardNumber: '4321 8765 0987 6543',
    name: 'Laura Black',
    expirationDate: '03/33',
    securityCode: '432',
    cardType: 'MasterCard',
  },
];

const Consts: ConstsType = {
  authErrorMessages: AuthErrorMessages,
  dummyProfile: dummyProfile,
  dummyCreditCards: dummyCreditCards,
};

export default Consts;
