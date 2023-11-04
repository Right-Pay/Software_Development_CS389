export interface DropdownProps {
  options: string[];
  placeholder: string;
  onDropdownChange: (_item: string) => void;
  style?: string;
  mode?: string;
  refresh?: string[];
}

export interface optionsPropsType {
  name: string;
  setOption: (_item: string) => void;
  show: boolean;
  setShow: (_item: boolean) => void;
}
