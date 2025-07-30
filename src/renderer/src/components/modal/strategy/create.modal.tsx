import React, { useState } from 'react'
import * as Yup from 'yup'
import { CreateStrategyFormData } from '@renderer/types/strategy.type'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import axios from '@renderer/config/axios'
import { API_URL } from '@renderer/utils/constant'
import toast from 'react-hot-toast'
import { GetStrategiesAction } from '@renderer/services/actions/strategies.action'
import { useAppDispatch } from '@renderer/services/hook'
import { Button } from '@mui/material'

const CreateStrategyModal: React.FunctionComponent<{ closeModal: () => void }> = ({ closeModal }) => {
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useAppDispatch()

  const formSchema: Yup.ObjectSchema<CreateStrategyFormData> = Yup.object().shape({
    name: Yup.string().required('Strategy name is required'),
    type: Yup.string().required('Strategy type is required'),
    timeframe: Yup.string().required('Timeframe is required'),
    preferred_pairs: Yup.string().required('Preferred pairs is required'),
    entry_conditions: Yup.string().required('Entry conditions is required'),
    exit_conditions: Yup.string().required('Exit conditions is required'),
    indicators_used: Yup.string().required('Indicators used is required'),
    risk_reward_ratio_target: Yup.number().typeError('Risk/Reward ratio must be a number').positive('Risk/Reward ratio must be positive').required('Risk/Reward ratio target is required'),
    max_drawdown_tolerance: Yup.number().typeError('Max drawdown tolerance must be a number').positive('Max drawdown tolerance must be positive').max(100, 'Max drawdown tolerance cannot exceed 100%').required('Max drawdown tolerance is required'),
  })

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateStrategyFormData>({ resolver: yupResolver(formSchema), mode: 'all', })

  const onSubmit = (data: CreateStrategyFormData): void => {
    setIsLoading(true)
    axios.post(API_URL.STRATEGY_OPERATIONS, data).then((res) => {
      toast.success(res.data.message)
      closeModal()
      GetStrategiesAction(dispatch)
      reset()
      setIsLoading(false)
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
            <h4>Basic Strategy Details</h4>
          </div>
          <div className="col-md-12 form-group">
            <label>Strategy Name</label>
            <div className="field">
              <input type='text' className='form-control' placeholder='E.g. London Breakout' {...register('name')} />
            </div>
            {errors.name && <p className='error'>{errors.name.message}</p>}
          </div>
          <div className="col-md-12 form-group">
            <label>Strategy Type</label>
            <div className="field">
              <select className='form-control' {...register('type')}>
                <option value={''}>Select Strategy Type</option>
                <option value={'breakout'}>Breakout</option>
                <option value={'swing'}>Swing</option>
                <option value={'scalping'}>Scalping</option>
                <option value={'momentum'}>Momentum</option>
                <option value={'trend'}>Trend</option>
                <option value={'mean_reversion'}>Mean Reversion</option>
                <option value={'other'}>Other</option>
              </select>
            </div>
            {errors.type && <p className='error'>{errors.type.message}</p>}
          </div>
          <div className="col-md-12 form-group">
            <label>Timeframe</label>
            <div className="field">
              <input type='text' className='form-control' placeholder='M15' {...register('timeframe')} />
            </div>
            {errors.timeframe && <p className='error'>{errors.timeframe.message}</p>}
          </div>
          <div className="col-md-12 form-group">
            <label>Preferred Pairs</label>
            <div className="field">
              <input type='text' className='form-control' placeholder='E.g. EUR/USD' {...register('preferred_pairs')} />
            </div>
            {errors.preferred_pairs && <p className='error'>{errors.preferred_pairs.message}</p>}
          </div>
          <div className="col-md-12">
            <h4>Technical Criteria</h4>
          </div>
          <div className="col-md-12 form-group">
            <label>Entry Conditions</label>
            <div className="field">
              <input type='text' className='form-control' placeholder='' {...register('entry_conditions')} />
            </div>
            {errors.entry_conditions && <p className='error'>{errors.entry_conditions.message}</p>}
          </div>
          <div className="col-md-12 form-group">
            <label>Exit Conditions</label>
            <div className="field">
              <input type='text' className='form-control' placeholder='' {...register('exit_conditions')} />
            </div>
            {errors.exit_conditions && <p className='error'>{errors.exit_conditions.message}</p>}
          </div>
          <div className="col-md-12 form-group">
            <label>Indicators Used</label>
            <div className="field">
              <input type='text' className='form-control' placeholder='' {...register('indicators_used')} />
            </div>
            {errors.indicators_used && <p className='error'>{errors.indicators_used.message}</p>}
          </div>
          <div className="col-md-12 form-group">
            <label>Risk/Reward Ratio Target</label>
            <div className="field">
              <input type='text' className='form-control' placeholder='E.g. 2.0' {...register('risk_reward_ratio_target')} />
            </div>
            {errors.risk_reward_ratio_target && <p className='error'>{errors.risk_reward_ratio_target.message}</p>}
          </div>
          <div className="col-md-12 form-group">
            <label>Max Drawdown Tolerance (%)</label>
            <div className="field">
              <input type='text' className='form-control' placeholder='E.g. 5' {...register('max_drawdown_tolerance')} />
            </div>
            {errors.max_drawdown_tolerance && <p className='error'>{errors.max_drawdown_tolerance.message}</p>}
          </div>
          <div className="col-md-12 form-group text-center">
            <Button loading={isLoading} disabled={isLoading} type='submit' className='save'>Save Strategy</Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CreateStrategyModal
