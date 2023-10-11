import React from 'react';
import {styled} from 'nativewind';
import {Text} from 'react-native';
import ComponentPropType from '../../../types/ComponentPropType';

const StylizedTouch = styled(Text);

const SearchText: React.FC<ComponentPropType> = ({navigation}) => {
  return (
    <>
      <StylizedTouch
        onPress={() =>
          navigation?.navigate('HomeStack', {screen: 'HomeScreen'})
        }>
        Home
      </StylizedTouch>
    </>
  );
};

export default SearchText;
