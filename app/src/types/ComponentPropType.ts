import {CompositeNavigationProp} from '@react-navigation/native';
import {PropsWithChildren} from 'react';

type ComponentPropType = {
  navigation: CompositeNavigationProp<any, any> | null;
} & PropsWithChildren;

export default ComponentPropType;
