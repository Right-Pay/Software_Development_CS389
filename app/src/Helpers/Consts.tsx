import { Card, Reward } from '../types/CardType';
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
  invalidCardName:
    'Invalid  Card Name\nName must be more then 10 characters\nName must only contain letters',
  invalidCardBin: 'Invalid Card Number\nMust be 6 digits',
  invalidBankName: 'Invalid Bank Name\nName must be more then 3 characters',
  invalidDropdownOption: 'Invalid Dropdown Option',
  invalidCardLevel: 'Invalid Card Level\nName must be more then 3 characters',
  undefined: 'Request failed, please try again later or contact support!',
  invalidUsername:
    'Invalid Username\nUsername must be more then 3 characters\nUsername must only contain letters',
  invalidPhone:
    'Invalid Phone Number\nMust be 10 digits in any acceptable phone number format',
  errorUpdatingUser: 'Error Updating User',
  notVerified: 'Email Not Verified\nPlease Verify Your Email',
  verifyEmail:
    'Successfully Signed Up\nPlease Check Your Email to Verify Your Account',
  addUsername:
    'Your Username was Not Saved\nPlease Add a Username and Try Again',
};

enum CardFormEnum {
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

const addCard: Card = {
  card_name: 'Add',
  id: -1,
  card_bin: 0o0,
};

//Dummy Data for development
const dummyCards: Card[] = [
  {
    id: 1,
    card_bin: 123456,
    card_name: 'BofA Cash Back Rewards',
    card_bank_name: 'Bank of America',
    exp_date: '12/24',
    card_brand_name: 'Visa',
    card_level: 'Freedom Unlimited',
    card_type: 'Credit',
  },
  {
    id: 2,
    card_bin: 234567,
    card_name: 'Chase Freedom Unlimited',
    card_bank_name: 'Chase',
    exp_date: '11/25',
    card_brand_name: 'MasterCard',
    card_level: 'Freedom Unlimited',
    card_type: 'Credit',
  },
];

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
  cards: dummyCards,
  //password: 'JohnDoe1234!',
};

const dummyCardRewards: Reward[] = [];

const cardItemSeparatorWidth = 48;

const Consts: ConstsType = {
  CardFormEnum: CardFormEnum,
  DropdownListModes: DropdownListModes,
  authErrorMessages: AuthErrorMessages,
  dummyProfile: dummyProfile,
  dummyCards: dummyCards,
  dummyCardRewards: dummyCardRewards,
  cardItemSeparatorWidth,
  addCard,
};

export default Consts;
