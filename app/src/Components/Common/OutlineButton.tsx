import type { PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';
import { Pressable, PressableProps } from 'react-native';
import useColorsMode from '../../Helpers/Colors';

type OutlineButtonProps = PropsWithChildren &
  PressableProps & {
    label?: string;
    type?: 'primary' | 'secondary' | 'tertiary';
  };

const OutlineButton: React.FC<OutlineButtonProps> = ({
  children,
  ...props
}) => {
  const { themeMode } = useColorsMode();
  const [buttonColors, setButtonColors] = useState<string>('text-dark-green');

  useEffect(() => {
    const isDarkTheme = themeMode === 'dark';
    if (!props.type || props.type === 'primary') {
      setButtonColors(
        isDarkTheme
          ? 'border-light-green text-light'
          : 'border-dark-green text-dark',
      );
    } else if (props.type === 'secondary') {
      setButtonColors(
        isDarkTheme
          ? 'border-dark text-light-green'
          : 'border-light text-dark-green',
      );
    } else if (props.type === 'tertiary') {
      setButtonColors(
        isDarkTheme
          ? 'border-dark-green text-dark'
          : 'border-light-green text-light',
      );
    }
  }, [props.type, buttonColors, themeMode]);

  return (
    <Pressable
      className={
        buttonColors +
        ' border-2 bg-transparent flex items-center justify-center fixed m-2 text-xl h-9 w-5/12 rounded-xl'
      }
      {...props}>
      {children}
    </Pressable>
  );
};

export default OutlineButton;
