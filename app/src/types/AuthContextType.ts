import {FC} from 'react';
import {Profile} from './ProfileType';

export interface AuthContextType {
  isLoading: boolean;
  isSignout: boolean;
  isSignedIn: boolean;
  userToken: string | null;
  userProfile: Profile; //change this eventually
  signedUp: boolean;
  authError: string[];
  setIsLoading: (_isLoading: boolean) => void;
  setIsSignout: (_isSignout: boolean) => void;
  setUserToken: (_userToken: string | null) => void;
  signIn: (_email: string, _password: string) => void;
  signOut: () => void;
  signUp: (
    _email: string,
    _username: string,
    _password: string,
    _repeatedPassword: string,
  ) => void;
  clearAuthErrors: () => void;
  addAuthError: (_signInError: string) => void;
  removeAuthError: (_signInError: string) => void;
  setUserProfile: (_userProfile: Profile) => void;
  checkValidEmail: (_email: string) => boolean;
  checkValidPassword: (_password: string) => boolean;
  checkEqualPasswords: (_password: string, _confirmPassword: string) => boolean;
  verifyCode: (_code: string) => boolean;
  AuthErrorComponent: FC | null;
}
