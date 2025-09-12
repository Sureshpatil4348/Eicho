import { Button } from '@mui/material'
import axios from '@renderer/config/axios';
import { API_URL } from '@renderer/utils/constant';
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import OTPInput from 'react-otp-input';

const SecondStepComponent: React.FunctionComponent<{ setStep: React.Dispatch<React.SetStateAction<number>>, email: string, setToken: React.Dispatch<React.SetStateAction<string>> }> = ({ setStep, email, setToken }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [code, setCode] = useState<string>('')
  const [resendTimer, setResendTimer] = useState<number>(0)
  const [canResend, setCanResend] = useState<boolean>(true)

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prevTimer) => {
          if (prevTimer <= 1) {
            setCanResend(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [resendTimer]);

  const handleResend = (): void => {
    setLoading(true)
    axios.post(API_URL.FORGOT_PASSWORD, { email }).then((response) => {
      if (response.data.success) {
        toast.success(response.data.message)
        setResendTimer(60)
        setCanResend(false)
      } else {
        toast.error(response.data.message)
      }
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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const onSubmit = (): void => {
    setLoading(true)
    axios.post(API_URL.VERIFY_OTP, { email, code }).then((response) => {
      toast.success(response.data.message)
      setStep(3)
      setLoading(false)
      setToken(response.data.reset_access_token)
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
        <h2>Change Password</h2>
      </div>
      <div className="form-group">
        <label>Enter Code</label>
        <div className="field">
          <OTPInput value={code} containerStyle={{ gap: '10px' }} inputType='tel' inputStyle={{ width: '20%' }} onChange={setCode} numInputs={6} renderInput={(props) => <input {...props} className="form-control" />} />
        </div>
      </div>
      <div className="form-group forgot_password">
        <Button type='button' disabled={!canResend || loading} onClick={handleResend}>
          {canResend ? 'Resend Code' : `Resend Code (${formatTime(resendTimer)})`}
        </Button>
      </div>
      <div className="form-group text-center">
        <Button type="button" className="login" disabled={loading} loading={loading} onClick={onSubmit}>
          Submit
        </Button>
      </div>
    </div>
  )
}

export default SecondStepComponent
