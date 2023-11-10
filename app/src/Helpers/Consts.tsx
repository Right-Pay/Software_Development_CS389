import ConstsType from '../types/ConstsType';
import {Card, Reward} from '../types/CreditCardType';

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
  invalidCreditCardBin: 'Invalid Credit Card Number\nMust be 6 digits',
  invalidBankName: 'Invalid Bank Name\nName must be more then 3 characters',
  invalidDropdownOption: 'Invalid Dropdown Option',
};

enum CreditCardFormEnum {
  Search = 0,
  Full = 1,
  Review = 2,
  Rewards = 3,
  AddOption = 4,
  Off = 5,
}

const DropdownListModes = {
  DEFAULT: 'DEFAULT',
  FLATLIST: 'FLATLIST',
  SCROLLVIEW: 'SCROLLVIEW',
  MODAL: 'MODAL',
};

//Dummy Data for development
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

const dummyCreditCards: Card[] = [
  {
    id: 1,
    card_bin: 123456,
    card_name: 'BofA Cash Back Rewards',
    card_bank: 'Bank of America',
    exp_date: '12/24',
    card_brand: 'Visa',
  },
  {
    id: 2,
    card_bin: 234567,
    card_name: 'Chase Freedom Unlimited',
    card_bank: 'Chase',
    exp_date: '11/25',
    card_brand: 'MasterCard',
  },
];

const dummyCreditCardRewards: Reward[] = [];

const addBank = 'Add New Bank';

const Consts: ConstsType = {
  CreditCardFormEnum: CreditCardFormEnum,
  DropdownListModes: DropdownListModes,
  authErrorMessages: AuthErrorMessages,
  dummyProfile: dummyProfile,
  dummyCreditCards: dummyCreditCards,
  dummyCreditCardRewards: dummyCreditCardRewards,
  addBank: addBank,
};

export default Consts;
