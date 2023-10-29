declare module 'react-native-config' {
  export interface NativeConfig {
    REACT_APP_API_URL: string;
    REACT_APP_API_KEY: string;
    REACT_APP_API_BYPASS: string | boolean;
    REACT_APP_AUTH0_DOMAIN: string;
    REACT_APP_AUTH0_CLIENT_ID: string;
    REACT_APP_AUTH0_AUDIENCE: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
