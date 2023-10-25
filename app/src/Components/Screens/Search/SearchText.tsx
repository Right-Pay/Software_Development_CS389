import React from 'react';
import ComponentPropType from '../../../types/ComponentPropType';
import {MainButtonText, MainButton} from '../../../Helpers/StylizedComponents';
//All of this is meant to be replaced it just shows the basic structure of the component
//Navigation does not need to be included if it is not needed

const SearchText: React.FC<ComponentPropType> = ({navigation}) => {
  return (
    <>
      <MainButton
        onPress={() =>
          navigation?.navigate('HomeStack', {screen: 'HomeScreen'})
        }>
        <MainButtonText>Go Home</MainButtonText>
      </MainButton>
    </>
  );
};

export default SearchText;
