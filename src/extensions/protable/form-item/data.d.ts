export interface IAdminXFormItemProps {
  fieldProps?: {[key: string]: any};
  defaultOperator?: string;
  value?: string;
  onChange?: (val: any) => void;
};
