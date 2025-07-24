import React from "react";
import { Link } from "react-router-dom";
import Logo from "@renderer/assets/images/logo.svg";
import Password from "@renderer/assets/images/password-icon.svg";
import { Button } from "@mui/material";
import { IoEyeOffOutline } from "react-icons/io5";

const ForgotPasswordPage: React.FunctionComponent = () => {
  return (
    <div className="auth_page">
      <div className="before_login_sec">
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="Forex Logo" style={{ height: 50 }} />
          </Link>
        </div>
        <div className="wrap_box">
          <div className="head">
            <h2>Change Password</h2>
          </div>
          <form>
            <div className="form-group">
              <label>New Password</label>
              <div className="field">
                <div className="icon">
                  <img src={Password} alt="" />
                </div>
                <div className="eye">
                  <IoEyeOffOutline />
                </div>
                <input className="form-control" type="password" placeholder="********" />
              </div>
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <div className="field">
                <div className="icon">
                  <img src={Password} alt="" />
                </div>
                <div className="eye">
                  <IoEyeOffOutline />
                </div>
                <input className="form-control" type="password" placeholder="********" />
              </div>
            </div>
            <div className="form-group text-center">
              <Button type="submit" className="login">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
