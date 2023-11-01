import React, {useState} from 'react';
import {DropdownProps} from '../types/DropdownProps';
import {Dropdown} from './StylizedComponents';
import {View} from 'react-native';

const DropdownComponent = (props: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(props.placeholder);
  const [items, setItems] = useState(
    props.options.map(o => ({
      label: o,
      value: o,
      labelStyle: {color: 'black'},
    })),
  );

  const handleSetValue = (val: string) => {
    setValue(val);
    props.onDropdownChange(val);
  };

  return (
    <View className={props.style}>
      <Dropdown
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder={props.placeholder}
        listItemContainerStyle={{zIndex: 100}}
        onChangeValue={event => handleSetValue(event?.toString() as string)}
      />
    </View>
  );
};

export default DropdownComponent;
