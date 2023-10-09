import {Profile} from './ProfileType';

export interface AuthContextType {
  isLoading: boolean;
  setIsLoading: (_isLoading: boolean) => void;
  isSignout: boolean;
  setIsSignout: (_isSignout: boolean) => void;
  userToken: string | null;
  setUserToken: (_userToken: string | null) => void;
  signIn: (_email: string, _password: string) => void;
  signOut: () => void;
  signUp: (_email: string, _password: string) => Promise<boolean>;
  signInError: string[];
  clearSignInErrors: () => void;
  addSignInError: (_signInError: string) => void;
  removeSignInError: (_signInError: string) => void;
  userProfile: Profile; //change this eventually
  setUserProfile: (_userProfile: Profile) => void;
  checkValidEmail: (_email: string) => boolean;
  checkValidPassword: (_password: string) => boolean;
}
