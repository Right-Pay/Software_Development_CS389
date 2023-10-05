export interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (_isLoggedIn: boolean) => void;
  isLoading: boolean;
  setIsLoading: (_isLoading: boolean) => void;
  isSignout: boolean;
  setIsSignout: (_isSignout: boolean) => void;
  userToken: string | null;
  setUserToken: (_userToken: string | null) => void;
  signIn: (_email: string, _password: string) => void;
  signOut: () => void;
  signUp: (_email: string, _password: string) => Promise<boolean>;
  signInError: string | null;
}
