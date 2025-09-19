import React, { useState } from 'react'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import axios from '@renderer/config/axios'
import { API_URL } from '@renderer/utils/constant'
import toast from 'react-hot-toast'
import { Button } from '@mui/material'
import MODAL_TYPE from '@renderer/config/modal'
import { openModal } from '@renderer/services/actions/modal.action'
import { useAppDispatch } from '@renderer/services/hook'
import { FundAllocate } from '@renderer/types/strategy.type'
import { GetStrategiesAction } from '@renderer/services/actions/strategies.action'

const CapitalAllocation: React.FunctionComponent<{ closeModal: () => void, strategy_id?: any }> = ({ closeModal, strategy_id }) => {
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useAppDispatch()
    const formSchema: Yup.ObjectSchema<any> = Yup.object().shape({
        // strategy_id: Yup.string().required('strategy id is required'),
        amount: Yup.string().required('amount is required'),
    })

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FundAllocate>({ resolver: yupResolver(formSchema), mode: 'all', })

    const onSubmit = (data: FundAllocate): void => {
        setIsLoading(true)
        axios.post(API_URL.CAPITAL_ALOCATION, { ...data, strategy_id: strategy_id }).then((res) => {
            toast.success(res.data.message)
            closeModal()
            reset()
            setIsLoading(false)
            openModal({ body: MODAL_TYPE.DEFAULT, title: 'Capital Allocation Successfully', size: 'md' }, dispatch)
            GetStrategiesAction(dispatch)
        }).catch((err) => {
            if (err.response) {
                toast.error(err.response.data.message)
            } else {
                toast.error(err.message)
            }
            setIsLoading(false)
        })
    }
    return (
        <div className="custom_modal_form">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-12">
                        <h4>Capital Allocation</h4>
                    </div>
                    {/* <div className="col-md-12 form-group">
                        <label>Stratigy Name</label>
                        <div className="field">
                            <input type='text' className='form-control' placeholder='Ex:gold by dip' {...register('strategy_name')} />
                        </div>
                        {errors.strategy_name && <p className='error'>{errors.strategy_name.message}</p>}
                    </div> */}
                    <div className="col-md-12 form-group">
                        <label>Amount</label>
                        <div className="field">
                            <input type='text' className='form-control' placeholder='Amount' {...register('amount')} />
                        </div>
                        {errors.amount && <p className='error'>{errors.amount.message}</p>}
                    </div>
                    <div className="col-md-12 form-group text-center">
                        <Button loading={isLoading} disabled={isLoading} type='submit' className='save'>Add</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CapitalAllocation
