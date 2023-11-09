import React, {useEffect, useState} from 'react';
import {DropdownProps} from '../types/DropdownProps';
import {Dropdown} from './StylizedComponents';
import {View} from 'react-native';
import {AppContext} from '../types/AppContextType';
import Context from '../Context/context';
import {styled} from 'nativewind';
import {Console} from 'console';

const StyledView = styled(View);

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

  const {updatingDropdown, setUpdatingDropdown} = React.useContext(
    Context,
  ) as AppContext;

  const handleSetValue = (val: string) => {
    setValue(val);
    props.onDropdownChange(val);
  };

  const listMode: any = props.mode ? props.mode : 'FLATLIST';

  useEffect(() => {
    const newItems = props.options?.map(o => ({
      label: o,
      value: o,
      labelStyle: {color: 'black'},
    }));
    if (newItems) {
      setItems(newItems);
    }
  }, [props.refresh]);

  useEffect(() => {
    setValue(props.options[props.options.length - 2]);
    setUpdatingDropdown(false);
  }, [updatingDropdown]);

  return (
    <StyledView className={props.dropdownStyle}>
      <Dropdown
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        listMode={listMode}
        modalProps={{
          animationType: 'slide',
        }}
        modalContentContainerStyle={
          listMode === 'MODAL'
            ? {
                backgroundColor: '#e6ffe3',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }
            : {}
        }
        listItemContainerStyle={
          listMode === 'MODAL'
            ? {
                width: '95%',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderStyle: 'solid',
                borderWidth: 3,
                borderColor: 'black',
                borderRadius: 10,
                margin: 10,
              }
            : {}
        }
        listItemLabelStyle={
          listMode === 'MODAL'
            ? {
                fontSize: 20,
                color: 'black',
              }
            : {}
        }
        placeholder={props.placeholder}
        placeholderStyle={{color: 'black', fontWeight: 'bold', fontSize: 20}}
        textStyle={{color: 'black', fontSize: 20}}
        onChangeValue={event => handleSetValue(event?.toString() as string)}
      />
    </StyledView>
  );
};

export default DropdownComponent;
