import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@renderer/assets/images/logo.svg";
import FirstStepComponent from "@renderer/components/forgot-password/first_step.component";
import SecondStepComponent from "@renderer/components/forgot-password/second_step.component";

const ForgotPasswordPage: React.FunctionComponent = () => {
  const [step, setStep] = useState<number>(1)
  const [token, setToken] = useState<string | null>(null)

  return (
    <div className="auth_page">
      <div className="before_login_sec">
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="Forex Logo" style={{ height: 50 }} />
          </Link>
        </div>
        {step == 1 && <FirstStepComponent setStep={setStep} setToken={setToken} />}
        {step == 2 && <SecondStepComponent setStep={setStep} token={token} />}
      </div>
    </div>
  )
}

export default ForgotPasswordPage
