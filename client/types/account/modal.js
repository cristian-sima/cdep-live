// @flow

export type ModalActionType = string;

export type ModalPayload = {
  modalType: ModalActionType;
  modalProps: any;
};

export type ModalActions =
{|
  type: 'SHOW_MODAL';
  payload: {|
    modalType : string;
    modalProps? : any;
  |};
|}
| {|
  type: 'HIDE_MODAL';
|}
