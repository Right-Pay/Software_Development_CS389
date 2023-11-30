import { useEffect, useState } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';

const LightColors: ColorsType = {
  primary: '#4d654e',
  secondary: '#Ffffff',
  tertiary: '#e6ffe3',
};

const DarkColors: ColorsType = {
  primary: '#e6ffe3',
  secondary: '#272727',
  tertiary: '#4d654e',
};

const useColorsMode = (): UseColorsMode => {
  const theme = useColorScheme();
  const [colors, setColors] = useState<ColorsType>(LightColors);
  const [themeMode, setThemeMode] = useState<ColorSchemeName>(theme);

  useEffect(() => {
    setColors(theme === 'dark' ? DarkColors : LightColors);
    setThemeMode(theme);
  }, [theme]);

  return { colors, themeMode };
};

type UseColorsMode = {
  colors: ColorsType;
  themeMode: ColorSchemeName;
};

export type ColorsType = {
  primary: string;
  secondary: string;
  tertiary: string;
};

export { DarkColors, LightColors };
export default useColorsMode;
