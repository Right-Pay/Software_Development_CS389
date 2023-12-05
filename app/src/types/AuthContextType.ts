import { FC } from 'react';
import { Profile } from './ProfileType';

export interface AuthContextType {
  isLoading: boolean;
  userToken: string | null;
  userProfile: Profile;
  authError: string[];
  AuthErrorComponent: FC | null;
  signIn: (_email: string, _password: string, _inputUsername?: string) => void;
  signOut: () => void;
  signUp: (
    _email: string,
    _username: string,
    _password: string,
    _repeatedPassword: string,
  ) => Promise<boolean>;
  resetPassword: (_email: string) => void;
  clearAuthErrors: () => void;
  addAuthError: (_signInError: string) => void;
  removeAuthError: (_signInError: string) => void;
  checkValidEmail: (_email: string) => boolean;
  checkValidPassword: (_password: string) => boolean;
  checkEqualPasswords: (_password: string, _confirmPassword: string) => boolean;
  checkValidUsername: (_username: string) => boolean;
  checkValidPhone: (_phone: string) => boolean;
  refreshAuth0Token: () => void;
  updateUserProfile: (_newProfile: Profile) => void;
  needsUsername: boolean;
  isKeyboardVisible: boolean;
  checkVerfiedEmail: () => Promise<boolean>;
  notVerified: boolean;
}

export interface TokenType {
  refresh_token: string | null;
  access_token: string | null;
}
