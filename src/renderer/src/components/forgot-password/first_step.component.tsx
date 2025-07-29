import { Button } from '@mui/material'
import React, { useState } from 'react'
import Email from "@renderer/assets/images/email-icon.svg";
import { AuthForgotPasswordType } from '@renderer/types/auth.type';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '@renderer/config/axios';
import { API_URL } from '@renderer/utils/constant';
import { AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

const FirstStepComponent: React.FunctionComponent<{ setStep: React.Dispatch<React.SetStateAction<number>>, setToken: React.Dispatch<React.SetStateAction<string | null>> }> = ({ setStep, setToken }) => {
  const [loading, setLoading] = useState<boolean>(false)

  const formSchema: Yup.ObjectSchema<AuthForgotPasswordType> = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required')
  })

  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: yupResolver(formSchema) })

  const onSubmit = (data: AuthForgotPasswordType): void => {
    setLoading(true)
    axios.post(API_URL.FORGOT_PASSWORD, data).then((response: AxiosResponse) => {
      reset()
      setToken(response.data.token)
      setStep(2)
      setLoading(false)
    }).catch((error) => {
      if (error.response) {
        toast.error(error.response.data.message)
      } else {
        console.log(error)
      }
      setLoading(false)
    })
  }

  return (
    <div className="wrap_box">
      <div className="head">
        <h2>Forgot Password</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Email</label>
          <div className="field">
            <div className="icon">
              <img src={Email} alt="" />
            </div>
            <input className="form-control" type="text" {...register("email")} />
          </div>
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>
        <div className="form-group text-center">
          <Button type="submit" className="login" disabled={loading} loading={loading}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  )
}

export default FirstStepComponent
