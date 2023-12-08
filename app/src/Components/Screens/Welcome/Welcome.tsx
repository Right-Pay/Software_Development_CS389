import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PropsWithChildren } from 'react';
import React from 'react';
import useColorsMode from '../../../Helpers/Colors';
import { Logo, LogoContainer } from '../../../Helpers/StylizedComponents';
import type { WelcomeNavigationRoutesType } from '../../../types/NavigationRoutesType';
import PrimaryButton from '../../Common/PrimaryButton';
import PrimaryText from '../../Common/PrimaryText';
import WrapperView from '../../Common/WrapperView';
import LanguageContext from '../../../Context/languageContext';
import { LanguageContextType } from '../../../types/LanguageContextType';

type WelcomeScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'Welcome'
> &
  PropsWithChildren;

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const { themeMode } = useColorsMode();
  const { translate } = React.useContext(
    LanguageContext,
  ) as LanguageContextType;

  return (
    <WrapperView>
      <LogoContainer>
        <Logo
          source={
            themeMode === 'dark'
              ? require('../../../Assets/RightPay-logo-dark-transparent.png')
              : require('../../../Assets/RightPay-logo-light-transparent.png')
          }
        />
      </LogoContainer>
      <PrimaryButton onPress={() => navigation.navigate('Login')}>
        <PrimaryText type="secondary" className="text-xl">
          {translate('Welcome', 'Login')}
        </PrimaryText>
      </PrimaryButton>
      <PrimaryButton onPress={() => navigation.navigate('Register')}>
        <PrimaryText type="secondary" className="text-xl">
          {translate('Welcome', 'Signup')}
        </PrimaryText>
      </PrimaryButton>
    </WrapperView>
  );
};

export default WelcomeScreen;
