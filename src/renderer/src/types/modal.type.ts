import { DialogProps } from "@mui/material";
import MODAL_TYPE from "@renderer/config/modal";

export type MODAL_BODY = keyof typeof MODAL_TYPE | ''

export interface MODAL_PAYLOAD {
  body: MODAL_BODY;
  title: string;
  description?: string;
  strategy_id?: any;
  size?: DialogProps['maxWidth'];
  others?: {
    details?: object | unknown;
    limit: number;
    page: number;
    search?: string
  };
}
