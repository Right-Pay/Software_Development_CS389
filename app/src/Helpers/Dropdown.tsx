import React, {useState} from 'react';
import {DropdownProps} from '../types/DropdownProps';
import {Dropdown} from './StylizedComponents';
import {View} from 'react-native';

const DropdownComponent = (props: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(
    props.options.map(o => ({
      label: o,
      value: o,
      labelStyle: {color: 'black'},
    })),
  );

  return (
    <View>
      <Dropdown
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder={props.placeholder}
      />
    </View>
  );
};

export default DropdownComponent;
