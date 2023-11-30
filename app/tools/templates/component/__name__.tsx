import React from 'react';
import PrimaryButton from '../../../src/Components/Common/PrimaryButton';
import PrimaryText from '../../../src/Components/Common/PrimaryText';
import ComponentPropType from '../../../types/ComponentPropType';
//All of this is meant to be replaced it just shows the basic structure of the component
//Navigation does not need to be included if it is not needed

const __name__: React.FC<ComponentPropType> = ({ navigation }) => {
  return (
    <>
      <PrimaryButton
        onPress={() =>
          navigation?.navigate('HomeStack', { screen: 'HomeScreen' })
        }>
        <PrimaryText type="secondary" className="text-xl">
          Home
        </PrimaryText>
      </PrimaryButton>
    </>
  );
};

export default __name__;
