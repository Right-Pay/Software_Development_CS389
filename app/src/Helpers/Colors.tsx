import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

const LightColors = {
  primary: '#4d654e',
  secondary: '#Ffffff',
  tertiary: '#e6ffe3',
};

const DarkColors = {
  primary: '#e6ffe3',
  secondary: '#272727',
  tertiary: '#4d654e',
};

const useColorsMode = () => {
  const theme = useColorScheme();
  const [colors, setColors] = useState(LightColors);
  const [themeMode, setThemeMode] = useState(theme);

  useEffect(() => {
    setColors(theme === 'dark' ? DarkColors : LightColors);
    setThemeMode(theme);
  }, [theme]);

  return [colors, themeMode];
};

export { DarkColors, LightColors };
export default useColorsMode;
