import React from 'react'


const ConfirmationModal: React.FunctionComponent<{ closeModal: () => void }> = ({ closeModal }) => {


    return (
        <div className="custom_modal_form">
            <h1>MT5 Account Connected Successfully</h1>
            <button onClick={closeModal}>Close</button>
        </div>
    )
}

export default ConfirmationModal
