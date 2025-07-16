import { MODAL_INIT_TYPE, MODAL_ACTION, MODAL_FEATURES } from "../constants/modal.constant";

const MODAL_INIT: MODAL_INIT_TYPE = {
    isOpen: false,
    body: '',
    title: null,
    size: 'sm',
}

export const ModalReducer = (state = MODAL_INIT, action: MODAL_ACTION): MODAL_INIT_TYPE => {
    switch (action.type) {
        case MODAL_FEATURES.MODAL_OPEN:
            return { isOpen: true, body: action.payload.body, title: action.payload.title, size: action.payload.size, others: action.payload.others }
        case MODAL_FEATURES.MODAL_CLOSE:
            return { isOpen: false, body: '', title: null, size: null }
        default:
            return state;
    }
}