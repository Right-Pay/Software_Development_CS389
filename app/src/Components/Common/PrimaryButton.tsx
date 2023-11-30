import type { PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';
import { Pressable, PressableProps } from 'react-native';
import useColorsMode from '../../Helpers/Colors';

type PrimaryButtonProps = PropsWithChildren &
  PressableProps & {
    label?: string;
    type?: 'primary' | 'secondary' | 'tertiary';
  };

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  ...props
}) => {
  const { themeMode } = useColorsMode();
  const [buttonColors, setButtonColors] = useState<string>('text-dark-green');

  useEffect(() => {
    const isDarkTheme = themeMode === 'dark';
    if (!props.type || props.type === 'primary') {
      setButtonColors(
        isDarkTheme ? 'bg-light-green text-light' : 'bg-dark-green text-dark',
      );
    } else if (props.type === 'secondary') {
      setButtonColors(
        isDarkTheme ? 'bg-dark text-light-green' : 'bg-light text-dark-green',
      );
    } else if (props.type === 'tertiary') {
      setButtonColors(
        isDarkTheme ? 'bg-dark-green text-dark' : 'bg-light-green text-light',
      );
    }
  }, [props.type, buttonColors, themeMode]);

  return (
    <Pressable
      className={
        buttonColors +
        ' flex items-center justify-center fixed m-2 text-xl h-9 w-5/12 rounded-xl'
      }
      {...props}>
      {children}
    </Pressable>
  );
};

export default PrimaryButton;
