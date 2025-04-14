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
