import { Dialog, DialogContent, DialogProps, DialogTitle } from "@mui/material"
import CapitalAllocation from "@renderer/components/modal/capital-allocation/capitalallocation.modal"
import ConfigUpdateModal from "@renderer/components/modal/config/config.update"
import CreateStrategyModal from "@renderer/components/modal/strategy/create.modal"
import ConnectWallet from "@renderer/components/modal/walletconnect/connect.modal"
import MODAL_TYPE from "@renderer/config/modal"
import { closeModal } from "@renderer/services/actions/modal.action"
import { useAppDispatch, useAppSelector } from "@renderer/services/hook"
import { AiOutlineClose } from "react-icons/ai"

const ModalLayout: React.FunctionComponent = () => {

  const { isOpen, body, size, title, description, strategy_id, allocation } = useAppSelector(state => state.modal)

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
                [MODAL_TYPE.CREATE_STRATEGY]: <CreateStrategyModal closeModal={close} />,
                [MODAL_TYPE.CONNECT_MT5]: <ConnectWallet closeModal={close} />,
                [MODAL_TYPE.CAPITAL_ALLOCATION]: <CapitalAllocation closeModal={close} strategy_id={strategy_id} allocation={allocation} />,
                [MODAL_TYPE.CONFIG_MODAL]: <ConfigUpdateModal closeModal={close} strategy_id={strategy_id} />,
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
