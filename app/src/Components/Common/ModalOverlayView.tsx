import type { PropsWithChildren } from 'react';
import React from 'react';
import { View } from 'react-native';
import useColorsMode from '../../Helpers/Colors';

type ModalOverlayViewProps = PropsWithChildren & View['props'];

const ModalOverlayView: React.FC<ModalOverlayViewProps> = ({
  children,
  ...props
}) => {
  const { themeMode } = useColorsMode();
  const isDarkTheme = themeMode === 'dark';
  const bgColor = isDarkTheme ? 'bg-dark' : 'bg-light';
  const classNames = bgColor + ' items-center ';
  return (
    <View className={classNames} {...props}>
      {children}
    </View>
  );
};

export default ModalOverlayView;
