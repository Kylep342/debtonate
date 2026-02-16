export type Button = {
  text: string
  onClick: Function
  classes?: Array<string>
};

export type Menu = {
  text: string
  buttons: Array<Button>
  classes?: Array<string>
};

export type Clickable = Button | Menu;

export type Locale = {
  code: string,
  currency: string,
  flag: string,
}

export type TableHeader = {
  key: string;
  label: string;
  class?: string;
}

export type FormField = {
  key: string;
  label: string;
  type: 'number' | 'text' | 'string';
  step?: string;
  required?: boolean;
};
