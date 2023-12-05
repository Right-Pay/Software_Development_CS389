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
  ) => void;
  resetPassword: (_email: string) => void;
  clearAuthErrors: () => void;
  addAuthError: (_signInError: string) => void;
  removeAuthError: (_signInError: string) => void;
  checkValidEmail: (_email: string) => boolean;
  checkValidPassword: (_password: string) => boolean;
  checkEqualPasswords: (_password: string, _confirmPassword: string) => boolean;
  checkValidUsername: (_username: string) => boolean;
  checkValidPhone: (_phone: string) => boolean;
  refreshAuth0Token: (_trace: string) => void;
  updateUserProfile: (_newProfile: Profile) => void;
  needsUsername: boolean;
  isKeyboardVisible: boolean;
  checkVerfiedEmail: () => void;
  notVerified: boolean;
  retrieveVerifiedEmail: () => Promise<boolean | null>;
  backendSignIn: () => void;
}

export interface TokenType {
  refresh_token: string | null;
  access_token: string | null;
}
