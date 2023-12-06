import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-ionicons';
import useColorsMode from '../Helpers/Colors';
import PrimaryText from './Common/PrimaryText';
import context from '../Context/context';
import { AppContext } from '../types/AppContextType';

const PointPopUp = () => {
  const { pointsToAdd, showAddPoints } = React.useContext(
    context,
  ) as AppContext;

  const { colors } = useColorsMode();

  return showAddPoints ? (
    <View className="flex flex-row justify-center absolute bottom-20 right-4 h-auto w-auto ">
      <PrimaryText className="text-2xl font-bold ml-2 mr-2">{`+${pointsToAdd}`}</PrimaryText>
      <Icon
        name="ribbon"
        color={colors.primary}
        size={30}
        className="h-fit w-fit"
      />
    </View>
  ) : (
    <></>
  );
};

export default PointPopUp;
