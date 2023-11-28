import React from 'react';
import type { PropsWithChildren } from 'react';
import type { CompanyNavigationRoutesType } from '../../../types/NavigationRoutesType';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Title, WrapperView } from '../../../Helpers/StylizedComponents';

type CompanyScreenProps = NativeStackScreenProps<
  CompanyNavigationRoutesType,
  'CompanyScreen'
> &
  PropsWithChildren;

const CompanyScreen: React.FC<CompanyScreenProps> = () => {
  return (
    <WrapperView>
      <Title className="mt-20">
        This is the company screen... what this for????
      </Title>
    </WrapperView>
  );
};

export default CompanyScreen;
