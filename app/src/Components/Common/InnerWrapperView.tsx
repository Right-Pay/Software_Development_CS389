import type { PropsWithChildren } from 'react';
import React from 'react';
import { View } from 'react-native';
import useColorsMode from '../../Helpers/Colors';

type InnerWrapperViewProps = PropsWithChildren & {
  className?: string;
} & View['props'];

const InnerWrapperView: React.FC<InnerWrapperViewProps> = ({
  children,
  className,
  ...props
}) => {
  const { themeMode } = useColorsMode();
  const isDarkTheme = themeMode === 'dark';
  const bgColor = isDarkTheme
    ? 'bg-dark border-light-green'
    : 'bg-light border-dark-green';
  const classNames =
    bgColor +
    ' flex-1 flex-col w-full p-5 items-center space-between' +
    className;
  return (
    <View className={classNames} {...props}>
      {children}
    </View>
  );
};

export default InnerWrapperView;
