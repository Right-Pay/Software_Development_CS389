import type { PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import useColorsMode from '../../Helpers/Colors';

type InputBoxProps = PropsWithChildren &
  TextInputProps & {
    label?: string;
    type?: 'primary' | 'secondary' | 'tertiary';
  };

const InputBox: React.FC<InputBoxProps> = ({ children, ...props }) => {
  const { themeMode } = useColorsMode();
  const [inputColors, setInputColors] = useState<string>('text-gray-400');

  useEffect(() => {
    const isDarkTheme = themeMode === 'dark';
    if (!props.type || props.type === 'primary') {
      setInputColors(
        isDarkTheme
          ? 'bg-neutral-700 text-gray-100'
          : 'bg-gray-100 text-black border-gray-400 border',
      );
    } else if (props.type === 'secondary') {
      setInputColors(
        isDarkTheme
          ? 'bg-gray-400 text-gray-100 border-gray-100'
          : 'bg-gray-100 text-black border-gray-400',
      );
    } else if (props.type === 'tertiary') {
      setInputColors(
        isDarkTheme
          ? 'bg-gray-400 text-gray-100 border-gray-100'
          : 'bg-gray-100 text-black border-gray-400',
      );
    }
  }, [props.type, inputColors, themeMode]);

  return (
    <TextInput
      className={
        inputColors +
        ' text-lg text-left content-center justify-center h-auto w-2/3 rounded pl-4 pb-2'
      }
      placeholderTextColor={'gray'}
      {...props}>
      {children}
    </TextInput>
  );
};

export default InputBox;
