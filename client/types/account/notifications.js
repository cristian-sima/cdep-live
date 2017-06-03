// @flow

export type BarStyle = {
  padding : number;
  fontFamily : string;
  fontSize : string;
  lineHeight : string;
  marginTop : string;
  zIndex : number;
  marginBottom : string;
  border : string;
  WebKittransition : string;
  MozTransition : string;
  msTransition : string;
  OTransition : string;
  transition : string;

  backgroundColor : string;
  borderColor : string;
  color : string;
}

export type Message = {
  barStyle: BarStyle;
  className: string;
  dismissAfter: number;
  message: any;
};

export type NotificationType = "ok" | "warn" | "error"

export type Notification = {
  key: number;
  message: string;
  type: NotificationType;
};

export type NotificationsActions =
{|
  type: 'ADD_NOTIFICATION';
  payload: Message;
|}
| {|
  type: 'DELETE_NOTIFICATION';
  payload: number;
|}
