import { Dialog, DialogContent, DialogProps, DialogTitle } from "@mui/material"
import CreateStrategyModal from "@renderer/components/modal/strategy/create.modal"
import MODAL_TYPE from "@renderer/config/modal"
import { closeModal } from "@renderer/services/actions/modal.action"
import { useAppDispatch, useAppSelector } from "@renderer/services/hook"
import { AiOutlineClose } from "react-icons/ai"

const ModalLayout: React.FunctionComponent = () => {

  const { isOpen, body, size, title, description } = useAppSelector(state => state.modal)

  const dispatch = useAppDispatch()

  const close = (): void => {
    closeModal(dispatch)
  }

  return (
    <Dialog className="custom_modal" open={isOpen} onClose={() => close()} fullWidth={true} maxWidth={size as DialogProps['maxWidth']}>
      <div className='custom_modal_boxes'>
        <div className='main_boxes'>
          <DialogTitle className="top">
            <h3>{title}</h3>
            {description ? <p>{description}</p> : null}
            <button className="close" onClick={() => close()}>
              <AiOutlineClose />
            </button>
          </DialogTitle>
          <DialogContent sx={{ padding: '0px' }}>
            {
              {
                [MODAL_TYPE.CREATE_STRATEGY]: <CreateStrategyModal />,
                [MODAL_TYPE.DEFAULT]: <div></div>
              }[body]
            }
          </DialogContent>
        </div>
      </div>
    </Dialog>
  )
}

export default ModalLayout
