import type { PropsWithChildren } from 'react';
import React from 'react';
import { View } from 'react-native';
import useColorsMode from '../../Helpers/Colors';

type WrapperViewProps = PropsWithChildren & {
  className?: string;
} & View['props'];

const WrapperView: React.FC<WrapperViewProps> = ({
  children,
  className,
  ...props
}) => {
  const { themeMode } = useColorsMode();
  const isDarkTheme = themeMode === 'dark';
  const bgColor = isDarkTheme ? 'bg-dark' : 'bg-light';
  const classNames =
    bgColor +
    ' flex-1 items-center h-full overflow-y-scroll space-between pb-12 justify-center ' +
    className;
  return (
    <View className={classNames} {...props}>
      {children}
    </View>
  );
};

export default WrapperView;
