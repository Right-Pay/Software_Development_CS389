import type { PropsWithChildren } from 'react';
import React from 'react';
import { Text } from 'react-native';
import useColorsMode from '../../Helpers/Colors';

type TitleTextProps = PropsWithChildren & Text['props'];

const TitleText: React.FC<TitleTextProps> = ({ children, ...props }) => {
  const { themeMode } = useColorsMode();
  const isDarkTheme = themeMode === 'dark';
  return (
    <Text
      className={
        isDarkTheme
          ? 'text-light-green text-4xl text-center font-bold'
          : 'text-dark-green text-4xl text-center font-bold'
      }
      {...props}>
      {children}
    </Text>
  );
};

export default TitleText;
