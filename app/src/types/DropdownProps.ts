export interface DropdownProps {
  options: string[];
  placeholder: string;
  onDropdownChange: (_item: string) => void;
  style?: string;
  mode?: string;
  refresh?: boolean;
}

export interface optionsPropsType {
  setOption: (_item: string) => void;
  show: boolean;
}
