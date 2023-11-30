import type { PropsWithChildren } from 'react';
import React from 'react';
import { View, useColorScheme } from 'react-native';

type WrapperViewProps = PropsWithChildren & {
  className?: string;
};

const WrapperView: React.FC<WrapperViewProps> = ({children, className}) => {
  const theme = useColorScheme();
  const isDarkTheme = theme === 'dark';
  const bgColor = isDarkTheme ? 'bg-dark' : 'bg-light';
  const classNames =
    bgColor +
    ' flex-1 items-center h-full overflow-y-scroll space-between pb-12 justify-center ' +
    className;
  return <View className={classNames}>{children}</View>;
};

export default WrapperView;
