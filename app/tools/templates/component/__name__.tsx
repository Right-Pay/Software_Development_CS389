import React from 'react';
import ComponentPropType from '../../../types/ComponentPropType';
import { AuthButton } from '../../../src/Helpers/StylizedComponents';
//All of this is meant to be replaced it just shows the basic structure of the component
//Navigation does not need to be included if it is not needed

const __name__: React.FC<ComponentPropType> = ({ navigation }) => {
  return (
    <>
      <AuthButton
        onPress={() =>
          navigation?.navigate('HomeStack', { screen: 'HomeScreen' })
        }>
        Home
      </AuthButton>
    </>
  );
};

export default __name__;
