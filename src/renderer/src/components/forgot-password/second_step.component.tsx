import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@mui/material'
import Password from "@renderer/assets/images/password-icon.svg";
import axios from '@renderer/config/axios';
import { AuthForgotPasswordSecondStepType } from '@renderer/types/auth.type'
import { API_URL } from '@renderer/utils/constant';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup'

const SecondStepComponent: React.FunctionComponent<{ setStep: React.Dispatch<React.SetStateAction<number>>, token: string | null }> = ({ setStep, token }) => {
  const [showPassword, setShowPassword] = useState<{ new_password: boolean, confirm_password: boolean }>({ new_password: false, confirm_password: false })
  const [loading, setLoading] = useState<boolean>(false)

  const navigate = useNavigate()

  const formSchema: Yup.ObjectSchema<AuthForgotPasswordSecondStepType> = Yup.object().shape({
    token: Yup.string().required('Token is required'),
    new_password: Yup.string().required('New password is required'),
    confirm_password: Yup.string().required('Confirm password is required').oneOf([Yup.ref('new_password')], 'Passwords must match')
  })

  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: yupResolver(formSchema) })

  useEffect(() => {
    if (token) {
      reset({ token })
    } else {
      setStep(1)
    }
  }, [reset, setStep, token])

  const onSubmit = (data: AuthForgotPasswordSecondStepType): void => {
    setLoading(true)
    axios.post(API_URL.RESET_PASSWORD, data).then((response) => {
      if (response.data) {
        toast.success(response.data.message)
        navigate('/')
      }
      setLoading(false)
    }).catch((error) => {
      console.log(error)
      setLoading(false)
    })
  }

  return (
    <div className="wrap_box">
      <div className="head">
        <h2>Change Password</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>New Password</label>
          <div className="field">
            <div className="icon">
              <img src={Password} alt="" />
            </div>
            <div className="eye" onClick={() => setShowPassword({ ...showPassword, new_password: !showPassword.new_password })}>
              {showPassword.new_password ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </div>
            <input className="form-control" type={showPassword.new_password ? "text" : "password"} placeholder="********" {...register("new_password")} />
          </div>
          {errors.new_password && <p className="error">{errors.new_password.message}</p>}
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <div className="field">
            <div className="icon">
              <img src={Password} alt="" />
            </div>
            <div className="eye" onClick={() => setShowPassword({ ...showPassword, confirm_password: !showPassword.confirm_password })}>
              {showPassword.confirm_password ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </div>
            <input className="form-control" type={showPassword.confirm_password ? "text" : "password"} placeholder="********" {...register("confirm_password")} />
          </div>
          {errors.confirm_password && <p className="error">{errors.confirm_password.message}</p>}
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

export default SecondStepComponent
