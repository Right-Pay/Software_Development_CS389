import type { PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import useColorsMode from '../../Helpers/Colors';

type PrimaryTextProps = PropsWithChildren &
  Text['props'] & {
    type?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  };

const PrimaryText: React.FC<PrimaryTextProps> = ({ children, ...props }) => {
  const { themeMode } = useColorsMode();
  const [textColor, setTextColor] = useState<string>('text-dark-green');

  useEffect(() => {
    const isDarkTheme = themeMode === 'dark';
    if (!props.type || props.type === 'primary') {
      setTextColor(isDarkTheme ? 'text-light-green' : 'text-dark-green');
    } else if (props.type === 'secondary') {
      setTextColor(isDarkTheme ? 'text-dark' : 'text-light');
    } else if (props.type === 'tertiary') {
      setTextColor(isDarkTheme ? 'text-dark-green' : 'text-light-green');
    } else if (props.type === 'quaternary') {
      setTextColor(isDarkTheme ? 'text-light' : 'text-dark');
    }
  }, [props.type, textColor, themeMode]);

  return (
    <Text className={textColor} {...props}>
      {children}
    </Text>
  );
};

export default PrimaryText;
