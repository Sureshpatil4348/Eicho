import { DialogProps } from "@mui/material";

export type MODAL_BODY = ''

export interface MODAL_PAYLOAD {
  body: MODAL_BODY;
  title: string;
  size?: DialogProps['maxWidth'];
  others?: {
    details?: object | unknown;
    limit: number;
    page: number;
    search?: string
  };
}
