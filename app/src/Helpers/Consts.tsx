import ConstsType from '../types/ConstsType';
import {CreditCardReward} from '../types/CreditCardType';

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
  invalidCreditCardName:
    'Invalid Credit Card Name\nName must be more then 10 characters\nName must only contain letters',
  invalidCreditCardNickName: 'Invalid Credit Card Nick Name\nName must be more then 3 characters\nName must only contain letters',
  invalidCreditCardNumber: 'Invalid Credit Card Number\nMust be 6 digits',
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
    cardNumber: '1234 56',
    cardName: 'BofA Cash Back Rewards',
    nickName: 'Johns Card',
    bankName: 'Bank of America',
    expirationDate: '12/24',
    cardType: 'Visa',
  },
  {
    id: 2,
    cardNumber: '2345 67',
    cardName: 'Chase Freedom Unlimited',
    nickName: 'Janes Card',
    bankName: 'Chase',
    expirationDate: '11/25',
    cardType: 'MasterCard',
  },
];

const dummyCreditCardRewards: CreditCardReward[] = [
  {
    id: 0,
    creditCardId: 1,
    name: 'Reward 1',
    description: 'Description for Reward 1',
    amount: 0.02,
    date: '2023-10-24',
  },
  {
    id: 1,
    creditCardId: 2,
    name: 'Reward 2',
    description: 'Description for Reward 2',
    amount: 0.03,
    date: '2023-10-25',
  },
  {
    id: 2,
    creditCardId: 1,
    name: 'Reward 3',
    description: 'Description for Reward 3',
    amount: 0.02,
    date: '2023-11-03',
  },
  {
    id: 3,
    creditCardId: 2,
    name: 'Reward 4',
    description: 'Description for Reward 4',
    amount: 0.03,
    date: '2023-11-04',
  },
];

const Consts: ConstsType = {
  authErrorMessages: AuthErrorMessages,
  dummyProfile: dummyProfile,
  dummyCreditCards: dummyCreditCards,
  dummyCreditCardRewards: dummyCreditCardRewards,
};

export default Consts;
