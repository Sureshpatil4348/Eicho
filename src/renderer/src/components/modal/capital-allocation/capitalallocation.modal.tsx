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

const CapitalAllocation: React.FunctionComponent<{ closeModal: () => void }> = ({ closeModal }) => {
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useAppDispatch()
    const formSchema: Yup.ObjectSchema<any> = Yup.object().shape({
        strategy_name: Yup.string().required('strategy name is required'),
        amount: Yup.string().required('amount is required'),
    })

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FundAllocate>({ resolver: yupResolver(formSchema), mode: 'all', })

    const onSubmit = (data: FundAllocate): void => {
        setIsLoading(true)
        axios.post(API_URL.CAPITAL_ALOCATION, data).then((res) => {
            toast.success(res.data.message)
            closeModal()
            reset()
            setIsLoading(false)
            openModal({ body: MODAL_TYPE.DEFAULT, title: 'MT5 Wallet Connected Successfully', size: 'md' }, dispatch)

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
                        <h4>Connect MT5 Wallet</h4>
                    </div>
                    <div className="col-md-12 form-group">
                        <label>Login Id</label>
                        <div className="field">
                            <input type='text' className='form-control' placeholder='login id..' {...register('strategy_name')} />
                        </div>
                        {errors.strategy_name && <p className='error'>{errors.strategy_name.message}</p>}
                    </div>
                    <div className="col-md-12 form-group">
                        <label>Password</label>
                        <div className="field">
                            <input type='text' className='form-control' placeholder='Password' {...register('amount')} />
                        </div>
                        {errors.amount && <p className='error'>{errors.amount.message}</p>}
                    </div>
                    <div className="col-md-12 form-group text-center">
                        <Button loading={isLoading} disabled={isLoading} type='submit' className='save'>Connect</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CapitalAllocation
