import { Dispatch } from "redux";
import { MODAL_ACTION, MODAL_FEATURES } from "../constants/modal.constant";
import { MODAL_PAYLOAD } from "@renderer/types/modal.type";

export const openModal = (data: MODAL_PAYLOAD, dispatch: Dispatch<MODAL_ACTION>): void => {
  dispatch({ type: MODAL_FEATURES.MODAL_OPEN, payload: data })
}

export const closeModal = (dispatch: Dispatch<MODAL_ACTION>): void => {
  dispatch({ type: MODAL_FEATURES.MODAL_CLOSE })
}
