declare module 'react-native-config' {
  export interface NativeConfig {
    REACT_APP_API_URL: string;
    REACT_APP_API_KEY: string;
    REACT_APP_API_BYPASS: boolean;
  }

  export const Config: NativeConfig;
  export default Config;
}
