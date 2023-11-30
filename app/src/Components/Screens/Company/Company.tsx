import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PropsWithChildren } from 'react';
import React from 'react';
import type { CompanyNavigationRoutesType } from '../../../types/NavigationRoutesType';
import TitleText from '../../Common/TitleText';
import WrapperView from '../../Common/WrapperView';

type CompanyScreenProps = NativeStackScreenProps<
  CompanyNavigationRoutesType,
  'CompanyScreen'
> &
  PropsWithChildren;

const CompanyScreen: React.FC<CompanyScreenProps> = () => {
  return (
    <WrapperView>
      <TitleText className="mt-20">
        This is the company screen... what this for????
      </TitleText>
    </WrapperView>
  );
};

export default CompanyScreen;
