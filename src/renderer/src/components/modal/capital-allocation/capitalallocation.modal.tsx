import React, { useEffect, useState } from 'react'
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
import { AuthState } from '@renderer/context/auth.context'

const CapitalAllocation: React.FunctionComponent<{ closeModal: () => void, strategy_id?: any, allocation?: any }> = ({ closeModal, strategy_id, allocation }) => {
    const [isLoading, setIsLoading] = useState(false)
    const { userDetails } = AuthState();

    const dispatch = useAppDispatch()
    const formSchema: Yup.ObjectSchema<any> = Yup.object().shape({
        percentage: Yup.string().required('percentage is required'),
        amount: Yup.string().required('amount is required'),
    })

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FundAllocate>({ resolver: yupResolver(formSchema), mode: 'all', })

    const onSubmit = (data: FundAllocate): void => {
        setIsLoading(true)
        axios.post(API_URL.CAPITAL_ALOCATION, { percentage: data.percentage, amount: data.amount, strategy_id: strategy_id }).then((res) => {
            toast.success(res.data.message)
            closeModal()
            reset()
            setIsLoading(false)
            openModal({ body: MODAL_TYPE.DEFAULT, title: 'Capital Allocation Successfully', size: 'md' }, dispatch)
            GetStrategiesAction(userDetails?.id, dispatch)
        }).catch((err) => {
            if (err.response) {
                toast.error(err.response.data.message)
            } else {
                toast.error(err.message)
            }
            setIsLoading(false)
        })
    }



    // Watch fields

    // Keep amount in sync when percentage changes
    // useEffect(() => {
    //     if (balance > 0 && percentage && !isNaN(Number(percentage))) {
    //         const calculatedAmount: any = (balance * Number(percentage)) / 100
    //         if (calculatedAmount.toFixed(2) !== amount) {
    //             setValue("amount", calculatedAmount.toFixed(2), { shouldValidate: true })
    //         }
    //     }
    // }, [percentage, balance])

    // // Keep percentage in sync when amount changes
    // useEffect(() => {
    //     if (balance > 0 && amount && !isNaN(Number(amount))) {
    //         const calculatedPercentage: any = (Number(amount) / balance) * 100
    //         if (calculatedPercentage.toFixed(2) !== percentage) {
    //             setValue("percentage", calculatedPercentage.toFixed(2), { shouldValidate: true })
    //         }
    //     }
    // }, [amount, balance])

    useEffect(() => {
        if (allocation) {
            setValue('amount', allocation?.allocated_capital)
            setValue('percentage', allocation?.allocation_percentage)
        }
    }, [allocation])
    useEffect(() => {
        GetStrategiesAction(userDetails?.id, dispatch)
    }, [dispatch])
    return (
        <div className="custom_modal_form">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-12">
                        <h4>Capital Allocation Amount $ {userDetails?.mt5_status?.account_balance}</h4>
                    </div>
                    <div className="col-md-12 form-group">
                        <label>Percentage</label>
                        <div className="field">
                            <input type='text' className='form-control' placeholder='Ex:50%' {...register('percentage', { valueAsNumber: true })} />
                        </div>
                        {errors.percentage && <p className='error'>{errors.percentage.message}</p>}
                    </div>
                    <div className="col-md-12 form-group">
                        <label>Amount</label>
                        <div className="field">
                            <input type='text' className='form-control' placeholder='Amount' {...register('amount', { valueAsNumber: true })} />
                        </div>
                        {errors.amount && <p className='error'>{errors.amount.message}</p>}
                    </div>
                    <div className="col-md-12 form-group text-center">
                        <Button loading={isLoading} disabled={isLoading} type='submit' className='save'>Update</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CapitalAllocation
