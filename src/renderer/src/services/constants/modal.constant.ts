
import { DialogProps } from "@mui/material";
import { MODAL_BODY } from "@renderer/types/modal.type";

export enum MODAL_FEATURES {
  MODAL_OPEN = "MODAL_OPEN",
  MODAL_CLOSE = "MODAL_CLOSE"
}

export interface MODAL_OPEN {
  type: MODAL_FEATURES.MODAL_OPEN;
  payload: {
    body: MODAL_BODY;
    title: string;
    size?: DialogProps['maxWidth'];
    others?: {
      details?: object | unknown;
      limit: number;
      page: number;
      search?: string;
    };
  };
}

export interface MODAL_CLOSE {
  type: MODAL_FEATURES.MODAL_CLOSE;
}

export type MODAL_ACTION = MODAL_OPEN | MODAL_CLOSE;

export interface MODAL_INIT_TYPE {
  isOpen: boolean;
  body: MODAL_BODY;
  title: string | null;
  size?: DialogProps['maxWidth'] | null;
  others?: {
    details?: object | unknown;
    limit: number;
    page: number;
    search?: string;
  };
}
